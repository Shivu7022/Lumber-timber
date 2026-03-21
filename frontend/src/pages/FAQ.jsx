import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: "How long does shipping take?", a: "Most orders are processed within 24-48 hours. Standard shipping across India takes 3-5 business days. International shipping takes 7-14 days depending on custom clearances." },
      { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above ₹1,000 within India. For international orders, shipping is calculated at checkout based on weight and destination." },
      { q: "Can I track my order?", a: "Absolutely. Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track it directly from your Dashboard if you have an account." }
    ]
  },
  {
    category: 'Our Toys & Safety',
    questions: [
      { q: "Are the toys safe for teething babies?", a: "Yes, our toys are 100% safe. We use natural vegetable dyes (like turmeric, indigo, and madder root) and finish them with a coating of natural shellac. There are no synthetic paints or harsh chemicals used." },
      { q: "How do I clean wooden toys?", a: "Simply wipe them with a damp cloth. Do not soak wooden toys in water or sterilize them with boiling water, as this can cause the wood to swell and crack. For stubborn marks, use a mixture of mild soap and water on a damp cloth." },
      { q: "Are the corners sharp?", a: "No. All our toys are meticulously hand-sanded and smoothed by artisans to ensure there are no sharp edges or splinters, making them perfectly safe for little hands." }
    ]
  },
  {
    category: 'Returns & Repairs',
    questions: [
      { q: "Do you have a return policy?", a: "Yes, we accept returns within 7 days of delivery for unused items in their original packaging. Please check our Return & Earn page for more detailed instructions." },
      { q: "What if my toy gets damaged after months of play?", a: "We believe toys should last generations. We offer a 'Repair & Repaint' service where you can send damaged toys back to our workshop in Channapatna for restoration at a minimal cost." }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(`0-0`); // First item open by default

  return (
    <div className="pt-32 pb-20 bg-secondary min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-black text-textMain mb-6"
          >
            Frequently Asked <span className="text-accent">Questions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-textMuted font-medium">
            Everything you need to know about our toys, shipping, and services.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-12">
          {faqData.map((category, catIdx) => (
            <div key={catIdx}>
              <h2 className="text-2xl font-bold text-textMain mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">{catIdx + 1}</span>
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((item, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className={`bg-primary rounded-2xl border transition-all duration-300 ${isOpen ? 'border-accent shadow-md' : 'border-borderColor hover:border-accent/40'}`}>
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-bold text-textMain text-lg pr-4">{item.q}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-accent text-white rotate-180' : 'bg-secondary text-textMuted'}`}>
                           <ChevronDown size={20} />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 text-textMuted font-medium leading-relaxed border-t border-secondary/50 mt-2">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Contact CTA */}
        <div className="mt-20 bg-accent/10 rounded-[2rem] p-10 text-center border border-accent/20">
           <h3 className="text-2xl font-bold text-textMain mb-3">Still have questions?</h3>
           <p className="text-textMuted font-medium mb-6">Our friendly support team is always here to help you out.</p>
           <a href="/contact" className="inline-block btn-primary">Contact Support</a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
