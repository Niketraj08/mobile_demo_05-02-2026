import { createContext, useContext, useReducer, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary,
        loading: false
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        summary: { subtotal: 0, tax: 0, shipping: 0, total: 0 }
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  summary: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  },
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user logs in
  const fetchCart = async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await userAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response.data.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await userAPI.addToCart(productId, quantity);
      await fetchCart(); // Refetch cart to get updated data
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await userAPI.updateCart(productId, quantity);
      await fetchCart(); // Refetch cart to get updated data
    } catch (error) {
      console.error('Error updating cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await userAPI.updateCart(productId, 0);
      await fetchCart(); // Refetch cart to get updated data
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await userAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    }
  };

  // Get item count
  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  // Effect to fetch cart when authentication changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const value = {
    ...state,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
