import { motion } from 'framer-motion';
import { RefreshCcw, Coins, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';

const Return = () => {
  return (
    <div className="pt-32 pb-20 bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCcw size={40} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-textMain mb-6 leading-tight">
            Return & <span className="text-green-600">Earn Concept</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-textMuted font-medium">
            Children outgrow toys. Instead of letting them gather dust or sit in landfills, send them back to us to be refurbished or recycled ethically.
          </motion.p>
        </div>

        {/* Process Box */}
        <div className="bg-primary p-10 md:p-16 rounded-[3rem] border border-borderColor shadow-sm relative overflow-hidden mb-16">
           <div className="absolute top-0 right-0 p-8 text-green-500/10 hidden md:block">
              <TreePine size={300} />
           </div>
           
           <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
             <div>
               <h2 className="text-3xl font-black text-textMain mb-6">The Cycle of Play</h2>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-black text-textMuted">1</div>
                    <div>
                      <h4 className="font-bold text-textMain text-lg mb-1">Return gently used toys</h4>
                      <p className="text-textMuted text-sm font-medium">Any Lumber Timber toy that your child has outgrown is eligible.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-black text-textMuted">2</div>
                    <div>
                      <h4 className="font-bold text-textMain text-lg mb-1">We Refurbish or Recycle</h4>
                      <p className="text-textMuted text-sm font-medium">Usable toys are cleaned and donated. Broken ones are safely composted or recycled.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black">3</div>
                    <div>
                      <h4 className="font-bold text-green-700 text-lg mb-1">Earn Store Credit</h4>
                      <p className="text-green-600/80 text-sm font-medium">You get up to 30% of the original value in store credits to buy new age-appropriate toys!</p>
                    </div>
                 </div>
               </div>
             </div>

             <div className="bg-secondary/50 p-8 rounded-3xl border border-borderColor text-center h-full flex flex-col justify-center">
                <Coins size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-textMain mb-2">Ready to return?</h3>
                <p className="text-textMuted font-medium mb-8">Pack the toys in any safe box. We will arrange a pickup from your doorstep.</p>
                <Link to="/contact" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors">Start a Return</Link>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Return;
