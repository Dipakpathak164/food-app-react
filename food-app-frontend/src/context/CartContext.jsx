import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: action.payload.quantity }];
      }
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload.id);

    case 'CLEAR_CART':
      return [];

    case 'INCREMENT_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREMENT_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    default:
      return state;
  }
};

// ✅ Lazy load from localStorage during initial render
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);

  // ✅ Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => dispatch({ type: 'ADD_TO_CART', payload: food });
  const removeFromCart = (food) => dispatch({ type: 'REMOVE_FROM_CART', payload: food });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const incrementQty = (food) => dispatch({ type: 'INCREMENT_QUANTITY', payload: food });
  const decrementQty = (food) => dispatch({ type: 'DECREMENT_QUANTITY', payload: food });

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, incrementQty, decrementQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
