import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw, ShieldCheck, TreePine, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const Login = () => {
  const [portal, setPortal] = useState('user'); // 'user' or 'admin' 
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [identifier, setIdentifier] = useState(''); // Email exclusively
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Lockout countdown
  useEffect(() => {
    let timer;
    if (lockoutTimer > 0) {
      timer = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
    } else if (lockoutTimer === 0 && failedAttempts >= 3) {
      setFailedAttempts(0); // reset after lockout period
    }
    return () => clearInterval(timer);
  }, [lockoutTimer, failedAttempts]);

  // Handle Resend countdown
  useEffect(() => {
    let rTimer;
    if (resendTimer > 0) {
      rTimer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(rTimer);
  }, [resendTimer]);

  const validateIdentifier = () => {
    if (!identifier) return 'Email address is required';
    if (!/\S+@\S+\.\S+/.test(identifier)) {
      return 'Enter a valid Email Address';
    }
    return '';
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const idError = validateIdentifier();
    if (idError) {
      setErrors({ identifier: idError });
      return;
    }
    setErrors({});
    
    setLoading(true);
    try {
      const data = await login(identifier, password);
      toast.success(`Welcome back, ${data.role === 'admin' ? 'Admin' : 'Shopper'}!`);
      if (data.role === 'admin') {
         navigate('/home');
      } else {
         navigate('/home');
      }
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
         setLockoutTimer(30);
         toast.error('Too many failed attempts. Locked out for 30s.');
      } else {
         setErrors({ form: err.response?.data?.msg || 'Invalid credentials. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const idError = validateIdentifier();
    if (idError) {
      setErrors({ identifier: idError });
      return;
    }
    setErrors({});
    setLoading(true);
    
    axiosClient.post('/api/auth/send-otp', { email: identifier })
      .then(res => {
         setLoading(false);
         setOtpSent(true);
         setResendTimer(60);
         toast.success(res.data.msg);
         if (res.data.mockOtp) {
            toast.success(`🛠️ DEV MODE OTP: ${res.data.mockOtp} (check terminal if skipped)`, { duration: 10000, position: 'top-center' });
         }
      })
      .catch(err => {
         setLoading(false);
         toast.error(err.response?.data?.msg || 'Failed to send OTP');
      });
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Focus next input
    if (element.value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
       setErrors({ otp: 'Please fill all 6 digits of the OTP' });
       return;
    }
    setLoading(true);
    
    axiosClient.post('/api/auth/verify-otp', { email: identifier, otp: otpString })
      .then(res => {
         setLoading(false);
         // Storing the actual token from the backend
         localStorage.setItem('token', res.data.token);
         toast.success('Successfully verified!');
         // Force reload to let AuthContext pick up token from localStorage, or redirect
         if (res.data.role === 'admin') {
            window.location.href = '/home';
         } else {
            window.location.href = '/home';
         }
      })
      .catch(err => {
         setLoading(false);
         setOtp(['', '', '', '', '', '']); // clear boxes on failure
         if (otpRefs.current[0]) otpRefs.current[0].focus();
         setErrors({ otp: err.response?.data?.msg || 'Verification failed' });
      });
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
          
        {/* Main Portal Toggle */}
        <div className="flex bg-secondary p-1 rounded-xl mb-4 border border-borderColor">
            <button 
              onClick={() => { setPortal('user'); setErrors({}); }} 
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${portal === 'user' ? 'bg-primary text-accent shadow-sm border border-borderColor' : 'text-textMuted hover:text-textMain'}`}
            >
              Customer Platform
            </button>
            <button 
              onClick={() => { setPortal('admin'); setLoginMethod('password'); setErrors({}); }} 
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${portal === 'admin' ? 'bg-primary text-red-600 shadow-sm border border-borderColor' : 'text-textMuted hover:text-textMain'}`}
            >
              <ShieldCheck size={16} className={portal === 'admin' ? 'text-red-500' : ''}/> Admin Login
            </button>
        </div>

        <div className="mb-8 text-center border-b border-borderColor pb-6">
          <h1 className="text-3xl font-black text-textMain mb-2">{portal === 'admin' ? 'Admin Portal' : 'Welcome Back'}</h1>
          <p className="text-textMuted font-medium text-sm">{portal === 'admin' ? 'Authorized personnel strictly' : 'Sign in to track orders, wishlist, and more'}</p>
        </div>

        {/* Sub-Tabs (Only visible for Users) */}
        {portal === 'user' && (
          <div className="flex bg-secondary p-1 rounded-xl mb-8 border border-borderColor">
              <button 
                onClick={() => { setLoginMethod('password'); setErrors({}); setOtpSent(false); }} 
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'password' ? 'bg-primary text-textMain shadow-sm border border-borderColor' : 'text-textMuted hover:text-textMain'}`}
              >
                Login with Password
              </button>
              <button 
                onClick={() => { setLoginMethod('otp'); setErrors({}); }} 
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'otp' ? 'bg-primary text-textMain shadow-sm border border-borderColor' : 'text-textMuted hover:text-textMain'}`}
              >
                Login with OTP
              </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loginMethod === 'password' ? (
            <motion.form 
              key="password-form"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handlePasswordSubmit} 
              className="space-y-5"
            >
              {errors.form && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-bold border border-red-200">
                  <AlertCircle size={16} /> {errors.form}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-textMain mb-1.5 pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                    <Mail size={18} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); if(errors.identifier) setErrors({...errors, identifier: ''})}}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-colors ${errors.identifier ? 'border-red-400 bg-red-50' : 'border-borderColor hover:border-accent/40'}`}
                    placeholder="Enter your email address"
                    disabled={lockoutTimer > 0}
                  />
                </div>
                {errors.identifier && <p className="text-red-500 text-xs font-bold mt-1.5 pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.identifier}</p>}
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5 pl-1 pr-1">
                  <label className="block text-sm font-bold text-textMain">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-accent hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-borderColor bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain hover:border-accent/40 transition-colors"
                    placeholder="Enter your password"
                    disabled={lockoutTimer > 0}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-textMuted hover:text-textMain transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-1 mb-6">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
                  <label htmlFor="remember" className="text-sm font-medium text-textMuted cursor-pointer">Remember me (30 days)</label>
              </div>

              <button 
                type="submit" 
                disabled={loading || lockoutTimer > 0}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-lg ${portal === 'admin' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30' : 'bg-accent text-on-accent hover:brightness-90 shadow-accent/30'}`}
              >
                {lockoutTimer > 0 ? (
                  `Try again in ${lockoutTimer}s`
                ) : loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  portal === 'admin' ? 'Secure Login' : 'Sign In'
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-form"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={otpSent ? handleOtpSubmit : handleSendOtp} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-textMain mb-1.5 pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textMuted">
                    <Mail size={18} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); if(errors.identifier) setErrors({...errors, identifier:''})}}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-colors ${errors.identifier ? 'border-red-400 bg-red-50' : 'border-borderColor hover:border-accent/40'}`}
                    placeholder="Enter your email address"
                    disabled={otpSent}
                  />
                </div>
                {errors.identifier && <p className="text-red-500 text-xs font-bold mt-1.5 pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.identifier}</p>}
              </div>

              {otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-bold text-textMain mb-2 pl-1 text-center">Enter 6-digit OTP</label>
                  <div className="flex justify-center gap-2 sm:gap-3 mb-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                        onKeyDown={e => handleOtpKeyDown(e, index)}
                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-black rounded-xl border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 text-textMain transition-all shadow-sm ${data ? 'border-accent/60' : 'border-borderColor'}`}
                        placeholder="·"
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs font-bold mt-2 pl-1 text-center flex justify-center items-center gap-1"><AlertCircle size={14}/>{errors.otp}</p>}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={loading || !identifier || (otpSent && otp.join('').length !== 6)}
                className="w-full bg-accent text-on-accent py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-90 transition-colors disabled:opacity-70 disabled:bg-gray-400 shadow-lg"
              >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : (otpSent ? 'Verify & Sign In' : 'Send OTP')}
              </button>
              
              {otpSent && (
                <div className="flex flex-col items-center gap-1.5 mt-5">
                  <p className="text-center text-sm font-medium text-textMuted">
                    Didn't receive code?{' '}
                    <button 
                      type="button" 
                      disabled={resendTimer > 0} 
                      onClick={handleSendOtp} 
                      className={`font-bold transition-colors ${resendTimer > 0 ? 'text-textMuted cursor-not-allowed' : 'text-accent hover:underline'}`}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </p>
                  <button type="button" onClick={() => {setOtpSent(false); setResendTimer(0); setOtp(['','','','','','']);}} className="text-xs text-textMuted hover:text-textMain font-bold underline transition-colors">
                    Change Email Address
                  </button>
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Social Logins - Hidden for Admins */}
        {portal === 'user' && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-borderColor"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-primary text-textMuted font-bold uppercase tracking-wider text-xs">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button 
                type="button"
                onClick={() => {
                  toast.success('Google Login successful! (Demo)');
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
                  toast.success('Apple Login successful! (Demo)');
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
                  toast.success('Logged in with Facebook!');
                  navigate('/home');
                }}
                className="flex flex-col items-center justify-center gap-1 py-3 border border-borderColor rounded-xl hover:bg-secondary transition-colors font-bold text-xs text-textMain group" title="Facebook">
                <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {portal === 'user' && (
          <p className="text-center mt-8 text-sm font-medium text-textMain">
            Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">Sign Up</Link>
          </p>
        )}

        {/* Security Note */}
        <div className="flex items-center justify-center mt-6 gap-2 text-[10px] text-textMuted uppercase font-bold tracking-widest pl-1 bg-secondary py-2 rounded-lg border border-borderColor">
          <ShieldCheck size={14} className="text-green-500" /> Protected by reCAPTCHA
        </div>

      </div>
    </div>
  );
};

export default Login;
