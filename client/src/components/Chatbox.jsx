
import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai'; // For send icon
import {FaRegCopy, FaCopy} from 'react-icons/fa'; // For copy icon
import { FaRegQuestionCircle } from "react-icons/fa";


const Chatbox = ({ onClose, sessionID }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([ 
    { text: "Hello! You can ask questions regarding the article.", isUser: false },
]);
  const [isLoading, setIsLoading] = useState(false);

const handleSend = () => {
    if (message.trim()) {
        setMessages([...messages, { text: message, isUser: true }]);
        setMessage("");
        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER_URL +"/qa", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: message, session_id: sessionID}),
        })
            .then(response => response.json())
            .then(data => {
                data.answer = data.answer.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                setMessages([...messages, { text: message, isUser: true }, { text: data.answer, isUser: false }]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }
};

const handleKeyDown = (event) => {
    if (event.key === "Enter") {
        handleSend();
    }
}

const handleCopyButton = (msg) => {
  navigator.clipboard.writeText(msg.text);
  alert("Copied to clipboard!");
}


  return (
    <div className="fixed bottom-0 right-0 m-4 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg text-black">
      <div className="flex flex-col h-[500px]">
       
        <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center">
        
        <FaRegQuestionCircle size={"30px"}/>
        
          <div className="ml-3">
            <p className="text-xl font-medium">Question-Answering </p>
            <p className="text-gray-500">Ask questions regarding the article</p>
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
              <div className={`inline-block px-4 py-2 rounded-lg whitespace-pre-line ${msg.isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
                <div className=' flex justify-end'>
                <FaRegCopy size={10} className=" mr-2 cursor-pointer" onClick = {() => handleCopyButton(msg)} />
                </div>
                
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
            onKeyDown={handleKeyDown}
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

