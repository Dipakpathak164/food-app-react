import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CartPage = ({ imagePath }) => {
    const { cart, incrementQty, decrementQty, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <>
            <section className='top_common_section'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center content">
                            <h1>Your Shopping Cart</h1>
                            <p>Start your order and enjoy the tastiest burgers</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='second-bg-white cartViewSection'>
                <div className="container">
                    {cart.length > 0 ? (
                        <>
                            <h2 className='sub_title'>Your Cart</h2>
                            <ul className="list-group mb-4">
                                {cart.map((item, index) => (
                                    <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
                                        <Link to={`/product-details/${item.id}`} className="text-decoration-none text-dark">
                                            <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                                <img
                                                    src={`http://localhost:5000/uploads/${item.image}`}
                                                    alt={item.name}
                                                    style={{ width: 60, height: 60, objectFit: 'cover', marginRight: '15px' }}
                                                />
                                                <div>
                                                    <strong>{item.name}</strong><br />
                                                    <small>₹{item.discounted_price || item.price} × {item.quantity}</small>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-sm addRemoveBtn me-2"
                                                onClick={() => decrementQty(item)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <img src={`${imagePath}minus-sign.png`} alt="" />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="btn btn-sm  addRemoveBtn ms-2"
                                                onClick={() => incrementQty(item)}
                                            >
                                                <img src={`${imagePath}plus2.png`} alt="" />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-3"
                                                onClick={() => {
                                                    removeFromCart(item);
                                                    toast.success(`${item.name} removed from cart`);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-end">
                                <button className="btn unique-button" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <img
                                src={`${imagePath}abandoned-cart.png`}
                                alt="Empty Cart"
                                style={{ marginBottom: '1rem', opacity: 0.6 }}
                            />
                            <p>Your cart is empty.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default CartPage;
