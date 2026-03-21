import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Leaf, ChevronRight, User, Check, Sparkles, Box, Home } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { mockToys } from '../store/mockToys';
import { Helmet } from 'react-helmet-async';
import StarRating from '../components/StarRating';

const ToyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toy, setToy] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth(); // Need auth check for wishlist and roles

  useEffect(() => {
    const fetchToyAndWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosClient.get(`/api/toys/${id}`);
        setToy(data);
        
        // Check wishlist status if logged in
        if (isAuthenticated) {
           const wishlistRes = await axiosClient.get('/api/wishlist');
           const isInWishlist = wishlistRes.data.some(wToy => (wToy._id || wToy) === id);
           setIsWishlisted(isInWishlist);
        }

      } catch (err) {
        console.error(err);
        // Fallback for demo
        const fallbackToy = mockToys.find(t => t._id === id) || mockToys[0];
        setToy({
          ...fallbackToy,
          images: [fallbackToy.image, fallbackToy.image, fallbackToy.image],
          uniqueId: `CH-${fallbackToy._id || 'DEMO'}-9942`,
          isAdoptable: true,
          history: [
            { event: 'Crafted from sustainable ivory wood', date: 'Oct 12, 2023', user: fallbackToy.artisan.name },
            { event: 'Quality Approved & Polished', date: 'Oct 15, 2023', user: 'Lumber Timber QA' }
          ],
          ecoImpact: {
            co2Saved: '2.5 kg',
            plasticAvoided: '500g',
            treesPlanted: 1
          },
          customerReviews: [
            { user: 'Amit K.', rating: 5, comment: 'Absolutely brilliant craftsmanship. My child loves it!', date: 'Jan 10, 2024' },
            { user: 'Sarah L.', rating: 4, comment: 'Very sturdy and safe. The colors are beautiful and natural.', date: 'Dec 05, 2023' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchToyAndWishlist();
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async () => {
     if (!isAuthenticated) {
        toast.error('Please login to use wishlist');
        return;
     }
     try {
        const res = await axiosClient.post(`/api/wishlist/toggle/${id}`);
        setIsWishlisted(res.data.isWishlisted);
        toast.success(res.data.msg);
     } catch (err) {
        toast.error('Failed to update wishlist');
     }
  };

  if (loading) return (
    <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error && !toy) return <div className="pt-24 pb-20 text-center text-red-600 min-h-screen">Toy not found</div>;

  return (
    <div className="pt-24 pb-20 bg-secondary min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{toy.name} - Lumber & Timber</title>
        <meta name="description" content={toy.description} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${toy.name}",
              "image": "${toy.images?.[0] || ''}",
              "description": "${toy.description}",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": "${toy.price}",
                "availability": "https://schema.org/InStock"
              }
            }
          `}
        </script>
      </Helmet>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 text-sm text-textMuted font-medium">
          <Link to="/home" className="hover:text-accent flex items-center gap-1"><Home size={16} /> Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-accent">Toys</Link>
          <ChevronRight size={14} />
          <span className="text-textMain">{toy.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-[2rem] shadow-theme border border-borderColor p-6 lg:p-10 mb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-secondary rounded-3xl overflow-hidden aspect-square border border-borderColor flex items-center justify-center p-8 relative group">
                 <img 
                  src={toy.images?.[selectedImage] || toy.images?.[0]} 
                  alt={toy.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Image Nav Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/80 backdrop-blur rounded-full flex items-center justify-center text-textMain shadow hover:bg-primary transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/80 backdrop-blur rounded-full flex items-center justify-center text-textMain shadow hover:bg-primary transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRight size={20} />
                </button>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/90 text-textMain font-bold rounded-full text-sm shadow flex items-center gap-2 hover:bg-primary z-20 transition-transform hover:scale-105 border border-borderColor">
                  <Box size={16} /> 360° View
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {(toy.images || []).map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-secondary p-2 ${selectedImage === index ? 'border-accent shadow-sm' : 'border-transparent hover:border-borderColor'}`}
                  >
                    <img src={img} alt={`${toy.name} view ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {toy.category}
                  </span>
                  <StarRating rating={toy.rating || 4.8} reviews={toy.reviews || 124} showText={true} />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-textMain mb-2 leading-tight">
                  {toy.name}
                </h1>
                <p className="text-lg text-textMuted font-medium mb-6">
                  Handcrafted by <span className="text-accent underline cursor-pointer">{toy.artisan?.name || toy.artisan}</span> in Channapatna
                </p>
              </div>

              <div className="mb-8 p-6 bg-secondary/50 rounded-2xl border border-borderColor">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-black text-textMain tracking-tight">₹{toy.price}</span>
                  <span className="text-lg text-textMuted line-through font-medium">₹{Math.round(toy.price * 1.2)}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">20% OFF</span>
                </div>
                <p className="text-sm text-textMuted font-medium">Inclusive of all taxes. Free shipping on orders over ₹1000.</p>
              </div>

              {/* Add to Cart & Actions - Hidden for Admins */}
              {(!user || user.role !== 'admin') && (
                <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-borderColor">
                  <button
                    onClick={() => {
                      addToCart(toy);
                      toast.success('Added to cart!');
                    }}
                    className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleWishlistToggle}
                    className={`px-6 py-4 rounded-full font-bold transition-colors flex items-center justify-center gap-2 border border-borderColor ${
                      isWishlisted ? 'bg-accent text-white' : 'bg-secondary text-accent hover:bg-secondary/70'
                    }`}
                  >
                    <Heart size={24} className={isWishlisted ? "fill-white" : ""} /> {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              )}

              {/* Value Props */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary border border-borderColor">
                  <Truck className="mb-2 text-accent" size={28} />
                  <span className="text-xs font-bold text-textMain">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary border border-borderColor">
                  <Shield className="mb-2 text-green-600" size={28} />
                  <span className="text-xs font-bold text-textMain">Non-Toxic</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary border border-borderColor">
                  <RotateCcw className="mb-2 text-blue-600" size={28} />
                  <span className="text-xs font-bold text-textMain">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary border border-borderColor">
                  <Leaf className="mb-2 text-emerald-600" size={28} />
                  <span className="text-xs font-bold text-textMain">Sustainable</span>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Detailed Information Tabs */}
        <div className="bg-primary rounded-[2rem] shadow-theme border border-borderColor overflow-hidden mb-12">
          <div className="flex overflow-x-auto border-b border-borderColor">
            {['description', 'artisan', 'reviews', 'qa'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-accent/5 text-accent border-b-2 border-accent' 
                    : 'text-textMuted hover:bg-secondary hover:text-textMain'
                }`}
              >
                {tab === 'description' ? 'Product Details' : tab === 'artisan' ? 'Meet the Artisan' : tab === 'qa' ? 'Q&A' : 'Customer Reviews'}
              </button>
            ))}
          </div>
          
          <div className="p-8 lg:p-10">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-lg max-w-none text-textMain prose-headings:text-textMain prose-a:text-accent">
                <p>{toy.description}</p>
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  <div className="bg-secondary p-6 rounded-2xl border border-borderColor">
                    <h4 className="font-bold text-textMain mb-4 text-lg">Key Features</h4>
                    <ul className="space-y-3">
                      {(toy.features || ['Handcrafted with care', 'Eco-friendly materials', 'Safe and non-toxic']).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-textMain">
                          <Check size={20} className="text-accent shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-secondary p-6 rounded-2xl border border-borderColor">
                    <h4 className="font-bold text-textMain mb-4 text-lg">Specifications</h4>
                    <ul className="space-y-3 text-textMain">
                      <li className="flex justify-between items-center">
                        <span className="font-medium">Category:</span>
                        <span className="font-bold">{toy.category}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="font-medium">Age Group:</span>
                        <span className="font-bold">{toy.ageGroup}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="font-medium">Materials:</span>
                        <span className="font-bold">Hale wood, Natural Dyes</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="font-medium">Product ID:</span>
                        <span className="font-bold">{toy.uniqueId}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'artisan' && (
              <motion.div key="artisan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col md:flex-row gap-8 items-center bg-secondary p-8 rounded-2xl border border-borderColor">
                  <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center text-primary text-5xl font-bold shadow-lg shrink-0">
                    {(toy.artisan?.name || toy.artisan || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-textMain mb-2">{toy.artisan?.name || toy.artisan}</h3>
                    <p className="text-accent font-medium mb-4 flex items-center gap-2">
                       📍 {toy.artisan?.location || 'Channapatna'}
                    </p>
                    <p className="text-textMuted text-lg leading-relaxed italic">"{toy.artisan?.story || 'A dedicated artisan crafting beautiful wooden toys.'}"</p>
                  </div>
                </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="md:w-1/3">
                    <h3 className="text-2xl font-bold text-textMain mb-4">Customer Reviews</h3>
                    <div className="flex items-center gap-4 mb-6">
                       <span className="text-5xl font-black text-textMain">4.8</span>
                       <StarRating rating={4.8} reviews={124} size={20} className="fill-accent text-accent" />
                    </div>
                    {/* Progress bars could go here */}
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="border-b border-borderColor pb-6 last:border-0">
                        <div className="mb-2">
                           <StarRating rating={5} size={14} className="fill-accent text-accent" />
                        </div>
                        <h4 className="font-bold text-textMain mb-1">Absolutely Beautiful Toy</h4>
                        <p className="text-textMuted mb-2">"The craftsmanship on this {toy.name} is incredible. My child loves it, and it feels so good knowing it's safe and sustainable."</p>
                        <p className="text-sm font-medium text-textMuted/60">— Verified Buyer, 2 weeks ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'qa' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <h2 className="text-2xl font-bold text-primary mb-6">Questions & Answers</h2>
                 <div className="space-y-6">
                    {[
                      { q: "Are the dyes really 100% natural?", a: "Yes! All colors used are derived from natural sources perfectly safe for children who tend to put toys in their mouths." },
                      { q: "Does the color fade over time?", a: "With normal indoor use, the colors remain vibrant for years. We recommend keeping them away from prolonged direct sunlight." },
                      { q: "Is this suitable for a 2-year old?", a: "While safe, this specific toy has small parts so it is recommended for 3+ years under adult supervision." }
                    ].map((qa, idx) => (
                      <div key={idx} className="bg-secondary p-5 rounded-2xl border border-borderColor">
                        <div className="font-bold text-textMain flex gap-2 mb-2">
                           <span className="text-primary font-black">Q:</span>
                           <span>{qa.q}</span>
                        </div>
                        <div className="text-sm border-t border-borderColor/50 pt-2 flex gap-2 text-textMuted">
                           <span className="text-green-600 font-bold">A:</span>
                           <span>{qa.a}</span>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 relative">
                   <input type="text" placeholder="Have a question? Ask here..." className="w-full pl-4 pr-24 py-3 rounded-xl border border-borderColor bg-secondary focus:ring-2 focus:ring-primary focus:outline-none text-textMain"/>
                   <button className="absolute right-2 top-2 bg-primary text-white px-4 py-1 rounded-lg font-bold text-sm h-10 hover:bg-opacity-90 transition-colors">Ask</button>
                 </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* The Toy Passport Component */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-[2rem] p-8 lg:p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-green-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                <Leaf size={32} />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-green-900">Digital Toy Passport</h2>
                <p className="text-green-800 font-medium tracking-wide opacity-80 uppercase text-sm mt-1">Authenticity & Lifecycle Record</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Info Column */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm">
                <h3 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200/50 pb-2">Identity</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col"><span className="text-green-700 uppercase font-bold text-xs">ID Number</span> <span className="font-mono text-base font-medium">{toy.uniqueId}</span></div>
                  <div className="flex flex-col"><span className="text-green-700 uppercase font-bold text-xs">Origin</span> <span className="font-medium">{toy.artisan?.location}</span></div>
                  <div className="flex flex-col"><span className="text-green-700 uppercase font-bold text-xs">Materials</span> <span className="font-medium">Hale wood, Natural Dyes</span></div>
                </div>
              </div>

              {/* Eco Impact Column */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm">
                 <h3 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200/50 pb-2">Eco Impact</h3>
                 <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800">CO₂ Saved</span>
                    <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full font-bold">{toy.ecoImpact?.co2Saved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800">Plastic Avoided</span>
                    <span className="bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full font-bold">{toy.ecoImpact?.plasticAvoided}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-800">Trees Planted</span>
                    <span className="bg-teal-200 text-teal-900 px-3 py-1 rounded-full font-bold">{toy.ecoImpact?.treesPlanted} 🌲</span>
                  </div>
                 </div>
              </div>

              {/* History Column */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm">
                <h3 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200/50 pb-2">Lifecycle Journey</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-300 before:to-transparent">
                  {toy.history?.map((event, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-green-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-green-200 bg-white ml-2 md:ml-0 shadow-sm">
                        <div className="font-bold text-green-900 text-sm mb-1">{event.event}</div>
                        <div className="text-xs text-green-700">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* You Might Also Like */}
        <div className="mt-20">
          <div className="flex justify-between items-end mb-8 border-b border-borderColor pb-4">
            <h2 className="text-2xl font-bold text-textMain flex items-center gap-2">
               Similar Toys
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['65c2a1f1b2c3d4e5f6a7b8c9', '65c2a1f1b2c3d4e5f6a7b8ca', '65c2a1f1b2c3d4e5f6a7b8cb', '65c2a1f1b2c3d4e5f6a7b8cc'].map((item, index) => (
              <div key={item} onClick={() => navigate(`/toy/${item}`)} className="bg-primary rounded-2xl shadow-theme hover:shadow-theme-hover border border-borderColor transition-all cursor-pointer group p-3">
                <div className="w-full aspect-square bg-secondary rounded-xl mb-4 overflow-hidden relative">
                   <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur text-xs px-2 py-1 rounded-full font-bold text-textMain z-10">98% Match</div>
                   <img src={`/images/sub-${(index % 10) + 1}.jpg.jpeg`} onError={(e) => e.target.src="/images/stacker.jpg.jpeg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-textMain mb-1 line-clamp-1 group-hover:text-accent transition-colors">Wooden Toy {index + 1}</h3>
                <p className="text-lg font-black text-textMain">₹899</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ToyDetails;