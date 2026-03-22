import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const QUICK_REPLIES = [
  "How to order?",
  "Shipping policy",
  "Return policy",
  "Are toys safe?",
  "Talk to Agent"
];

const ChatBot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Lumby, your wooden toy expert. How can I help you today? 🚂' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle Polling for Human Mode
  useEffect(() => {
    let interval;
    if (isOpen && isHumanMode && isAuthenticated) {
      const fetchMessages = async () => {
        try {
          const res = await axiosClient.get(`/api/support/messages/${user._id}`);
          // Transform backend messages to local format
          const formatted = res.data.map(m => ({
            sender: m.sender,
            text: m.message
          }));
          
          // Initial message + backend messages
          setMessages([
            { sender: 'bot', text: 'Connected to a human support agent. How can we help you? 🎧' },
            ...formatted
          ]);
        } catch (err) {
          console.error("Failed to fetch support messages", err);
        }
      };
      
      fetchMessages();
      interval = setInterval(fetchMessages, 4000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isHumanMode, isAuthenticated, user]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    if (isHumanMode) {
      if (!isAuthenticated) {
        setMessages(prev => [...prev, { sender: 'user', text }, { sender: 'bot', text: 'Please login to speak with a human agent.' }]);
        return;
      }
      try {
        await axiosClient.post('/api/support/send', {
          userId: user._id,
          message: text,
          sender: 'user'
        });
        setInput('');
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // Bot Mode
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    
    if (text === "Talk to Agent" || text.toLowerCase().includes("human") || text.toLowerCase().includes("agent")) {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (!isAuthenticated) {
                setMessages(prev => [...prev, { sender: 'bot', text: "I'd love to connect you! Please log in first so our team knows who they're helping. 😊" }]);
            } else {
                setIsHumanMode(true);
                setMessages(prev => [...prev, { sender: 'bot', text: "Handing you over to a human agent... please wait a moment! 🎧" }]);
            }
        }, 1000);
        return;
    }

    setIsTyping(true);
    const userMessage = text.toLowerCase();

    // Mock bot responses (Restored from previous step)
    setTimeout(() => {
      let botResponse = "I'm not sure I understand that yet. 🧩 Would you like to check our FAQ page or speak with a human support agent?";
      
      const greetings = ['hi', 'hello', 'hey', 'namaste', 'morning', 'afternoon', 'evening'];
      const pricing = ['price', 'cost', 'how much', 'expensive', 'cheap', 'amount'];
      const location = ['location', 'where', 'address', 'place', 'find you', 'city'];
      const account = ['account', 'login', 'register', 'signup', 'password', 'profile'];
      const contact = ['contact', 'phone', 'email', 'call', 'support', 'help'];
      const discount = ['discount', 'offer', 'promo', 'coupon', 'sale', 'save', 'win', 'spin'];

      if (greetings.some(word => userMessage.includes(word))) {
        botResponse = '👋 Hello there! I am Lumby. I can help you with orders, shipping info, or tell you about our beautiful Channapatna toys! What\'s on your mind?';
      } else if (pricing.some(word => userMessage.includes(word))) {
        botResponse = '💰 Our handcrafted toys range from ₹199 to ₹4999. You can see the exact prices for each toy in our Marketplace!';
      } else if (location.some(word => userMessage.includes(word))) {
        botResponse = '📍 Our artisans are based in Channapatna, Karnataka (India). We ship globally from our main workshop there! 🌍';
      } else if (account.some(word => userMessage.includes(word))) {
        botResponse = '👤 You can manage your profile, orders, and wishlist from your Dashboard. Don\'t forget to create an account to track your adoptions!';
      } else if (contact.some(word => userMessage.includes(word))) {
        botResponse = '📞 You can reach our human support team at support@lumbertimber.com or call us at +91 98765 43210 (Mon-Sat, 9AM-6PM).';
      } else if (discount.some(word => userMessage.includes(word))) {
        botResponse = '🎁 Looking for a deal? Try your luck with our **Spin & Win** wheel in the bottom-left corner of the homepage! You can win up to 10% off your next order. 🎡';
      } else if (userMessage.includes('shipping') || userMessage.includes('delivery')) {
        botResponse = '📦 We offer free shipping on orders over ₹2000! Most orders reach within 3-5 business days across India.';
      } else if (userMessage.includes('return') || userMessage.includes('refund')) {
        botResponse = '↩️ Hassle-free returns! You can request a return from your Dashboard within 7 days of delivery.';
      } else if (userMessage.includes('material') || userMessage.includes('wood') || userMessage.includes('safe')) {
        botResponse = '🌿 Safety first! All our toys are made from eco-friendly Hale wood and colored with non-toxic vegetable dyes. Completely safe for kids!';
      } else if (userMessage.includes('order')) {
        botResponse = '🛒 Just browse our Marketplace, add toys to your cart, and proceed to checkout with our secure UPI payment system!';
      } else if (userMessage.includes('artisans') || userMessage.includes('story')) {
        botResponse = '🎨 Our toys are handcrafted by traditional artisans in Channapatna, also known as Gombegala Ooru (Toy Town). Every purchase supports local craftsmanship!';
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(234,88,12,0.3)] hover:scale-110 transition-transform z-50 overflow-hidden group border-2 border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isHumanMode ? <Headphones size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-24 right-6 w-[350px] h-[580px] bg-primary border border-borderColor rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`p-6 text-white relative transition-colors duration-500 ${isHumanMode ? 'bg-indigo-600' : 'bg-accent'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
              </div>
              <div className="flex justify-between items-center mb-1 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                    {isHumanMode ? <Headphones size={24} /> : <Bot size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight">{isHumanMode ? 'Agent Support' : 'Lumby Support'}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">{isHumanMode ? 'Human Agent' : 'Always Online'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                   {isHumanMode && (
                     <button onClick={() => setIsHumanMode(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-[10px] uppercase font-bold transition-all border border-white/20">
                       Exit Agent
                     </button>
                   )}
                   <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full text-white transition-colors">
                     <X size={20} />
                   </button>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-auto flex-shrink-0 ${
                      msg.sender === 'user' ? 'bg-accent/20 text-accent' : msg.sender === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-secondary text-textMain/50 border border-borderColor'
                    }`}>
                      {msg.sender === 'user' ? <User size={14} /> : msg.sender === 'admin' ? <Headphones size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-accent text-white rounded-br-sm' 
                        : msg.sender === 'admin' 
                        ? 'bg-indigo-600 text-white rounded-tl-sm' 
                        : 'bg-primary border border-borderColor text-textMain rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-textMain/30 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-textMain/30 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-textMain/30 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {!isHumanMode && (
              <div className="px-4 py-2 border-t border-borderColor bg-primary flex gap-2 overflow-x-auto no-scrollbar pb-3">
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(reply)}
                    className="whitespace-nowrap px-3 py-1.5 bg-secondary text-textMain/70 text-xs font-bold rounded-full border border-borderColor hover:bg-accent hover:text-white hover:border-accent transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
              className="p-4 bg-primary flex gap-2 border-t border-borderColor"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isHumanMode ? "Reply to agent..." : "Ask me anything..."}
                className="flex-1 px-4 py-3 rounded-xl border border-borderColor bg-secondary outline-none focus:border-accent text-sm transition-all focus:ring-2 focus:ring-accent/10"
              />
              <button 
                type="submit" 
                className={`${isHumanMode ? 'bg-indigo-600' : 'bg-accent'} text-white p-3 rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95`}
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
