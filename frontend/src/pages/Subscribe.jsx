import { motion } from 'framer-motion';
import { PackageOpen, Sparkles, CheckCircle2, Gift, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscribe = () => {
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
            <button className="w-full bg-secondary text-textMain py-4 rounded-xl font-bold hover:bg-borderColor transition-colors border border-borderColor">Choose Explorer</button>
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
            <button className="w-full bg-white text-accent py-4 rounded-xl font-black hover:bg-gray-50 transition-colors shadow-lg shadow-black/10">Choose Artisan</button>
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
