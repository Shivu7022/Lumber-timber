import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-primary transition-colors duration-300">
      {/* Left Area - Branding & Image */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-secondary border-r border-borderColor relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <Link to="/home" className="text-3xl font-black text-textMain flex items-center gap-2 tracking-tight mb-8">
            <span className="text-4xl not-italic drop-shadow-md">🪓</span> Lumber Timber
          </Link>
          <h1 className="text-5xl font-black text-textMain leading-tight mb-6">
            Preserving <br/><span className="text-accent text-6xl">Channapatna</span> <br/>Heritage.
          </h1>
          <p className="text-xl text-textMuted max-w-md">
            Join our community to buy, adopt, and restore eco-friendly wooden toys crafted by traditional artisans.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-textMain">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold border-2 border-primary">T</div>
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold border-2 border-primary">R</div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-primary">S</div>
            </div>
            <p className="font-semibold text-sm">Join 10k+ eco-conscious parents.</p>
          </div>
        </div>
      </div>

      {/* Right Area - Form Outlet */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        <Link to="/home" className="lg:hidden absolute top-6 left-6 text-2xl font-black text-textMain flex items-center gap-2 tracking-tight">
          <span className="text-3xl not-italic drop-shadow-md">🪓</span> Lumber Timber
        </Link>
        
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
