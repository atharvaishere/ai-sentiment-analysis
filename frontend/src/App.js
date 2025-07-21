import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
       const [message, setMessage] = useState('');
       const [chatHistory, setChatHistory] = useState(() => {
         // Load chat history from local storage on mount
         const saved = localStorage.getItem('chatHistory');
         return saved ? JSON.parse(saved) : [];
       });
       const [error, setError] = useState(null);


       // Save chat history to local storage whenever it changes
       useEffect(() => {
         localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
       }, [chatHistory]);


       const sendMessage = async () => {
         if (!message.trim()) {
           setError('Please enter a message');
           return;
         }

         try {
           const response = await axios.post('http://127.0.0.1:5000/chat', { message });
           setChatHistory([...chatHistory, { user: message, bot: response.data.response, sentiment: response.data.sentiment }]);
           setMessage('');
           setError(null);
         } catch (err) {
           setError('Failed to get response from server');
         }
       };

       const handleKeyPress = (e) => {
         if (e.key === 'Enter') {
           sendMessage();
         }
       };
      
       const clearChatHistory = () => {
         setChatHistory([]);
         localStorage.removeItem('chatHistory');
       };
       return (
         <div className="container mx-auto p-4 max-w-2xl">
           <h1 className="text-3xl font-bold text-center mb-4">AI Chatbot with Sentiment Analysis</h1>
           <div className="chat-window h-96 overflow-y-auto border rounded-lg p-4 bg-gray-100">
             {chatHistory.map((chat, index) => (
               <div key={index} className="mb-4">
                 <p className="font-semibold text-blue-600">You: {chat.user}</p>
                 <p className="text-gray-800">Bot: {chat.bot}</p>
                 <p className="text-sm text-gray-500">Sentiment: {chat.sentiment}</p>
               </div>
             ))}
           </div>
           {error && <p className="text-red-500 mt-2">{error}</p>}
           <div className="mt-4 flex">
             <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyPress={handleKeyPress}
               className="border rounded-l-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="Type your message..."
             />
             <button
               onClick={sendMessage}
               className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
             >
               Send
             </button>
             <button
               onClick={clearChatHistory}
               className="bg-red-500 text-white p-2 ml-2 rounded-lg hover:bg-red-600"
             >
               Clear
             </button>
           </div>
         </div>
       );
     }

export default App;
