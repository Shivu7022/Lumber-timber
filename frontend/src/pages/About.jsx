import { motion } from 'framer-motion';
import { Leaf, Award, Users, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-20">
      
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-6xl font-black text-textMain leading-tight mb-6">
              Preserving <span className="text-accent">Heritage</span>,<br/>One Toy at a Time.
            </h1>
            <p className="text-lg text-textMuted font-medium leading-relaxed mb-8">
              Lumber Timber was born out of a profound respect for the 200-year-old craft of Channapatna toy making. 
              We are on a mission to safeguard this dying art form by bringing its beauty, safety, and sustainability into modern homes worldwide.
            </p>
            <div className="flex gap-4">
              <div className="bg-primary px-6 py-4 rounded-2xl border border-borderColor shadow-sm">
                <p className="text-3xl font-black text-accent mb-1">50+</p>
                <p className="text-xs font-bold text-textMuted uppercase tracking-wider">Artisan Families</p>
              </div>
              <div className="bg-primary px-6 py-4 rounded-2xl border border-borderColor shadow-sm">
                <p className="text-3xl font-black text-green-500 mb-1">10k+</p>
                <p className="text-xs font-bold text-textMuted uppercase tracking-wider">Toys Delivered</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Artisan making toys" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary p-6 rounded-3xl shadow-xl border border-borderColor max-w-xs">
               <p className="text-sm font-bold text-textMain italic">"Every toy carries the soul of the artisan and the warmth of the wood."</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-primary py-24 border-y border-borderColor mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-textMain mb-4">Our Core Values</h2>
            <p className="text-textMuted font-medium text-lg">The principles that guide every cut, polish, and package.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 shrink-0">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><Award size={28}/></div>
              <h3 className="text-xl font-bold text-textMain mb-3">Authenticity</h3>
              <p className="text-textMuted font-medium text-sm">We only use traditional Hale wood (Wrightia tinctoria) and authentic turning techniques.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Leaf size={28}/></div>
              <h3 className="text-xl font-bold text-textMain mb-3">Eco-Friendly</h3>
              <p className="text-textMuted font-medium text-sm">Colored strictly with non-toxic vegetable and seed dyes, polished with natural lac.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"><Users size={28}/></div>
              <h3 className="text-xl font-bold text-textMain mb-3">Fair Trade</h3>
              <p className="text-textMuted font-medium text-sm">Empowering artisans with fair wages, safe working conditions, and consistent demand.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><Heart size={28}/></div>
              <h3 className="text-xl font-bold text-textMain mb-3">Child Safety</h3>
              <p className="text-textMuted font-medium text-sm">Soft edges, vibrant natural colors, and zero chemical toxicity for worry-free play.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <h2 className="text-3xl font-black text-textMain mb-6">Join Our Journey</h2>
        <p className="text-lg text-textMuted font-medium leading-relaxed mb-10">
          When you buy from Lumber Timber, you aren't just buying a toy. You are adopting a piece of history and directly supporting the livelihoods of masterful craftsmen in the Toy Town of Karnataka.
        </p>
        <a href="/products" className="btn-primary inline-flex">Explore The Collection</a>
      </div>

    </div>
  );
};

export default About;
