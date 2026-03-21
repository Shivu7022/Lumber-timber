import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-primary transition-colors duration-300">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
