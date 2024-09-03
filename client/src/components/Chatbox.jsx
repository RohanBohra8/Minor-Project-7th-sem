
import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai'; // For send icon
import { FaRegQuestionCircle } from "react-icons/fa";


const Chatbox = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([ //few hard coded mssgs here 
    { text: "Hello!", isUser: true },
    { text: "Hi there!", isUser: false },
    { text: "How are you?", isUser: true },
    { text: "I'm good, thanks!", isUser: false },
    { text: "What about you?", isUser: true },
    { text: "I'm doing great!", isUser: false },
    { text: "That's good to hear!", isUser: true },
    { text: "game khelga ?", isUser: false },
    { text: "konsi?", isUser: true },
    { text: "ghost of tshushima", isUser: false },
]);
  const [isLoading, setIsLoading] = useState(false);

const handleSend = () => {
    if (message.trim()) {
        setMessages([...messages, { text: message, isUser: true }]);
        setMessage("");
        setIsLoading(true);

        // Simulate API call
        fetch("http://localhost:5000/question-answering", { //jo bhi ho api voh dekh lena jha se response ayega
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        })
            .then(response => response.json())
            .then(data => {
                setMessages([...messages, { text: message, isUser: true }, { text: data.reply, isUser: false }]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }
};


  return (
    <div className="fixed bottom-0 right-0 m-4 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="flex flex-col h-[500px]">
       
        <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center">
        
        <FaRegQuestionCircle size={"30px"}/>
        
          <div className="ml-3">
            <p className="text-xl font-medium">Q&A Assistant</p>
            <p className="text-gray-500">Ask questions regarding your generated summary</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-1 right-1 w-8 h-8 bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none"
            >
            x
          </button>
        </div>

        <div className="flex-grow p-2 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.isUser ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${msg.isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-blue-600">Generating...</div>}
        </div>

        <div className="flex items-center p-2 border-t border-gray-300 bg-gray-50">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <AiOutlineSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;

