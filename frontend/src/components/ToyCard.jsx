import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const ToyCard = ({ toy, onAddToCart }) => {
  const imageUrl = toy.images?.[0] || toy.image || `https://picsum.photos/seed/${toy._id || toy.id}/400/300`;
  const toyId = toy._id || toy.id;
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-primary rounded-2xl overflow-hidden shadow-theme hover:shadow-theme-hover border border-borderColor group relative flex flex-col h-full transition-colors duration-300"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-secondary p-4">
        <img
          src={imageUrl}
          alt={toy.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        {toy.isAdoptable && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Adoptable
          </div>
        )}
        {(!user || user.role !== 'admin') && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                toast.error('Please login to use wishlist');
                return;
              }
              try {
                const res = await axiosClient.post(`/api/wishlist/toggle/${toyId}`);
                setWishlisted(res.data.isWishlisted);
                toast.success(res.data.msg);
              } catch (err) {
                toast.error('Failed to update wishlist');
              }
            }}
            className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm hover:bg-white"
            title="Add to wishlist"
          >
            <Heart size={20} className={wishlisted ? 'text-red-500 fill-red-500' : 'text-textMuted hover:text-red-500 transition-colors'} />
          </button>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow text-center items-center">
        {/* Name */}
        <h3 className="text-lg font-bold text-textMain mb-2 line-clamp-2">{toy.name}</h3>
        
        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={toy.rating ?? 4.5} reviews={toy.reviews || 84} showText={true} />
        </div>
        
        {/* Price */}
        <div className="mt-auto pt-2 mb-4 flex flex-col items-center">
          <span className="text-2xl font-black text-textMain tracking-tight">₹{toy.price}</span>
        </div>

        {/* CTA */}
        <div className="w-full">
          <Link to={`/toy/${toyId}`} className="btn-primary w-full flex items-center justify-center py-2 px-5 shadow-sm text-sm hover:shadow-[0_4px_0_var(--shadow-color)] transition-shadow">
            View Product
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ToyCard;