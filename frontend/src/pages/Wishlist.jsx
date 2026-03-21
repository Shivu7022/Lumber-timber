import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ToyCard from '../components/ToyCard';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axiosClient.get('/api/wishlist');
        const items = res.data.items || res.data;
        setWishlistItems(Array.isArray(items) ? items.map(i => i.toy || i) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Heart size={64} className="text-primary/30 mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">Please log in to view your wishlist</h1>
        <Link to="/login" className="btn-primary mt-4">Log in</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-12"
        >
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
             <Heart className="text-accent" size={36} fill="currentColor" /> My Wishlist
          </h1>
          <p className="text-textMuted mt-2">Toys you've loved and saved for later.</p>
        </motion.div>

        {loading ? (
          <div className="text-center text-textMuted py-20">Loading wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-secondary rounded-2xl border border-borderColor">
            <Heart size={48} className="mx-auto text-textMuted mb-4" />
            <h2 className="text-2xl font-bold text-textMain mb-2">Your wishlist is empty</h2>
            <p className="text-textMuted mb-8">Save your favorite eco-friendly toys here!</p>
            <Link to="/products" className="btn-primary">Explore Toys</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((toy) => toy && (
              <ToyCard key={toy._id || toy.id} toy={toy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
