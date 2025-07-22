from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline , AutoModelForCausalLM, AutoTokenizer
from textblob import TextBlob
import sqlite3
import logging
import requests
import uuid
app = Flask(__name__)

CORS(app)
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


try:
         sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
         tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
         model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
         logger.info("Models initialized successfully")
except Exception as e:
         logger.error(f"Failed to initialize models: {e}")
         raise
    
# Initialize SQLite database
def init_db():
         conn = sqlite3.connect('chat_history.db')
         c = conn.cursor()
         c.execute('''CREATE TABLE IF NOT EXISTS conversations
                      (session_id TEXT, user_input TEXT, bot_response TEXT, sentiment TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
         conn.commit()
         conn.close()

init_db()

# Store conversation history in memory for context
conversation_sessions = {}


# Helper function to generate DialoGPT response
def generate_response(user_input, session_id):
         if session_id not in conversation_sessions:
             conversation_sessions[session_id] = []
         # Append user input to session history
         conversation_sessions[session_id].append({"role": "user", "content": user_input})
         # Limit context to last 5 exchanges
         context = conversation_sessions[session_id][-5:]
         # Prepare input for DialoGPT
         input_text = " EOS ".join([msg["content"] for msg in context])
         input_ids = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors='pt')
         # Generate response
         response_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
         bot_response = tokenizer.decode(response_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
         conversation_sessions[session_id].append({"role": "bot", "content": bot_response})
         return bot_response


# Helper function to store conversation in SQLite
def store_conversation(session_id, user_input, bot_response, sentiment):
         conn = sqlite3.connect('chat_history.db')
         c = conn.cursor()
         c.execute("INSERT INTO conversations (session_id, user_input, bot_response, sentiment) VALUES (?, ?, ?, ?)",
                   (session_id, user_input, bot_response, sentiment))
         conn.commit()
         conn.close()



# Route for chatbot interaction
@app.route("/chat", methods=["POST"])
def chat():
         try:
             data = request.json
             user_input = data.get("message")
             session_id = data.get("session_id", str(uuid.uuid4()))

             if not user_input:
                 return jsonify({"error": "No message provided"}), 400

             # Sentiment analysis
             sentiment_result = sentiment_analyzer(user_input)[0]
             sentiment_label = sentiment_result['label'].lower()
             sentiment_score = sentiment_result['score']

             # Generate context-aware response
             bot_response = generate_response(user_input, session_id)

             # Adjust response based on sentiment
             if sentiment_label == "negative":
                 bot_response = f"I'm sorry you're feeling down. {bot_response} Maybe I can help with some advice?"
             elif sentiment_label == "positive":
                 bot_response = f"That's awesome to hear! {bot_response}"

             # Store in database
             store_conversation(session_id, user_input, bot_response, sentiment_label)

             logger.info(f"Session: {session_id}, User: {user_input}, Sentiment: {sentiment_label}, Response: {bot_response}")
             return jsonify({"response": bot_response, "sentiment": sentiment_label, "session_id": session_id})

         except Exception as e:
             logger.error(f"Error processing chat request: {e}")
             return jsonify({"error": "Internal server error"}), 500
         


 # Assist endpoint for task-oriented help
@app.route("/assist", methods=["POST"])
def assist():
         try:
             data = request.json
             user_input = data.get("message")
             session_id = data.get("session_id", str(uuid.uuid4()))

             if not user_input:
                 return jsonify({"error": "No message provided"}), 400

             # Sentiment analysis
             sentiment_result = sentiment_analyzer(user_input)[0]
             sentiment_label = sentiment_result['label'].lower()

             # Task-oriented responses
             if "job" in user_input.lower() or "career" in user_input.lower():
                 # Mock job search response (replace with real API in production)
                 response = "I can suggest some job search tips for Ireland! Try checking LinkedIn, Indeed, or IrishJobs.ie. Tailor your CV to highlight projects like this chatbot. Want specific advice for software engineering roles?"
                 # Example: Uncomment to use a real API (if available)
                 # response = requests.get("https://api.github.com/repos/octocat/hello-world").json()
                 # bot_response = f"Found a job-related repo: {response['name']}"
             elif "coding" in user_input.lower() or "programming" in user_input.lower():
                 response = "Need coding help? I can explain Python, React, or Flask concepts. For example, try using list comprehensions for cleaner Python code: `[x**2 for x in range(10)]`. Ask me about a specific topic!"
             else:
                 response = generate_response(user_input, session_id)

             # Adjust response based on sentiment
             if sentiment_label == "negative":
                 response = f"Sounds like you're feeling stressed. {response} How about some resources to boost your mood? Try freeCodeCamp for learning or a quick mindfulness break."
             elif sentiment_label == "positive":
                 response = f"You're in high spirits! {response} Keep it up!"

             # Store in database
             store_conversation(session_id, user_input, response, sentiment_label)

             logger.info(f"Session: {session_id}, User: {user_input}, Sentiment: {sentiment_label}, Response: {response}")
             return jsonify({"response": response, "sentiment": sentiment_label, "session_id": session_id})

         except Exception as e:
             logger.error(f"Error processing assist request: {e}")
             return jsonify({"error": "Internal server error"}), 500        

if __name__ == "__main__":
    app.run(debug=True)