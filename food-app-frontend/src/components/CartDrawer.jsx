import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ imagePath, isOpen, onClose }) => {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="cart-drawer-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Your Cart</h5>
          <button onClick={onClose} className="btn-close"></button>
        </div>
        <div className="cart-drawer-body p-3">
          {cart.length > 0 ? (
            <>
              <ul className="list-group mb-3">
                {cart.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span>× {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary w-100 me-2"
                  onClick={() => {
                    onClose();
                    setTimeout(() => navigate('/cart'), 300); // optional delay
                  }}
                >
                  View Cart
                </button>
                <button
                  className="btn unique-button w-100"
                  onClick={() => {
                    onClose();
                    setTimeout(() => navigate('/cart'), 300); // optional delay
                  }}
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p className="text-center emtyTexts"><img src={`${imagePath}abandoned-cart.png`} className="" alt="center_img" /> Your Cart is Empty!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
