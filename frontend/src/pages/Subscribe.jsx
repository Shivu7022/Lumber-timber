import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, Sparkles, CheckCircle2, Gift, Leaf, Smartphone, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const Subscribe = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showUpiVerification, setShowUpiVerification] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  useEffect(() => {
    let timer;
    if (showUpiVerification && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowUpiVerification(false);
      toast.error("Payment session expired. Please try again.");
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [showUpiVerification, timeLeft]);

  const handleSubscribeClick = (plan, duration, price) => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      navigate('/login');
      return;
    }
    setSelectedPlanDetails({ plan, duration, price });
    setShowUpiVerification(true);
    setTimeLeft(300);
  };

  const submitUpiPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      toast.error("Please enter a valid 12-digit UPI Transaction ID");
      return;
    }

    setIsProcessing(true);
    try {
      await axiosClient.post('/api/subscriptions', { 
        plan: selectedPlanDetails.plan, 
        duration: selectedPlanDetails.duration 
      });
      toast.success(`Successfully subscribed to ${selectedPlanDetails.plan}!`);
      setShowUpiVerification(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Failed to subscribe');
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showUpiVerification) {
    const upiId = "7483608721-2@ybl";
    const upiLink = `upi://pay?pa=${upiId}&pn=Lumber%20Timber&am=${selectedPlanDetails.price}&cu=INR`;
    
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-gray-50 transition-colors duration-300 p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col max-w-lg w-full border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="text-purple-600" /> UPI Subscription
            </h2>
            <div className="text-red-500 font-bold flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full text-sm">
              <Clock size={16} /> {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start text-center md:text-left">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 shrink-0">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`} 
                 alt="UPI QR Code" 
                 className="w-32 h-32"
               />
               <p className="text-xs text-center mt-2 text-gray-500 font-medium">Scan to Pay</p>
            </div>
            
            <div className="flex-1 w-full space-y-3">
               <p className="text-sm text-gray-600 font-medium">Please pay the exact amount below to activate your {selectedPlanDetails.plan}.</p>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                    <span className="font-bold text-xl text-green-600">₹{selectedPlanDetails.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">UPI ID</span>
                    <span className="font-mono font-bold text-sm text-gray-900">{upiId}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
             <form onSubmit={submitUpiPayment} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-blue-800 mb-1">Enter 12-digit UPI Transaction ID (UTR)</label>
                 <input 
                   type="text" 
                   required
                   value={utrNumber}
                   onChange={(e) => setUtrNumber(e.target.value)}
                   placeholder="e.g. 123456789012"
                   className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               
               <button disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 flex justify-center items-center gap-2">
                  {isProcessing ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Confirm Payment'}
               </button>
             </form>
          </div>
          
          <button onClick={() => setShowUpiVerification(false)} className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-900">
             Cancel Payment
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <PackageOpen size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-6xl font-black text-textMain mb-6 leading-tight"
          >
            Magic Delivered <span className="text-accent underline decoration-wavy decoration-accent/40">Monthly</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-textMuted font-medium leading-relaxed">
            Get a curated box of age-appropriate, handcrafted Channapatna toys delivered to your doorstep every month. 
            Spark their imagination while supporting local artisans!
          </motion.p>
        </div>

        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-primary p-8 rounded-3xl border border-borderColor text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Leaf size={28} /></div>
            <h3 className="text-xl font-bold text-textMain mb-3">1. Tell us about your child</h3>
            <p className="text-textMuted font-medium">Select their age, interests, and developmental stage.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-primary p-8 rounded-3xl border border-borderColor text-center shadow-sm relative">
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-secondary rounded-full -mt-4 hidden md:block border border-borderColor"></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-secondary rounded-full -mt-4 hidden md:block border border-borderColor"></div>
            <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6"><Sparkles size={28} /></div>
            <h3 className="text-xl font-bold text-textMain mb-3">2. We curate the magic</h3>
            <p className="text-textMuted font-medium">Our experts handpick 2-3 premium wooden toys perfect for their growth.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-primary p-8 rounded-3xl border border-borderColor text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Gift size={28} /></div>
            <h3 className="text-xl font-bold text-textMain mb-3">3. Unbox the joy</h3>
            <p className="text-textMuted font-medium">A beautiful eco-friendly box arrives every month. Free shipping included!</p>
          </motion.div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 3 Months Plan */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-primary p-8 md:p-10 rounded-[2rem] border border-borderColor shadow-theme">
            <h3 className="text-2xl font-bold text-textMain mb-2">Explorer Plan</h3>
            <p className="text-textMuted font-medium mb-6">Perfect to test the waters.</p>
            <div className="flex items-end gap-2 mb-8 border-b border-secondary pb-6">
              <span className="text-5xl font-black text-textMain">₹2,499</span>
              <span className="text-lg font-bold text-textMuted mb-1">/ 3 months</span>
            </div>
            <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-textMain font-medium"><CheckCircle2 className="text-green-500 shrink-0" size={20}/> 2 Premium Toys per month</li>
               <li className="flex items-center gap-3 text-textMain font-medium"><CheckCircle2 className="text-green-500 shrink-0" size={20}/> Free Standard Shipping</li>
               <li className="flex items-center gap-3 text-textMuted font-medium"><CheckCircle2 className="text-gray-300 shrink-0" size={20}/> Surprise Birthday Gift</li>
            </ul>
            <button onClick={() => handleSubscribeClick('Explorer Plan', 3, 2499)} className="w-full bg-secondary text-textMain py-4 rounded-xl font-bold hover:bg-borderColor transition-colors border border-borderColor">Choose Explorer</button>
          </motion.div>

          {/* 6 Months Plan (Featured) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-accent p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-white text-accent px-4 py-1 rounded-bl-2xl font-black text-xs uppercase tracking-widest">Most Popular</div>
            <h3 className="text-2xl font-bold text-white mb-2">Artisan Plan</h3>
            <p className="text-white/80 font-medium mb-6">The ultimate toy discovery journey.</p>
            <div className="flex items-end gap-2 mb-8 border-b border-white/20 pb-6">
              <span className="text-5xl font-black text-white">₹4,499</span>
              <span className="text-lg font-bold text-white/80 mb-1">/ 6 months</span>
            </div>
            <ul className="space-y-4 mb-8">
               <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="text-white shrink-0" size={20}/> 2-3 Premium Toys per month</li>
               <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="text-white shrink-0" size={20}/> Free Priority Shipping</li>
               <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="text-white shrink-0" size={20}/> Special Artisan Story Cards</li>
               <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="text-white shrink-0" size={20}/> Surprise Birthday Wood Craft</li>
            </ul>
            <button onClick={() => handleSubscribeClick('Artisan Plan', 6, 4499)} className="w-full bg-white text-accent py-4 rounded-xl font-black hover:bg-gray-50 transition-colors shadow-lg shadow-black/10">Choose Artisan</button>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
           <p className="text-textMuted font-medium mb-4">Not sure which plan is right for you?</p>
           <Link to="/contact" className="text-accent font-bold hover:underline">Get in touch with our toy experts →</Link>
        </div>

      </div>
    </div>
  );
};

export default Subscribe;
