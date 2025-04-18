import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FoodList = ({ imagePath }) => {
  const [foods, setFoods] = useState([]);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/foods')
      .then(res => setFoods(res.data))
      .catch(err => console.error('Failed to fetch foods:', err));
  }, []);

  const handleAddToCart = (e, item) => {
    const alreadyInCart = cart.some(cartItem => cartItem.id === item.id);

    if (alreadyInCart) {
      e.stopPropagation(); // Only stop propagation if we redirect
      navigate(`/cart/${item.id}`);
      return;
    }

    e.stopPropagation(); // Only stop when we're preventing card click and adding to cart
    setLoadingItemId(item.id);

    setTimeout(() => {
      addToCart({ ...item, quantity: 1 });
      toast.success(`${item.name} added to cart!`);
      setLoadingItemId(null);
    }, 1500);
  };


  return (
    <div className="row">
      {foods.map((item) => {
        const inCart = cart.some(cartItem => cartItem.id === item.id);

        return (
          <div
            className="col-md-4 item_cards position-relative"
            key={item._id}
            onClick={(e) => {
              if (loadingItemId !== item.id) {
                navigate(`/product-details/${item.id}`);
              }
            }}
            role="button"
            style={{
              cursor: loadingItemId === item.id ? 'not-allowed' : 'pointer',
              opacity: loadingItemId === item.id ? 0.5 : 1, // Optional to visually indicate the disabled state
            }}
          >
            <div className="cards d-inline-flex w-100">
              <div className="cards_header">
                <h5>{item.category || 'Category'}</h5>
                <h3>{item.name}</h3>
              </div>
              <div className="cards_body">
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="cards_footer d-flex align-items-center justify-content-between">
              <div className="price">
                {item.discounted_price ? (
                  <p className="d-flex flex-column">
                    <span className="fw-bold">₹{item.discounted_price}</span>
                    <small><del className="text-danger me-2 fw-bold">₹{item.price}</del></small>
                  </p>
                ) : (
                  <p>₹{item.price}</p>
                )}
              </div>

              <div className="check_btns">
                {loadingItemId === item.id ? (
                  <button
                    className="btn btn_pus d-flex justify-content-center align-items-center"
                    disabled
                  >
                    <img src={`${imagePath}rotate.png`} alt="settings" className="rotate" />
                  </button>
                ) : !inCart ? (
                  <button
                    className="btn btn_pus d-flex justify-content-center align-items-center"
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    <img src={`${imagePath}plus.png`} alt="plus" />
                  </button>
                ) : (
                  <button
                    className="btn btn_pus bg-danger d-flex justify-content-center align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cart/${item.id}`);
                    }}
                  >
                    <img src={`${imagePath}shopping-bag.png`} alt="cart" />
                  </button>
                )}

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FoodList;
