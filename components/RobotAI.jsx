'use client';
import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const RobotAI = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [showChatBox, setShowChatBox] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🤖 Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  // Tự động ẩn/hiện tooltip lời chào
  useEffect(() => {
    const interval = setInterval(() => {
      setShowMessage(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Vô hiệu hóa pointer-events cho canvas Spline
  useEffect(() => {
    const splineCanvas = document.querySelector('.robot-canvas canvas');
    if (splineCanvas) {
      splineCanvas.style.pointerEvents = 'none';
    }
  }, []);

  const handleClick = () => setShowChatBox(true);
  const handleClose = () => setShowChatBox(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input.trim() };
    const botReply = { from: 'bot', text: '🤖 I received your message!' };

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Robot AI */}
      <div className="relative">
        {showMessage && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full shadow-md text-sm whitespace-nowrap">
            💬 Hello, how can I help you?
          </div>
        )}

        {/* Robot */}
        <div
          onClick={handleClick}
          className="cursor-pointer w-20 h-20 md:w-28 md:h-28 robot-canvas"
          style={{ pointerEvents: 'auto' }}
        >
          <Spline scene="https://prod.spline.design/TdsF5XyRrgvlMudf/scene.splinecode" />
        </div>
      </div>

      {/* Chat Box */}
      <div
        className={`mt-4 w-80 bg-[#111] text-white rounded-lg shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 
        ${showChatBox ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2">
          <p className="font-semibold">AI Assistant</p>
          <button onClick={handleClose} className="text-white font-bold">×</button>
        </div>

        {/* Chat messages */}
        <div className="p-4 text-sm h-48 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-[80%] 
                ${msg.from === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-gray-800 text-white'}`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-gray-700 p-2 bg-[#111]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm px-3 py-2 rounded bg-gray-900 text-white outline-none placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotAI;
