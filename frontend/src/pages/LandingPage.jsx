import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Star, TrendingUp, Zap, Heart, Gift } from 'lucide-react';
import ToyCard from '../components/ToyCard';
import axiosClient from '../api/axiosClient';
import { Helmet } from 'react-helmet-async';
import SpinWin from '../components/SpinWin';

const banners = [
  {
    id: 1,
    image: '/images/vibe.jpg.jpeg',
    title: 'Eco-Friendly Channapatna Toys',
    subtitle: 'Safe, Natural & Handcrafted with Love',
    color: 'from-amber-100 to-orange-200'
  },
  {
    id: 2,
    image: '/images/village.jpg.jpeg',
    title: 'The Circular Play Economy',
    subtitle: 'Buy, Adopt, Return & Repair',
    color: 'from-green-100 to-emerald-200'
  },
  {
    id: 3,
    image: '/images/Channapatna-Wooden-Toys.jpeg',
    title: 'Support Local Artisans',
    subtitle: 'Every toy tells a story of tradition',
    color: 'from-blue-100 to-indigo-200'
  }
];

const categories = [
  { name: 'Baby Toys', image: '/images/baby.jpg.jpeg', color: 'bg-amber-100' },
  { name: 'Educational Toys', image: '/images/adopt-abacus.jpg.jpeg', color: 'bg-blue-100' },
  { name: 'Decorative Toys', image: '/images/wooden-birds.jpg.jpeg', color: 'bg-green-100' },
  { name: 'Puzzle Toys', image: '/images/puzzle.jpg.jpeg', color: 'bg-purple-100' }
];

const LandingPage = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [trendingToys, setTrendingToys] = useState([]);
  const [ecoPicks, setEcoPicks] = useState([]);
  const [recommendedToys, setRecommendedToys] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isSpinOpen, setIsSpinOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sections from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendRes, randomRes, popRes] = await Promise.all([
           axiosClient.get('/api/toys?limit=4&sort=popular'),
           axiosClient.get('/api/toys?limit=8&page=1'), // Fetch batch to split
           axiosClient.get('/api/toys?limit=4&sort=price_desc'),
        ]);
        
        setTrendingToys(trendRes.data.toys || trendRes.data);
        const randoms = randomRes.data.toys || randomRes.data;
        setEcoPicks(randoms.slice(0, 4));
        setRecommendedToys(randoms.slice(4, 8));
        setBestSellers(popRes.data.toys || popRes.data);
      } catch (err) {
        console.error("Failed to fetch landing data", err);
      }
    };
    loadData();
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="pt-16 pb-20 bg-secondary transition-colors duration-300 relative">
      <Helmet>
        <title>Lumber & Timber - Eco-Friendly Handcrafted Wooden Toys</title>
        <meta name="description" content="Discover handcrafted, sustainable, and non-toxic wooden toys from Channapatna for your children." />
        <meta name="keywords" content="toys, wooden toys, eco-friendly, artisan, channapatna" />
      </Helmet>
      
      <button 
        onClick={() => setIsSpinOpen(true)} 
        className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center text-white z-40 hover:scale-110 transition-transform animate-bounce border-2 border-white cursor-pointer group" 
        title="Spin and Win"
      >
        <Gift size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      <SpinWin isOpen={isSpinOpen} onClose={() => setIsSpinOpen(false)} />

      {/* Banner Carousel */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full overflow-hidden group">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${banners[currentBanner].color} flex items-center shadow-[0_12px_30px_-4px_rgba(0,0,0,0.15)] rounded-2xl mx-4 my-2`}
          >
            <div className="max-w-7xl mx-auto px-4 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              <div className="flex-1 text-center md:text-left z-10">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md tracking-tight"
                >
                  {banners[currentBanner].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-white/90 mb-8"
                >
                  {banners[currentBanner].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/products" className="btn-primary inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
                    Shop Now <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </div>
              <div className="flex-1 w-full h-full relative hidden md:block opacity-90 drop-shadow-2xl">
                <img 
                  src={banners[currentBanner].image} 
                  alt="Banner" 
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl shadow-2xl" 
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Controls */}
        <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-textMain p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-textMain p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20">
          <ChevronRight size={24} />
        </button>
      </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Grid */}
        <section className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-textMain mb-8 flex items-center gap-2">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="group block text-center">
                  <div className={`w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-theme group-hover:shadow-theme-hover mb-4 ${cat.color} p-4 transition-all duration-300 group-hover:-translate-y-2 relative border-b-[4px] border-r-[4px] border-black/10`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-textMain text-lg group-hover:text-accent transition-colors">{cat.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Toys Section */}
        {trendingToys.length > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8 border-b border-secondary/30 pb-4">
              <h2 className="text-3xl font-bold text-textMain flex items-center gap-3">
                <TrendingUp className="text-accent" size={32} /> Trending Wooden Toys
              </h2>
              <Link to="/products?sort=trending" className="text-accent font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingToys.map((toy, index) => (
                <motion.div
                  key={toy._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ToyCard toy={toy} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Eco-Friendly Picks Section */}
        {ecoPicks.length > 0 && (
          <section className="mb-16 bg-gradient-to-r from-emerald-50 to-green-100 rounded-3xl p-8 shadow-inner border border-green-200/50">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-green-800 flex items-center gap-3 mb-2">
                  <Leaf className="text-green-600" size={32} /> Eco-Friendly Picks
                </h2>
                <p className="text-green-700">100% natural dyes, sustainable wood, zero plastic footprint.</p>
              </div>
              <Link to="/products?tag=eco" className="btn-primary bg-green-600 hover:bg-green-700 hidden sm:flex items-center gap-2 shadow-[0_4px_0_theme(colors.green.800)] hover:shadow-[0_6px_0_theme(colors.green.800)]">
                Discover <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ecoPicks.map((toy, index) => (
                <motion.div key={`eco-${toy._id}`} whileHover={{ y: -5 }}>
                  <div className="bg-primary rounded-2xl p-4 shadow-theme hover:shadow-theme-hover border border-borderColor transition-all">
                    <div className="bg-secondary rounded-xl overflow-hidden aspect-[4/3] p-2 mb-4 relative line-clamp-2">
                      <img src={toy.images?.[0] || `https://picsum.photos/seed/${toy._id}/400/300`} alt={toy.name} loading="lazy" className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-green-100 text-green-800 text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded w-max mb-2 flex items-center gap-1">
                      <Leaf size={12} /> Earth Safe
                    </div>
                    <h3 className="font-bold text-textMain truncate">{toy.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-black text-xl text-green-700">₹{toy.price}</span>
                      <Link to={`/toy/${toy._id}`} className="text-sm font-bold text-accent hover:underline bg-secondary px-3 py-1 rounded">View</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Personalized "For You" Section */}
        {recommendedToys.length > 0 && (
          <section className="mb-16 bg-primary border-2 border-accent/20 rounded-3xl p-8 shadow-theme relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
             <div className="flex justify-between items-end mb-8 border-b border-borderColor pb-4 relative z-10">
               <h2 className="text-3xl font-bold text-textMain flex items-center gap-3">
                 <Heart className="text-pink-500 fill-pink-500" size={32} /> Recommended For You
               </h2>
               <Link to="/products?sort=recommended" className="text-accent font-medium hover:underline flex items-center gap-1">
                 See More <ArrowRight size={16} />
               </Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
               {recommendedToys.map((toy, index) => (
                 <motion.div
                   key={`foryou-${toy._id}`}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                 >
                   <ToyCard toy={toy} />
                 </motion.div>
               ))}
             </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8 border-b border-borderColor pb-4">
              <h2 className="text-3xl font-bold text-textMain flex items-center gap-3">
                <Star className="text-yellow-500 fill-yellow-500" size={32} /> Best Sellers
              </h2>
              <Link to="/products?sort=popular" className="text-accent font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((toy, index) => (
                <motion.div
                  key={`best-${toy._id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ToyCard toy={toy} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default LandingPage;