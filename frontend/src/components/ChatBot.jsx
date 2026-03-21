import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const userMessage = input.toLowerCase();
    setInput('');

    // Mock bot response
    setTimeout(() => {
      let botResponse = 'Thank you for reaching out! Our team will get back to you soon.';
      
      if (userMessage.includes('shipping') || userMessage.includes('delivery')) {
        botResponse = 'We offer free shipping on orders over ₹2000. Most orders are delivered within 3-5 business days.';
      } else if (userMessage.includes('return') || userMessage.includes('refund')) {
        botResponse = 'You can request a return from your Dashboard > Adoptions/Returns within 7 days of delivery.';
      } else if (userMessage.includes('material') || userMessage.includes('wood') || userMessage.includes('safe')) {
        botResponse = 'All our toys are made from eco-friendly Hale wood and colored with natural, non-toxic vegetable dyes.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-theme hover:scale-110 transition-transform z-50 overflow-hidden"
      >
        <span className="absolute inset-0 bg-accent animate-ping opacity-20 rounded-full"></span>
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-primary border border-borderColor rounded-2xl shadow-theme z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-accent p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20} /> Support Chat
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-secondary/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-accent text-white rounded-tr-sm' 
                      : 'bg-primary border border-borderColor text-textMain rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-borderColor p-3 bg-primary flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-lg border border-borderColor bg-secondary outline-none focus:border-accent text-sm"
              />
              <button 
                type="submit" 
                className="bg-accent text-white p-2 text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
