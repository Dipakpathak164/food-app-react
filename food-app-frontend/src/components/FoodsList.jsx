import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; // Adjust if path differs
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodList = ({ imagePath, baseUrl }) => {
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/foods')
      .then(res => setFoods(res.data))
      .catch(err => console.error('Failed to fetch foods:', err));
  }, []);

  return (
    <div className="row">
      {foods.map((item) => (
        <div
          className="col-md-4 item_cards position-relative"
          key={item._id}
          onClick={() => navigate(`/product-details/${item.id}`)}
          role="button"
          style={{ cursor: 'pointer' }}
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
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="cards_footer d-flex align-items-center justify-content-between">
            <div className="price">
              <p>₹{item.discounted_price || item.price}</p>
              <small>{item.weight || '220gr / 600 cal'}</small>
            </div>
            <div className="check_btns">
              <button
                className="btn btn_pus d-flex justify-content-center align-items-center"
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  addToCart(item);
                }}
              >
                <img src={`${imagePath}plus.png`} alt="plus" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
