import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ToyCard from '../components/ToyCard';
import { useCart } from '../contexts/CartContext';
import { mockToys } from '../store/mockToys'; // Only used for fallback brands extraction if needed

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination & API state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalToys, setTotalToys] = useState(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [selectedAges, setSelectedAges] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brand') ? [searchParams.get('brand')] : []);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);

  const categories = ['Baby Toys', 'Educational Toys', 'Decorative Toys', 'Puzzle Toys', 'Vehicles', 'Animals', 'Construction', 'Dolls'];
  const ageGroups = ['0-2 years', '3-5 years', '6-8 years', '9+ years'];

  const fetchToys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct query string
      const params = new URLSearchParams({
        page: page,
        limit: 12,
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategories.length > 0) params.append('category', selectedCategories.join(','));
      if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));
      if (selectedAges.length > 0) params.append('ageGroup', selectedAges.join(','));
      if (priceRange < 5000) params.append('maxPrice', priceRange);
      if (minRating > 0) params.append('minRating', minRating);
      if (sortBy) params.append('sort', sortBy);

      const { data } = await axiosClient.get(`/api/toys?${params.toString()}`);
      
      if (data.toys) {
        setToys(data.toys);
        setTotalPages(data.totalPages);
        setTotalToys(data.totalToys);
      } else if (Array.isArray(data)) {
        // Fallback backward compatibility
        setToys(data);
        setTotalPages(1);
        setTotalToys(data.length);
      }
    } catch (err) {
      console.error(err);
      // Client-side fallback if server fails
      setToys(mockToys.slice(0, 12));
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategories, selectedBrands, selectedAges, priceRange, minRating, sortBy]);

  // Fetch unique brands once ideally from a separate endpoint, but we'll mock it or extract it for now
  useEffect(() => {
    // Attempt to fetch all brands or just use mock fallback for the filter UI
    setAvailableBrands(Array.from(new Set(mockToys.map(t => t.artisan?.name || t.artisan).filter(Boolean))));
  }, []);

  useEffect(() => {
    // Reset page to 1 whenever filters change
    setPage(1);
  }, [searchQuery, selectedCategories, selectedBrands, selectedAges, priceRange, minRating, sortBy]);

  useEffect(() => {
    fetchToys();
  }, [fetchToys]);

  // Sync URL search params with state
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);
    const cat = searchParams.get('category');
    if (cat && !selectedCategories.includes(cat)) setSelectedCategories(prev => [...prev, cat]);
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
    const brand = searchParams.get('brand');
    if (brand && !selectedBrands.includes(brand)) setSelectedBrands(prev => [...prev, brand]);
  }, [searchParams]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return Array.from(new Set(mockToys.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => t.name))).slice(0, 5);
  }, [searchQuery]);

  const toggleFilter = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAges([]);
    setSelectedBrands([]);
    setPriceRange(5000);
    setMinRating(0);
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="pt-24 pb-20 bg-secondary min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar for Mobile Filters & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-primary p-4 rounded-xl shadow-theme border border-borderColor relative z-20">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              className="lg:hidden btn-primary flex items-center gap-2 py-2 px-4 shadow-none text-sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <span className="text-textMuted font-medium">
              Showing {totalToys} Products
            </span>
          </div>
          <div className="flex items-center gap-2 text-textMuted text-sm font-medium bg-secondary px-4 py-2 rounded-lg border border-borderColor">
            Sort by:
            <select 
              className="bg-transparent border-none focus:outline-none text-textMain font-bold cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="popular">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div 
            className={`lg:w-1/4 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-primary rounded-2xl shadow-theme border border-borderColor p-6 sticky top-28 transition-colors duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-textMain flex items-center gap-2">
                  <Filter size={20} className="text-accent" /> Filters
                </h2>
                {(selectedCategories.length > 0 || selectedAges.length > 0 || searchQuery || priceRange !== 5000) && (
                  <button onClick={clearFilters} className="text-sm text-accent hover:underline font-medium">Clear All</button>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search precisely..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-none bg-secondary shadow-inner focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain relative z-30"
                  />
                  <Search className="absolute left-3 top-2.5 text-textMuted z-30" size={16} />
                  
                  {showSuggestions && searchSuggestions.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-1 bg-primary border border-borderColor rounded-lg shadow-theme overflow-hidden z-40">
                        {searchSuggestions.map((suggestion, idx) => (
                           <div 
                              key={suggestion} 
                              onClick={() => { setSearchQuery(suggestion); setShowSuggestions(false); }}
                              className="px-4 py-2 text-sm text-textMain hover:bg-secondary cursor-pointer border-b border-borderColor last:border-0"
                           >
                              {suggestion}
                           </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-textMain mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(category) ? 'bg-accent border-accent text-white' : 'border-borderColor bg-primary group-hover:border-accent'}`}>
                        {selectedCategories.includes(category) && <Check size={14} />}
                      </div>
                      <span className="text-textMain text-sm">{category}</span>
                      <input type="checkbox" className="hidden" checked={selectedCategories.includes(category)} onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="mb-6">
                <h3 className="font-bold text-textMain mb-3">Age Group</h3>
                <div className="space-y-2">
                  {ageGroups.map(age => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAges.includes(age) ? 'bg-accent border-accent text-white' : 'border-borderColor bg-primary group-hover:border-accent'}`}>
                        {selectedAges.includes(age) && <Check size={14} />}
                      </div>
                      <span className="text-textMain text-sm">{age}</span>
                      <input type="checkbox" className="hidden" checked={selectedAges.includes(age)} onChange={() => toggleFilter(age, selectedAges, setSelectedAges)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-bold text-textMain mb-3 flex justify-between">
                  Price <span>Up to ₹{priceRange}</span>
                </h3>
                <input 
                  type="range" 
                  min="500" max="5000" step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-accent bg-borderColor rounded-lg appearance-none h-2"
                />
              </div>

              <div className="border-t border-borderColor pt-4">
                <h3 className="font-semibold text-textMain mb-3">Customer Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${minRating === rating ? 'border-accent' : 'border-borderColor group-hover:border-accent'}`}>
                        {minRating === rating && <div className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-textMain">{rating}</span>
                        <Star size={14} className="fill-accent text-accent" />
                        <span className="text-sm text-textMuted">& Up</span>
                      </div>
                      <input type="radio" name="rating" className="hidden" checked={minRating === rating} onChange={() => setMinRating(rating)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-textMain mb-3 flex justify-between pr-4 mt-4 border-t border-borderColor pt-4">Brands / Artisans</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-accent border-accent text-white' : 'border-borderColor bg-primary group-hover:border-accent'}`}>
                          {selectedBrands.includes(brand) && <Check size={12} />}
                        </div>
                        <span className="text-textMain text-sm truncate">{brand}</span>
                        <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="lg:w-3/4 flex flex-col min-h-full">
            {loading ? (
              <div className="flex items-center justify-center flex-grow">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : toys.length > 0 ? (
              <>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {toys.map((toy) => (
                    <ToyCard key={toy._id || toy.id} toy={toy} onAddToCart={addToCart} />
                  ))}
                </motion.div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-auto pt-8 border-t border-borderColor">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-borderColor bg-primary text-textMain hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${page === pageNum ? 'bg-accent text-white border-accent' : 'border border-borderColor bg-primary text-textMain hover:bg-secondary'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-borderColor bg-primary text-textMain hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-primary rounded-2xl shadow-theme border border-borderColor p-12 text-center h-full flex flex-col items-center justify-center flex-grow">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <Search size={40} className="text-textMuted" />
                </div>
                <h3 className="text-2xl font-bold text-textMain mb-2">No toys found</h3>
                <p className="text-textMuted max-w-sm mx-auto mb-6">We couldn't find anything matching your filters. Try adjusting your search or categories.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Marketplace;