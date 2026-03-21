import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';
import Products from './pages/Marketplace';
import ToyDetails from './pages/ToyDetails';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Adopt from './pages/Adopt';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Subscribe from './pages/Subscribe';
import About from './pages/About';
import Repair from './pages/Repair';
import Return from './pages/Return';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

const NotFound = () => (
  <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <h1 className="text-8xl font-black text-primary mb-4">404</h1>
    <h2 className="text-3xl font-bold text-textMain mb-6">Page Not Found</h2>
    <p className="text-textMuted max-w-md mx-auto mb-8 text-lg">The page or product you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    <Link to="/home" className="btn-primary flex items-center gap-2">
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Standard Pages with Navbar & Footer */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<LandingPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/toy/:id" element={<ToyDetails />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/adopt" element={<Adopt />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/about" element={<About />} />
              <Route path="/repair" element={<Repair />} />
              <Route path="/return" element={<Return />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Authentication Pages (Split Screen, No Navbar) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;