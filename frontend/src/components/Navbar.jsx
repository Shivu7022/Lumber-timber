import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LogOut, LogIn, Search, ChevronDown, Menu, X, Moon, Sun, TreePine, Heart, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const categories = ['Baby Toys', 'Educational Toys', 'Decorative Toys', 'Puzzle Toys'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-primary z-50 shadow-theme border-b-[2px] border-borderColor transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-black text-textMain flex items-center gap-2 tracking-tight">
            <span className="text-3xl not-italic drop-shadow-md">🪓</span> 
            <span className="hidden sm:inline">Lumber Timber</span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8 relative shadow-sm">
            <input
              type="text"
              placeholder="Search for toys, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 rounded-l-md border border-borderColor border-r-0 focus:outline-none focus:ring-2 focus:ring-accent bg-secondary text-textMain"
            />
            <button type="submit" className="bg-accent px-6 rounded-r-md flex items-center justify-center hover:opacity-90 transition-opacity">
               <Search className="text-white" size={20} />
            </button>
          </form>

          {/* Universal Hamburger Menu Button */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-textMain hover:text-accent p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Dim Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Side Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 w-[300px] h-full bg-primary z-[70] shadow-2xl flex flex-col overflow-y-auto border-l border-borderColor"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-borderColor">
              <span className="text-xl font-black text-textMain tracking-tight">Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-textMain hover:text-red-500 transition-colors p-2 bg-secondary rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-6 py-6 space-y-8">
              
              {/* User Greeting Box */}
              {user ? (
                <div className="bg-secondary p-4 rounded-xl border border-borderColor shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-textMuted">Welcome back,</p>
                      <p className="font-bold text-textMain">{user.name || user.email.split('@')[0]}</p>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="mt-3 w-full block text-center bg-primary border border-accent/30 text-accent font-bold px-3 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors">
                       <Shield size={16} className="inline mr-2" />
                       Admin Portal
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full btn-primary block py-3">Login / Register</Link>
                </div>
              )}

              {/* Primary Links */}
              <div className="flex flex-col space-y-4">
                <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-textMain hover:text-accent flex items-center gap-3"><span className="text-2xl">🪓</span> Home</Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-textMain hover:text-accent flex items-center gap-3"><span className="text-2xl">🌍</span> Explore Toys</Link>
                {user && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-textMain hover:text-accent flex items-center gap-3"><span className="text-2xl">📊</span> Dashboard</Link>}
              </div>

              {/* Categories Expander */}
              <div className="border-t border-b border-borderColor py-4">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex justify-between items-center text-lg font-bold text-textMain hover:text-accent"
                >
                  <div className="flex items-center gap-3"><span className="text-2xl">🧩</span> Categories</div>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pl-10 flex flex-col space-y-3"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-textMuted hover:text-accent font-medium"
                        >
                          {cat}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Links Expander */}
              <div className="border-b border-borderColor py-4">
                <button
                  onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                  className="w-full flex justify-between items-center text-lg font-bold text-textMain hover:text-accent"
                >
                  <div className="flex items-center gap-3"><span className="text-2xl">🔗</span> Quick Links</div>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isQuickLinksOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isQuickLinksOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pl-10 flex flex-col space-y-4"
                    >
                      <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Our Toys</Link>
                      <Link to="/adopt" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Adopt a Toy</Link>
                      <Link to="/subscribe" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Subscription Box</Link>
                      <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Our Story</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Expander */}
              <div className="border-b border-borderColor py-4 mb-4">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full flex justify-between items-center text-lg font-bold text-textMain hover:text-accent"
                >
                  <div className="flex items-center gap-3"><span className="text-2xl">🛠️</span> Services</div>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pl-10 flex flex-col space-y-4"
                    >
                      <Link to="/repair" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Repair & Repaint</Link>
                      <Link to="/return" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Return & Earn</Link>
                      <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">FAQ</Link>
                      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-textMuted hover:text-accent font-medium">Contact Us</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions (Cart, Wishlist, Notifs) - Hidden for Admins */}
              {(!user || user.role !== 'admin') && (
                <div className="flex flex-col space-y-5">
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-textMain hover:text-accent group">
                    <div className="flex items-center gap-3 font-semibold"><ShoppingCart size={22} className="text-textMuted group-hover:text-accent"/> My Cart</div>
                    {cartItems.length > 0 && <span className="bg-accent text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{cartItems.length}</span>}
                  </Link>
                  
                  {user && (
                    <>
                      <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-semibold text-textMain hover:text-accent group">
                        <Heart size={22} className="text-textMuted group-hover:text-accent"/> Saved Wishlist
                      </Link>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 font-semibold text-textMain"><Bell size={22} className="text-textMuted"/> Notifications</div>
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Theme Settings */}
              <div className="pt-4 border-t border-borderColor">
                <p className="text-xs font-bold text-textMuted uppercase mb-3">Theme Settings</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleTheme('light')} className={`flex-1 flex justify-center py-2 rounded-lg border transition-colors ${theme === 'light' ? 'bg-accent/10 border-accent text-accent' : 'bg-secondary border-borderColor text-textMuted hover:text-textMain'}`}><Sun size={18}/></button>
                  <button onClick={() => toggleTheme('dark')} className={`flex-1 flex justify-center py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-accent/10 border-accent text-accent' : 'bg-secondary border-borderColor text-textMuted hover:text-textMain'}`}><Moon size={18}/></button>
                  <button onClick={() => toggleTheme('wood')} className={`flex-1 flex justify-center py-2 rounded-lg border transition-colors ${theme === 'wood' ? 'bg-accent/10 border-accent text-accent' : 'bg-secondary border-borderColor text-textMuted hover:text-textMain'}`}><TreePine size={18}/></button>
                </div>
              </div>

            </div>

            {/* Logout Footer */}
            {user && (
              <div className="p-6 border-t border-borderColor bg-secondary/50">
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-3 rounded-xl border border-red-200 transition-colors"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;