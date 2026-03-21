import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const STORAGE_KEY = 'lumber-timber-cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (toy, quantity = 1) => {
    setCartItems((items) => {
      const existing = items.find((item) => item._id === toy._id);
      if (existing) {
        return items.map((item) =>
          item._id === toy._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { ...toy, quantity }];
    });
    toast.success('Added to cart');
  };

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item._id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [cartItems]
  );

  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const checkout = async ({ paymentMethod = 'card' } = {}) => {
    if (!cartItems.length) {
      toast.error('Cart is empty');
      return null;
    }

    try {
      const payload = {
        toys: cartItems.map((item) => ({ toy: item._id, quantity: item.quantity })),
        totalAmount: total,
        paymentMethod
      };

      const { data } = await axiosClient.post('/api/orders', payload);
      clearCart();
      toast.success('Order placed successfully');
      return data;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Checkout failed');
      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        shipping,
        total,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
