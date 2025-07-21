from flask import Flask, request, jsonify
from transformers import pipeline
from textblob import TextBlob

app = Flask(__name__)

 # Initialize Hugging Face chatbot model
chatbot = pipeline("text2text-generation", model="facebook/blenderbot-400M-distill")
# Route for chatbot interaction
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    # Perform sentiment analysis
    sentiment = TextBlob(user_input).sentiment.polarity
    sentiment_label = "positive" if sentiment > 0 else "negative" if sentiment < 0 else "neutral"
    # Generate chatbot response
    response = chatbot(user_input, max_length=100, do_sample=True)
    bot_response = response[0]["generated_text"]
    # Adjust response based on sentiment
    if sentiment_label == "negative":
        bot_response = f"I'm sorry you're feeling that way. {bot_response} How can I help?"
    elif sentiment_label == "positive":
        bot_response = f"That's great to hear! {bot_response}"
    return jsonify({"response": bot_response, "sentiment": sentiment_label})

if __name__ == "__main__":
    app.run(debug=True)