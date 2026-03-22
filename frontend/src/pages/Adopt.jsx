import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Truck, RefreshCcw, CheckCircle, Leaf, Smartphone, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const Adopt = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiVerification, setShowUpiVerification] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Explorer',
      price: 499,
      duration: 'per month',
      features: [
        '1 New Toy Every Month',
        'Free Shipping & Returns',
        'Basic Toy Passport',
        'Cancel Anytime',
      ],
      recommended: false,
    },
    {
      id: 'quarterly',
      name: 'Quarterly Adventurer',
      price: 1299,
      duration: 'every 3 months',
      features: [
        '3 New Toys Every Quarter',
        'Free Shipping & Returns',
        'Detailed Digital Toy Passport',
        'Priority Customer Support',
        '10% Admin Store Discount'
      ],
      recommended: true,
    },
    {
      id: 'yearly',
      name: 'Yearly Guardian',
      price: 4999,
      duration: 'per year',
      features: [
        '12 Toys Across the Year',
        'Free Shipping & Returns',
        'Premium Wood Engraved Passport',
        '24/7 VIP Support',
        '25% Admin Store Discount',
        'Exclusive Artisan Meet & Greet (Virtual)'
      ],
      recommended: false,
    }
  ];

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

  const handleSubscribe = () => {
    setShowUpiVerification(true);
    setTimeLeft(300);
  };

  const submitUpiPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      toast.error('Please enter a valid 12-digit UPI Transaction ID');
      return;
    }
    
    setIsProcessing(true);
    try {
      const selectedPlanDetails = plans.find(p => p.id === selectedPlan);
      const payload = {
        totalAmount: selectedPlanDetails.price,
        toys: [], // Subscription doesn't have specific cart toys
        paymentMethod: 'UPI',
        orderType: 'SUBSCRIPTION',
        transactionId: utrNumber
      };
      
      await axiosClient.post('/api/orders/create', payload);

      setIsProcessing(false);
      setShowUpiVerification(false);
      toast.success('Successfully Subscribed! Redirecting to Dashboard...');
      navigate('/dashboard');
    } catch(err) {
      console.error(err);
      toast.error('Failed to process subscription');
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showUpiVerification) {
    const selectedPlanDetails = plans.find(p => p.id === selectedPlan);
    const amount = selectedPlanDetails.price;
    const upiId = "7483608721-2@ybl";
    const upiLink = `upi://pay?pa=${upiId}&pn=Ramya%20C&am=${amount}&cu=INR`;
    
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-gray-50 transition-colors duration-300 p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col max-w-lg w-full border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="text-purple-600" /> Subscription Checkout
            </h2>
            <div className="text-red-500 font-bold flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full text-sm">
              <Clock size={16} /> {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start text-center md:text-left">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 shrink-0">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`} 
                 alt="PhonePe QR Code" 
                 className="w-32 h-32"
               />
               <p className="text-xs text-center mt-2 text-gray-500 font-medium">Scan to Pay</p>
            </div>
            
            <div className="flex-1 w-full space-y-3">
               <p className="text-sm text-gray-600 font-medium">Please pay the exact amount below to start your <strong className="text-gray-900">{selectedPlanDetails.name}</strong>.</p>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                    <span className="font-bold text-xl text-green-600">₹{amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">UPI ID</span>
                    <span className="font-mono font-bold text-sm text-gray-900">{upiId}</span>
                  </div>
               </div>
               
               <a 
                 href={upiLink}
                 className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm flex justify-center items-center gap-2 md:hidden"
               >
                 Tap to Pay in App
               </a>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
             <h3 className="text-sm justify-center font-bold text-blue-900 mb-2">Verification details</h3>
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
               
               <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">Or Upload Payment Screenshot (Optional)</label>
                  <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
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
    <div className="pt-24 pb-20 bg-secondary min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
              <Heart size={48} className="text-accent" fill="currentColor" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-6">
            Adopt, Play, Return.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-primary-foreground/90 font-medium max-w-2xl mx-auto">
            Give wooden toys a beautiful lifecycle. Subscribe to get curated Channapatna toys delivered, play as long as you want, and return them for someone else to love.
          </motion.p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-textMain mb-4">How Toy Adoption Works</h2>
          <p className="text-textMuted max-w-2xl mx-auto">Join the circular toy economy. Save money, reduce waste, and keep your kids engaged with safe, non-toxic wooden toys.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-3">1. Receive & Play</h3>
            <p className="text-textMuted">Get a box of sanitized, premium Channapatna wooden toys delivered right to your door based on your child's age.</p>
          </div>
          <div className="text-center relative">
            <div className="hidden md:block absolute top-10 left-[-10%] w-[120%] h-0.5 bg-gray-200 -z-10 bg-dashed"></div>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-3">2. Nurture</h3>
            <p className="text-textMuted">Your child enjoys the toys, exploring natural textures and safe vegetable dyes while developing motor skills.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <RefreshCcw size={32} />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-3">3. Exchange</h3>
            <p className="text-textMuted">Return them when your child outgrows them. We sanitize and repair them for the next family, and send you a new batch!</p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-primary border-t border-borderColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-textMain mb-4">Choose Your Adoption Plan</h2>
            <p className="text-textMuted">Flexible subscriptions for every family.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`card relative border-2 transition-all cursor-pointer ${
                  selectedPlan === plan.id ? 'border-primary ring-4 ring-primary/20 scale-105 z-10' : 'border-gray-100 hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-textMain mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-primary">₹{plan.price}</span>
                    <span className="text-textMuted font-medium pb-1">/{plan.duration}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-textMuted font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-full font-bold transition-all shadow-md ${
                    selectedPlan === plan.id
                      ? 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
                      : 'bg-secondary text-textMain hover:bg-neutral-800'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                       Processing...
                    </span>
                  ) : (
                     selectedPlan === plan.id ? 'Subscribe Now' : 'Select Plan'
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-6 py-3 rounded-full font-semibold border border-green-200">
               <ShieldCheck size={20} />
               All toys are fully sanitized with non-toxic solutions between adoptions.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Adopt;
