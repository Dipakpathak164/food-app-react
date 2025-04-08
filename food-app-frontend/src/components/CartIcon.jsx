// components/CartIcon.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const CartIcon = ({ imagePath }) => {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span
        className="cart_count mx-3 position-relative"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        <span className="count_value position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cart?.length || 0}
        </span>
        <img src={`${imagePath}bag.png`} alt="Cart" />
      </span>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CartIcon;
