# 🧠 AI-Powered Sentiment Analysis Chatbot

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-FF9D00?style=flat&logo=huggingface&logoColor=white)](https://huggingface.co/)
[![React](https://img.shields.io/badge/React-(Upcoming)-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

## 📌 Overview
This project is an advanced AI-powered chatbot designed to engage in natural conversations while simultaneously performing real-time sentiment analysis on user inputs. Built with **Python**, **Flask**, **Hugging Face Transformers**, and **TextBlob**, this application serves as a robust backend API. Future iterations will introduce a responsive React front-end and full deployment on AWS Elastic Beanstalk.

## ✨ Features
- **Conversational AI:** Integrates Hugging Face's BlenderBot for intelligent, human-like dialogue generation.
- **Real-Time Sentiment Analysis:** Leverages TextBlob to analyze and score the emotional tone of incoming messages.
- **RESTful API:** Clean, well-documented Flask endpoints for seamless frontend integration.

## 🛠️ Tech Stack
- **Backend Core:** Python, Flask
- **Machine Learning / NLP:** Hugging Face Transformers (`BlenderBot`), TextBlob
- **Upcoming Roadmap:** React.js (Frontend), AWS Elastic Beanstalk (Cloud Deployment)

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atharvaishere/ai-sentiment-analysis.git
   cd ai-sentiment-analysis
   ```

2. **Set up the virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python3 app.py
   ```

5. **Test the API:**
   Send a `POST` request to the chat endpoint:
   ```bash
   curl -X POST http://localhost:5000/chat -H "Content-Type: application/json" -d '{"message": "I am having a wonderful day!"}'
   ```

## 📈 Current Progress
- [x] Implemented Flask backend with chatbot inference.
- [x] Integrated real-time sentiment analysis.
- [ ] Develop interactive React frontend.
- [ ] Deploy infrastructure to AWS.

---
*Developed by [Atharva Shrivastava](https://github.com/atharvaishere).*