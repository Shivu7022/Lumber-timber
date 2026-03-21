import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, RefreshCw, ShieldCheck, TreePine, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosClient from '../api/axiosClient';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationOverlay, setVerificationOverlay] = useState(false);

  const navigate = useNavigate();

  // Password Strength logic
  const getPasswordStrength = () => {
    let score = 0;
    if (formData.password.length > 6) score++;
    if (formData.password.length > 10) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const strengthDetails = [
    { color: 'bg-red-400', width: 'w-1/4', text: 'Weak' },
    { color: 'bg-orange-400', width: 'w-2/4', text: 'Fair' },
    { color: 'bg-green-400', width: 'w-3/4', text: 'Good' },
    { color: 'bg-green-600', width: 'w-full', text: 'Strong' },
    { color: 'bg-emerald-600', width: 'w-full', text: 'Excellent' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Mobile Number is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.identifier) && !/^\d{10}$/.test(formData.identifier.replace(/\D/g, ''))) {
      newErrors.identifier = 'Enter a valid Email or 10-digit Mobile Number';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
      const payload = {
        name: formData.name,
        email: isEmail ? formData.identifier : `${formData.identifier}@mobile.demo`, // Hack for robust demo backend
        password: formData.password
      };
      
      await axiosClient.post('/api/auth/register', payload);
      setVerificationOverlay(true); // Show local verification UI
    } catch (err) {
      setErrors({ form: err.response?.data?.msg || 'Registration failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationDone = () => {
     toast.success('Account verified! You can now sign in.');
     navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary relative flex items-center justify-center p-4 py-20">
      
      {/* Header inside the page background */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <Link to="/home" className="flex items-center gap-2 text-textMain font-black tracking-widest uppercase">
          <div className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center shadow-md">
            <TreePine size={18} />
          </div>
          Lumber & Timber
        </Link>
        <Link to="/home" className="flex items-center gap-2 text-sm font-bold text-textMuted hover:text-accent transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Centered Card */}
      <div className="max-w-md w-full bg-primary rounded-[2rem] shadow-theme overflow-hidden border border-borderColor p-8 md:p-10 relative mt-10">
          
        <div className="mb-8 text-center border-b border-borderColor pb-6">
          <h1 className="text-3xl font-black text-textMain mb-2">Create Account</h1>
          <p className="text-textMuted font-medium text-sm">Join us to track orders, wishlist, and more</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="space-y-5"
        >
          {errors.form && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-bold border border-red-200">
              <AlertCircle size={16} /> {errors.form}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-textMain mb-1.5 pl-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                <User size={18} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: ''}) }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-borderColor hover:border-accent/40'}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs font-bold mt-1.5 pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-textMain mb-1.5 pl-1">Email or Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                <Mail size={18} />
              </div>
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => { setFormData({...formData, identifier: e.target.value}); if(errors.identifier) setErrors({...errors, identifier: ''}) }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-colors ${errors.identifier ? 'border-red-400 bg-red-50' : 'border-borderColor hover:border-accent/40'}`}
                placeholder="you@example.com or 9876543210"
              />
            </div>
            {errors.identifier && <p className="text-red-500 text-xs font-bold mt-1.5 pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.identifier}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-textMain mb-1.5 pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => { setFormData({...formData, password: e.target.value}); if(errors.password) setErrors({...errors, password: ''}) }}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-borderColor hover:border-accent/40'}`}
                placeholder="Create a strong password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-textMuted hover:text-textMain transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-bold mt-1.5 pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
            
            {/* Strength Meter purely visual */}
            {formData.password.length > 0 && !errors.password && (
               <div className="mt-2 pl-1 pr-1">
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${strengthDetails[strengthScore-1]?.color} ${strengthDetails[strengthScore-1]?.width} transition-all duration-300`}></div>
                  </div>
                  <p className={`text-xs font-bold mt-1 text-right ${strengthDetails[strengthScore-1]?.color.replace('bg-', 'text-')}`}>
                    {strengthDetails[strengthScore-1]?.text} Password
                  </p>
               </div>
            )}
          </div>

          <div className="flex items-start gap-2 pl-1 mb-6">
              <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 rounded border-gray-300 text-accent focus:ring-accent" />
              <label htmlFor="terms" className="text-sm font-medium text-textMuted">
                I agree to the <span className="text-accent underline cursor-pointer hover:text-textMain">Terms</span> and <span className="text-accent underline cursor-pointer hover:text-textMain">Privacy Policy</span>.
              </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-on-accent py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-90 transition-colors disabled:opacity-70 shadow-lg shadow-accent/30"
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Sign Up'}
          </button>
        </motion.form>

        {/* Social Logins */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-borderColor"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-primary text-textMuted font-bold uppercase tracking-wider text-xs">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={() => {
                toast.success('Google Registration successful! (Demo)');
                navigate('/home');
              }}
              className="flex flex-col items-center justify-center gap-1 py-3 border border-borderColor rounded-xl hover:bg-secondary transition-colors font-bold text-xs text-textMain group" title="Google">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => {
                toast.success('Apple Registration successful! (Demo)');
                navigate('/home');
              }}
              className="flex flex-col items-center justify-center gap-1 py-3 border border-borderColor rounded-xl hover:bg-secondary transition-colors font-bold text-xs text-textMain group" title="Apple">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.08.45-2.02.66-2.98-.24-1.2-1.14-2.53-3.69-3.27-5.92-.81-2.43-.84-5.01.66-6.6 1.02-1.08 2.21-1.44 3.48-1.44 1.14 0 2.02.48 2.82.9 1.11.51 1.44.66 2.25.66.78 0 1.23-.27 2.37-.81 1.02-.51 1.95-.69 3.04-.63 1.8.06 3.04.93 3.84 2.19-2.82 1.68-2.31 5.31.54 6.78-1.05 2.16-2.49 4.02-4.41 5.76M12.03 6.36c-.06-1.56.78-3 1.92-3.93 1.23-1.08 2.67-1.47 4.08-1.32.18 1.65-.63 3.24-1.8 4.32-1.2 1.05-2.73 1.5-4.2 1.47V6.36" />
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => {
                toast.success('Facebook Registration successful! (Demo)');
                navigate('/home');
              }}
              className="flex flex-col items-center justify-center gap-1 py-3 border border-borderColor rounded-xl hover:bg-secondary transition-colors font-bold text-xs text-textMain group" title="Facebook">
              <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm font-medium text-textMain">
          Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Sign In</Link>
        </p>

        {/* Security Note */}
        <div className="flex items-center justify-center mt-6 gap-2 text-[10px] text-textMuted uppercase font-bold tracking-widest pl-1 bg-secondary py-2 rounded-lg border border-borderColor">
          <ShieldCheck size={14} className="text-green-500" /> Protected by reCAPTCHA
        </div>

      </div>

      {/* Verification Overlay Mock */}
      <AnimatePresence>
         {verificationOverlay && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
           >
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-primary rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-borderColor">
                <div className="w-20 h-20 bg-green-100 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={40} />
                </div>
                <h3 className="text-2xl font-black text-textMain mb-2">Verify your account</h3>
                <p className="text-sm text-textMuted mb-8">
                  We've sent a magic link to <strong className="text-textMain">{formData.identifier}</strong>. Click the link to instantly verify your account.
                </p>
                <button onClick={handleVerificationDone} className="w-full bg-accent text-on-accent py-3 rounded-xl font-bold mb-3 hover:brightness-90 transition-colors">
                   I have verified (Demo Skip)
                </button>
                <button onClick={() => setVerificationOverlay(false)} className="text-sm font-bold text-textMuted hover:text-textMain transition-colors">
                   Cancel
                </button>
             </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
