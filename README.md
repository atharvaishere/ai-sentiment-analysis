 ## Overview
 This project is an AI-powered chatbot that engages in conversations and performs real-time sentiment analysis on user inputs. Built with Python, Flask, Hugging Face Transformers, and TextBlob, it will include a React front-end and AWS deployment in future iterations.

 ## Features
 - Conversational AI using Hugging Face's BlenderBot.
 - Real-time sentiment analysis with TextBlob.
 - Flask API for handling chat requests.

 ## Tech Stack
 - **Backend**: Python, Flask, Hugging Face Transformers, TextBlob
 - **Future**: React (front-end), AWS Elastic Beanstalk (deployment)

 ## Setup Instructions
 1. Clone the repository:
    ```bash
    git clone https://github.com/atharvaishere/ai-chatbot-sentiment-analysis.git
    ```
 2. Set up the virtual environment:
    ```bash
    cd ai-chatbot-sentiment-analysis
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
 3. Run the Flask app:
    ```bash
    python3 app.py
    ```
 4. Test the API at `http://localhost:5000/chat` with a POST request (e.g., `{"message": "Hello"}`).

 ## Current Progress
 - Implemented Flask backend with chatbot and sentiment analysis.
 - Next steps: Add React front-end and deploy to AWS.

 ## Contact
 Atharva Shrivastava - [LinkedIn](https://www.linkedin.com/in/atharva-shrivastava-083970182/)































































































































































Last updated: 2025-12-26 •