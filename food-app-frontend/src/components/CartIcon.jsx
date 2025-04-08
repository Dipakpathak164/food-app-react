// components/CartIcon.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const CartIcon = ({ imagePath, setCartOpen }) => {
  const { cart } = useCart();

  return (
    <span
      className="cart_count mx-3 position-relative"
      role="button"
      onClick={() => setCartOpen(true)}
    >
      <span className="count_value position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {cart?.length || 0}
      </span>
      <img src={`${imagePath}bag.png`} alt="Cart" />
    </span>
  );
};

export default CartIcon;
