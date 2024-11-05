import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const TextChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef();
  const chatTextAreaRef = useRef();

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3000');

    // Socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socketRef.current.emit('message', inputMessage);
      setInputMessage('');
    }
  };

  const handleNext = () => {
    // Implement next chat functionality
    setMessages([]);
    socketRef.current.emit('findNewChat');
  };

  const handleDeleteRecords = () => {
    // Implement delete records functionality
    setMessages([]);
    socketRef.current.emit('deleteRecords');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <img 
              className="h-12 w-auto"
              src="/img/Logo.png" 
              alt="Omegle Logo" 
            />
            <h2 className="text-xl font-semibold">Talk to stranger</h2>
            <div className="text-green-600">5000+ online now</div>
          </div>
        </nav>
      </header>

      <main className="flex-grow bg-blue-100">
        <div className="container mx-auto p-4 h-full">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-grow overflow-auto mb-4">
              <div className="mb-4">
                <p className="text-gray-700">You are now chatting with a random stranger</p>
                <p className="text-gray-700">You both speak the same language - English</p>
                <hr className="my-2 border-gray-300" />
              </div>
              
              <div ref={chatTextAreaRef} className="space-y-2">
                {messages.map((msg, index) => (
                  <p key={index} className="text-gray-800">{msg}</p>
                ))}
              </div>
            </div>

            {/* Only show in development */}
            <button 
              onClick={handleDeleteRecords}
              className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Delete All Records [Remove in production]
            </button>

            <div className="mt-auto">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
                
                <div className="flex gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-lg resize-none"
                    rows="4"
                    placeholder="Type your message..."
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextChat;