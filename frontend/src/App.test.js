import { render, screen, fireEvent } from '@testing-library/react';
     import App from './App';

     test('renders chatbot title', () => {
       render(<App />);
       expect(screen.getByText(/AI Chatbot with Sentiment Analysis/i)).toBeInTheDocument();
     });

     test('displays error for empty message', () => {
       render(<App />);
       const sendButton = screen.getByText(/Send/i);
       fireEvent.click(sendButton);
       expect(screen.getByText(/Please enter a message/i)).toBeInTheDocument();
     });

     test('clears chat history', () => {
       localStorage.setItem('chatHistory', JSON.stringify([{ user: 'test', bot: 'response', sentiment: 'neutral' }]));
       render(<App />);
       const clearButton = screen.getByText(/Clear/i);
       fireEvent.click(clearButton);
       expect(localStorage.getItem('chatHistory')).toBeNull();
     });