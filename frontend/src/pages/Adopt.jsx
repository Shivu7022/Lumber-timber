import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Truck, RefreshCcw, CheckCircle, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Adopt = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Simulate API call for subscription
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Successfully Subscribed! Redirecting to Dashboard...');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
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
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">How Toy Adoption Works</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Join the circular toy economy. Save money, reduce waste, and keep your kids engaged with safe, non-toxic wooden toys.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">1. Receive & Play</h3>
            <p className="text-neutral-600">Get a box of sanitized, premium Channapatna wooden toys delivered right to your door based on your child's age.</p>
          </div>
          <div className="text-center relative">
            <div className="hidden md:block absolute top-10 left-[-10%] w-[120%] h-0.5 bg-gray-200 -z-10 bg-dashed"></div>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">2. Nurture</h3>
            <p className="text-neutral-600">Your child enjoys the toys, exploring natural textures and safe vegetable dyes while developing motor skills.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <RefreshCcw size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">3. Exchange</h3>
            <p className="text-neutral-600">Return them when your child outgrows them. We sanitize and repair them for the next family, and send you a new batch!</p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Choose Your Adoption Plan</h2>
            <p className="text-neutral-600">Flexible subscriptions for every family.</p>
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
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-primary">₹{plan.price}</span>
                    <span className="text-neutral-500 font-medium pb-1">/{plan.duration}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-full font-bold transition-all shadow-md ${
                    selectedPlan === plan.id
                      ? 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
                      : 'bg-gray-100 text-neutral-700 hover:bg-gray-200'
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
