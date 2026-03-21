import { motion } from 'framer-motion';
import { PenTool, Paintbrush, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const Repair = () => {
  return (
    <div className="pt-32 pb-20 bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Paintbrush size={40} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-textMain mb-6 leading-tight">
            Repair & <span className="text-accent">Repaint</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-textMuted font-medium">
            Toys are meant to be loved, and sometimes love leaves a mark. Don't throw them away. Let our artisans restore them to their former glory!
          </motion.p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-primary p-8 text-center rounded-3xl border border-borderColor shadow-sm">
            <ShieldCheck size={40} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-textMain mb-2">Original Materials</h3>
            <p className="text-textMuted font-medium text-sm">We only use the same natural wood and safe vegetable dyes from the original toy.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-primary p-8 text-center rounded-3xl border border-borderColor shadow-sm">
            <PenTool size={40} className="text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-textMain mb-2">Expert Craftsmanship</h3>
            <p className="text-textMuted font-medium text-sm">Repairs are done directly by the Channapatna artisans who originally crafted them.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-primary p-8 text-center rounded-3xl border border-borderColor shadow-sm">
            <HeartHandshake size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-textMain mb-2">Pass It Down</h3>
            <p className="text-textMuted font-medium text-sm">A restored toy is ready to be handled by the next generation of your family.</p>
          </motion.div>
        </div>

        {/* Action Form / Process */}
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-theme border border-borderColor max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
           <div className="flex-1 space-y-6">
             <h2 className="text-3xl font-black text-textMain">How it works</h2>
             <ol className="space-y-4 text-textMuted font-medium">
               <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">1</span> Request a repair by submitting pictures below.</li>
               <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">2</span> We assess the damage and give a small quote.</li>
               <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">3</span> Ship it to us.</li>
               <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">4</span> Receive your restored toy in 2-3 weeks!</li>
             </ol>
           </div>
           
           <div className="flex-1 w-full relative">
             <div className="absolute inset-0 bg-secondary/50 rounded-2xl border-2 border-dashed border-borderColor flex flex-col items-center justify-center p-8 text-center">
               <Paintbrush size={32} className="text-textMuted mb-4 opacity-50"/>
               <p className="font-bold text-textMain mb-2">Log in to start a repair request</p>
               <p className="text-sm text-textMuted mb-6">Upload photos of the scuffs or broken parts.</p>
               <Link to="/login" className="btn-primary py-3 px-6 text-sm">Sign In / Register</Link>
             </div>
             {/* Spacer to give the absolute div height */}
             <div className="h-64 sm:h-72 w-full"></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Repair;
