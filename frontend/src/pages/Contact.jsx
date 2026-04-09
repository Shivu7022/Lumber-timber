import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to send a support message.");
      return;
    }

    setLoading(true);
    try {
      const formattedMessage = `[${formData.subject}] from ${formData.firstName} ${formData.lastName} (${formData.email}): ${formData.message}`;
      
      await axiosClient.post('/api/support/send', {
        userId: user._id,
        message: formattedMessage,
        sender: 'user'
      });

      toast.success("Message sent! Our support team will respond in the chat soon.");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try the floating chat icon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-black text-textMain mb-6 leading-tight"
          >
            Get in <span className="text-accent relative inline-block">Touch<svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/></svg></span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-textMuted font-medium">
            Have a question about our toys, custom orders, or just want to say hi? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="bg-primary p-8 rounded-[2rem] shadow-theme border border-borderColor">
              <h3 className="text-2xl font-bold text-textMain mb-8">Reach Out Connect</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-textMain text-lg mb-1">Our Workshop</h4>
                    <p className="text-textMuted leading-relaxed">123 Artisan Street, Toymakers District<br/>Channapatna, Karnataka 562160, India</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-textMain text-lg mb-1">Call Us</h4>
                    <p className="text-textMuted leading-relaxed">Mon-Fri from 9am to 6pm<br/>+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-textMain text-lg mb-1">Email Us</h4>
                    <p className="text-textMuted leading-relaxed">We usually reply within 24 hours<br/>hello@lumbertimber.in</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary p-8 rounded-[2rem] shadow-theme border border-borderColor">
               <h3 className="text-xl font-bold text-textMain mb-4">Store Hours</h3>
               <div className="space-y-2 text-textMuted font-medium flex flex-col gap-2">
                 <div className="flex justify-between border-b border-borderColor pb-2"><span>Monday - Friday</span> <span className="text-textMain font-bold">9:00 AM - 6:00 PM</span></div>
                 <div className="flex justify-between border-b border-borderColor pb-2"><span>Saturday</span> <span className="text-textMain font-bold">10:00 AM - 4:00 PM</span></div>
                 <div className="flex justify-between pb-1"><span>Sunday</span> <span className="text-accent font-bold">Closed (Family Time)</span></div>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <form onSubmit={handleSubmit} className="bg-primary p-8 md:p-10 rounded-[2rem] shadow-theme border border-borderColor space-y-6">
              <h3 className="text-2xl font-bold text-textMain mb-2">Send a Message</h3>
              <p className="text-textMuted text-sm font-medium mb-8">Fill out the form below and our team will get back to you swiftly.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-textMuted mb-2">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-secondary border border-borderColor focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain font-medium" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-textMuted mb-2">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl bg-secondary border border-borderColor focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain font-medium" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-textMuted mb-2">Email Address</label>
                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-3 rounded-xl bg-secondary border border-borderColor focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain font-medium" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-textMuted mb-2">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-secondary border border-borderColor focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain font-medium">
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Custom Toy Request</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-textMuted mb-2">Your Message</label>
                <textarea required name="message" value={formData.message} onChange={handleInputChange} rows="5" className="w-full px-4 py-3 rounded-xl bg-secondary border border-borderColor focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain font-medium resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button disabled={loading} type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span> : <><Send size={20} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
