import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle, ShieldCheck, ArrowLeft, MapPin, Truck, Calendar } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phonePeMockStatus, setPhonePeMockStatus] = useState(false);
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
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  const handleRazorpay = async () => {
    try {
      // 1. Create order on our backend
      const payload = {
        totalAmount: finalTotal,
        toys: cartItems.map((item) => ({ toy: item._id, quantity: item.quantity })),
      };
      
      const { data: orderData } = await axiosClient.post('/api/payments/razorpay/order', payload);

      if (orderData.isMock) {
        // Fallback if Razorpay keys are not configured in backend
        await axiosClient.post('/api/payments/razorpay/verify', {
           ...orderData,
           isMock: true,
           razorpayPaymentId: `mock_pay_${Date.now()}`,
           totalAmount: finalTotal,
           toys: payload.toys
        });
        setIsSuccess(true);
        clearCart();
        return;
      }

      // 2. Load Razorpay SDK
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id', // Add to your frontend .env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lumber Timber",
        description: "Eco-friendly Wooden Toys",
        image: "https://picsum.photos/100/100", // Your logo here
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify payment on backend
            await axiosClient.post('/api/payments/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              totalAmount: finalTotal,
              toys: payload.toys,
              isMock: false
            });
            setIsSuccess(true);
            clearCart();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#059669" // Primary color
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // Handle payment modal close
      paymentObject.on('payment.failed', function (response) {
        toast.error("Payment Failed: " + response.error.description);
        setIsProcessing(false);
      });

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong initiating Razorpay');
      setIsProcessing(false);
    }
  };

  const handlePhonePe = async () => {
    try {
      const payload = {
        totalAmount: finalTotal,
        toys: cartItems.map((item) => ({ toy: item._id, quantity: item.quantity })),
      };
      
      // 1. Init PhonePe Transaction
      const { data } = await axiosClient.post('/api/payments/phonepe/order', payload);
      
      // Mocking the redirect experience since we don't have real PhonePe setup
      setPhonePeMockStatus(true);
      
      setTimeout(async () => {
         // 2. Verify PhonePe
         await axiosClient.post('/api/payments/phonepe/verify', {
            transactionId: data.transactionId,
            totalAmount: finalTotal,
            toys: payload.toys
         });
         
         setPhonePeMockStatus(false);
         setIsSuccess(true);
         clearCart();
      }, 3000);
      
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong initiating PhonePe');
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    
    if (paymentMethod === 'upi') {
      await handlePhonePe();
    } else if (paymentMethod === 'cod') {
      // Mock COD
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
      }, 1500);
    } else {
      await handleRazorpay();
    }
    
    // We only reset isProcessing if modal closes or fails. 
    // If successful, on success effects clear state and navigate.
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (phonePeMockStatus) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-secondary transition-colors duration-300">
        <div className="bg-primary p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-md text-center">
          <Smartphone size={48} className="text-purple-600 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2 text-textMain">Redirecting to PhonePe...</h2>
          <p className="text-textMuted mb-6">Please do not refresh or press back.</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
             <div className="bg-purple-600 h-full animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full"></div>
          </div>
        </div>
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

                  {/* Razorpay Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-borderColor hover:border-primary/50'
                  }`}>
                    <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="absolute opacity-0" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border border-borderColor shadow-sm font-bold text-blue-600">
                          ₹
                        </div>
                        <div>
                          <p className="font-bold text-textMain">Razorpay (Cards, NetBanking, Wallets)</p>
                          <p className="text-sm text-textMuted">Visa, MasterCard, RuPay, etc.</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-borderColor'}`}>
                        {paymentMethod === 'card' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
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
