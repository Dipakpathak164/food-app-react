import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast'; // 👈 import toast
import { useNavigate } from 'react-router-dom'; 

const ProductDetails = ({ imagePath = '/assets/images/' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const mainImageRef = useRef(null);
  const zoomLensRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/foods/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleZoom = (e) => {
    if (window.innerWidth <= 768) return;
    const mainImage = mainImageRef.current;
    const lens = zoomLensRef.current;

    const bounds = mainImage.getBoundingClientRect();
    const posX = e.clientX - bounds.left;
    const posY = e.clientY - bounds.top;

    const zoomX = (posX / bounds.width) * 100;
    const zoomY = (posY / bounds.height) * 100;

    lens.style.backgroundImage = `url(${mainImage.src})`;
    lens.style.backgroundSize = '150%';
    lens.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
    lens.style.display = 'block';
  };

  const hideZoom = () => {
    if (zoomLensRef.current) {
      zoomLensRef.current.style.display = 'none';
    }
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) setQuantity(num);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
  
      toast.success('Your cart has been updated!', {
        duration: 3000,
        icon: '🛒',
      });
  
      // 👇 Redirect after a short delay (optional)
      setTimeout(() => {
        navigate(`/cart/${product.id}`);
      }, 800); // Delay allows user to see the toast briefly
    }
  };

  if (!product) return <p className="text-center py-5">Loading product...</p>;

  return (
    <main>
      <section className="product_details_wrapper mt-5">
        <div className="product_details_inner container">
          <div className="row">
            {/* Images */}
            <div className="col-md-6">
              <div className="product-image-box">
                <div className="main-image position-relative">
                  <img
                    ref={mainImageRef}
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                    onMouseMove={handleZoom}
                    onMouseLeave={hideZoom}
                    className="img-fluid"
                  />
                  <div id="zoomLens" ref={zoomLensRef}></div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="col-md-6 d-flex align-items-center ps-md-4 pe-md-0">
              <div className="product-details">
                <h2>{product.name}</h2>
                <div className="price_display d-flex align-items-center">
                  <span className="discount">₹{product.discounted_price || product.price}</span>
                </div>

                <div className="prod_desc">
                  <h5 className="mb-2">Ingredients:</h5>
                  <p>{product.ingredients || 'N/A'}</p>
                </div>

                <div className="d-flex flexBtns align-items-center">
                  <div className="increase_decreaseBtn position-relative me-3">
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      onBlur={() => {
                        if (quantity < 1) setQuantity(1);
                      }}
                      className="form-control"
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                    <span className="increase" onClick={() => setQuantity(q => q + 1)}>
                      <img src={`${imagePath}increaseIcon.svg`} alt="+" />
                    </span>
                    <span className="decrease" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>
                      <img src={`${imagePath}decreaseIcon.svg`} alt="-" />
                    </span>
                  </div>

                  <button className="btn unique-button" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="row mt-4">
            <div className="col-md-12 description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
