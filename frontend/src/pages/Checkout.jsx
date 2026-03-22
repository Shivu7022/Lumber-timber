import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle, ShieldCheck, ArrowLeft, MapPin, Truck, Calendar, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUpiVerification, setShowUpiVerification] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  const finalTotal = Math.max(0, total - (total * discountPercentage) / 100);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
       const res = await axiosClient.post('/api/coupons/validate', { code: couponCode });
       setDiscountPercentage(res.data.discountPercentage);
       setCouponMessage({ text: `Coupon applied: ${res.data.discountPercentage}% off!`, type: 'success' });
    } catch (err) {
       setDiscountPercentage(0);
       setCouponMessage({ text: err.response?.data?.msg || 'Invalid coupon', type: 'error' });
    }
  };

  useEffect(() => {
    let timer;
    if (showUpiVerification && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowUpiVerification(false);
      toast.error("Payment session expired. Please try again.");
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [showUpiVerification, timeLeft]);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  const submitUpiPayment = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      toast.error("Please enter a valid 12-digit UPI Transaction ID");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        totalAmount: finalTotal,
        toys: cartItems.map((item) => ({ toy: item._id, quantity: item.quantity })),
        paymentMethod: 'UPI',
        transactionId: utrNumber
      };
      
      await axiosClient.post('/api/orders/create', payload);
      
      setShowUpiVerification(false);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error('Payment verification failed.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    
    if (paymentMethod === 'upi') {
      setShowUpiVerification(true);
      setTimeLeft(300); // 5 minutes
    } else if (paymentMethod === 'cod') {
      setIsProcessing(true);
      try {
        const payload = {
          totalAmount: finalTotal,
          toys: cartItems.map((item) => ({ toy: item._id, quantity: item.quantity })),
          paymentMethod: 'COD'
        };
        await axiosClient.post('/api/orders/create', payload);
        setIsSuccess(true);
        clearCart();
      } catch (err) {
        toast.error('Order failed');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showUpiVerification) {
    const upiId = "7483608721-2@ybl";
    const upiLink = `upi://pay?pa=${upiId}&pn=Ramya%20C&am=${finalTotal}&cu=INR`;
    
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-gray-50 transition-colors duration-300 p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col max-w-lg w-full border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="text-purple-600" /> UPI Payment
            </h2>
            <div className="text-red-500 font-bold flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full text-sm">
              <Clock size={16} /> {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start text-center md:text-left">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 shrink-0">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`} 
                 alt="PhonePe QR Code" 
                 className="w-32 h-32"
               />
               <p className="text-xs text-center mt-2 text-gray-500 font-medium">Scan to Pay</p>
            </div>
            
            <div className="flex-1 w-full space-y-3">
               <p className="text-sm text-gray-600 font-medium">Please pay the exact amount below using any UPI App (PhonePe, GPay, Paytm) to complete your order.</p>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                    <span className="font-bold text-xl text-green-600">₹{finalTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">UPI ID</span>
                    <span className="font-mono font-bold text-sm text-gray-900">{upiId}</span>
                  </div>
               </div>
               
               {/* Deeplink for mobile devices */}
               <a 
                 href={upiLink}
                 className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm flex justify-center items-center gap-2 md:hidden"
               >
                 Tap to Pay in App
               </a>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
             <h3 className="text-sm justify-center font-bold text-blue-900 mb-2">Verification details</h3>
             <form onSubmit={submitUpiPayment} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-blue-800 mb-1">Enter 12-digit UPI Transaction ID (UTR)</label>
                 <input 
                   type="text" 
                   required
                   value={utrNumber}
                   onChange={(e) => setUtrNumber(e.target.value)}
                   placeholder="e.g. 123456789012"
                   className="w-full px-4 py-3 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">Or Upload Payment Screenshot (Optional)</label>
                  <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
               </div>
               
               <button disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 flex justify-center items-center gap-2">
                  {isProcessing ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Confirm Payment'}
               </button>
             </form>
          </div>
          
          <button onClick={() => setShowUpiVerification(false)} className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-900">
             Cancel Payment
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-secondary transition-colors duration-300">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary p-10 rounded-3xl shadow-xl border border-green-100 flex flex-col items-center max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
          >
             <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-3xl font-bold text-textMain mb-2">Payment Successful!</h2>
          <p className="text-textMuted mb-8">Your order has been placed. You will be redirected to your dashboard shortly.</p>
          <div className="animate-pulse flex gap-2 justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-secondary transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-textMuted hover:text-primary font-medium mb-8">
          <ArrowLeft size={20} /> Back to Cart
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Payment Details */}
          <div className="md:col-span-2">
            <div className="bg-primary rounded-3xl shadow-sm border border-secondary/20 p-8">
              <h1 className="text-3xl font-bold text-textMain mb-8 flex items-center gap-3">
                <ShieldCheck className="text-primary" size={32} /> Secure Checkout
              </h1>

              <form onSubmit={handlePayment}>
                {/* Delivery Address */}
                <h3 className="text-xl font-bold text-textMain mb-4 border-b border-borderColor pb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-primary"/> Delivery Address
                </h3>
                <div className="mb-8">
                  <textarea
                    required
                    rows="3"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    className="w-full px-4 py-3 border border-borderColor rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
                  ></textarea>
                </div>

                {/* Delivery Slot */}
                <h3 className="text-xl font-bold text-textMain mb-4 border-b border-borderColor pb-2 flex items-center gap-2">
                  <Calendar size={20} className="text-primary"/> Delivery Slot
                </h3>
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <label className="border border-borderColor p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-primary/50 text-sm">
                    <input type="radio" name="slot" value="standard" defaultChecked className="text-primary focus:ring-primary" />
                    <div>
                      <p className="font-bold">Standard Delivery</p>
                      <p className="text-textMuted">Anytime (3-5 days)</p>
                    </div>
                  </label>
                  <label className="border border-borderColor p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:border-primary/50 text-sm">
                    <input type="radio" name="slot" value="express" className="text-primary focus:ring-primary" />
                    <div>
                      <p className="font-bold">Scheduled</p>
                      <p className="text-textMuted">Tomorrow 9AM - 1PM</p>
                    </div>
                  </label>
                </div>

                <h3 className="text-xl font-bold text-textMain mb-4 border-b border-borderColor pb-2">Select Payment Method</h3>
                
                <div className="space-y-4 mb-8">
                  {/* UPI Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-borderColor hover:border-primary/50'
                  }`}>
                    <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="absolute opacity-0" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border border-borderColor shadow-sm">
                          <Smartphone className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-textMain">PhonePe / UPI</p>
                          <p className="text-sm text-textMuted">Pay directly from your bank account</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-borderColor'}`}>
                        {paymentMethod === 'upi' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-borderColor hover:border-primary/50'
                  }`}>
                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="absolute opacity-0" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border border-borderColor shadow-sm text-green-700">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-textMain">Cash on Delivery (COD)</p>
                          <p className="text-sm text-textMuted">Pay when your order arrives</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-borderColor'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processing secure payment...
                    </>
                  ) : (
                    <>Pay ₹{finalTotal}</>
                  )}
                </button>
                <div className="mt-4 text-center">
                  <p className="text-xs text-textMuted flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Payments are 100% secure and encrypted.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-secondary/20 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-xl font-bold text-textMain mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6 border-b border-borderColor pb-6">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex justify-between text-sm">
                  <span className="text-textMuted truncate mr-4">{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-textMain">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mb-6 pb-6 border-b border-borderColor">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Coupon Code (e.g. ECO10)" 
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value)}
                   className="flex-1 px-4 py-2 rounded-lg border border-borderColor focus:ring-2 focus:ring-primary focus:outline-none uppercase"
                 />
                 <button type="button" onClick={applyCoupon} className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-900">Apply</button>
               </div>
               {couponMessage.text && (
                 <p className={`text-sm mt-2 font-medium ${couponMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                   {couponMessage.text}
                 </p>
               )}
            </div>

            <div className="space-y-3 font-medium text-textMain">
               <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span>₹{total}</span>
               </div>
               {discountPercentage > 0 && (
                 <div className="flex justify-between text-green-600">
                   <span>Discount ({discountPercentage}%)</span>
                   <span>-₹{(total * discountPercentage) / 100}</span>
                 </div>
               )}
               <div className="flex justify-between">
                 <span>Shipping</span>
                 <span className="text-green-600">Free</span>
               </div>
               <div className="flex justify-between text-2xl font-black text-textMain pt-4 border-t border-borderColor mt-4">
                 <span>Total Pay</span>
                 <span>₹{finalTotal}</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
