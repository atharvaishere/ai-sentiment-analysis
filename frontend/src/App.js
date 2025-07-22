import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './App.css';
import EmojiSpiralBg from './component/EmojiSpiralBg';

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
          <> 
          <EmojiSpiralBg />  
          <div className="blob-bg">
             <div className="blob blob1"></div>
             <div className="blob blob2"></div>
          </div>
         <div className="container mx-auto p-4 max-w-2xl">
           <h1 className="text-4xl font-extrabold text-center mb-8 tracking-tight text-[#f3f4f6] drop-shadow-lg">
  AI Chatbot with Sentiment Analysis
</h1>
           <div className="chat-window h-96 overflow-y-auto rounded-2xl p-6 bg-[#232834] shadow-xl border border-[#232834]/60">
             {chatHistory.map((chat, index) => (
               <div key={index} className="chat-bubble">
                 <p className="font-semibold text-blue-400 mb-1">You: {chat.user}</p>
                 <p className="text-[#f3f4f6] mb-1">Bot: {chat.bot}</p>
                 <p className="text-xs text-gray-400">Sentiment: {chat.sentiment}</p>
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
    className="border-none rounded-l-xl p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#232834] text-[#f3f4f6] placeholder-gray-400 text-lg"
    placeholder="Type your message..."
  />
  <button
    onClick={sendMessage}
    className="bg-blue-500 text-white p-3 rounded-r-xl hover:bg-blue-600 font-semibold transition"
  >
    Send
  </button>
  <button
    onClick={clearChatHistory}
    className="bg-red-500 text-white p-3 ml-2 rounded-xl hover:bg-red-600 font-semibold transition"
  >
    Clear
  </button>
</div>
         </div>
         </>
       );
     }

export default App;
