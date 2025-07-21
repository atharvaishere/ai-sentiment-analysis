import pytest
from app import app

@pytest.fixture

def client():
         app.config['TESTING'] = True
         with app.test_client() as client:
             yield client

def test_chat_endpoint_empty_input(client):
         response = client.post('/chat', json={})
         assert response.status_code == 400
         assert response.json == {'error': 'No message provided'}

def test_chat_endpoint_valid_input(client):
         response = client.post('/chat', json={'message': 'I’m happy!'})
         assert response.status_code == 200
         assert 'response' in response.json
         assert 'sentiment' in response.json