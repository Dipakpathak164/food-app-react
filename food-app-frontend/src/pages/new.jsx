import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TopSection from '../components/TopSection';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    const [shipToDifferent, setShipToDifferent] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        fullName: '',
        country: 'India',
        state: '',
        city: '',
        zip: '',
        address: '',
    });

    const [shippingData, setShippingData] = useState({
        fullName: '',
        country: 'India',
        state: '',
        city: '',
        zip: '',
        address: '',
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia'];

    const handleInputChange = (e, isShipping = false) => {
        const { name, value } = e.target;
        if (isShipping) {
            setShippingData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user: formData,
            shipping: shipToDifferent ? shippingData : formData,
            cart,
            totalAmount,
            paymentMethod,
        };

        try {
            const res = await fetch('/api/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token); // auto-login
                clearCart(); // optional: clear cart after order placed
                navigate('/order-success'); // ✅ redirect to thank you page
            } else {
                alert(data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Try again.');
        }
    };

    return (
        <>
            <TopSection
                title="Check Your Order"
                subtitle="We guarantee delivery that arrives within an hour"
            />
            <section className='second-bg-white cartViewSection'>
                <div className="container p-5">
                    <h2 className="mb-4">Checkout</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Billing Details */}
                        <h5 className="mb-3">Billing Details</h5>
                        <div className="row g-3 mb-4">
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Country *</label>
                                    <select
                                        className="form-select"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {countries.map((country, i) => (
                                            <option key={i}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>Town / City *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label>ZIP *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ship to different address */}
                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="shipDiff"
                                onChange={(e) => setShipToDifferent(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="shipDiff">
                                Ship to a different address?
                            </label>
                        </div>

                        {shipToDifferent && (
                            <>
                                <h5 className="mb-3">Shipping Details</h5>
                                <div className="row g-3 mb-4">
                                    {/* Shipping input fields */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={shippingData.fullName}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Country *</label>
                                            <select
                                                className="form-select"
                                                name="country"
                                                value={shippingData.country}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            >
                                                {countries.map((country, i) => (
                                                    <option key={i}>{country}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={shippingData.state}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Town / City *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={shippingData.city}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>ZIP *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="zip"
                                                value={shippingData.zip}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label>Street Address *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="address"
                                                value={shippingData.address}
                                                onChange={(e) => handleInputChange(e, true)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Payment Options */}
                        <h5 className="mb-3">Payment</h5>
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="form-check-input"
                                    id="cod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="cod">
                                    Cash on Delivery
                                </label>
                            </div>
                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="form-check-input"
                                    id="card"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="card">
                                    Pay with Card
                                </label>
                            </div>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label>Card Number *</label>
                                    <input type="text" className="form-control" required />
                                </div>
                                <div className="col-md-3">
                                    <label>Expiry *</label>
                                    <input type="text" className="form-control" placeholder="MM/YY" required />
                                </div>
                                <div className="col-md-3">
                                    <label>CVV *</label>
                                    <input type="text" className="form-control" required />
                                </div>
                            </div>
                        )}

                        {/* Order Summary */}
                        <h5 className="mb-3">Order Summary</h5>
                        <ul className="list-group mb-4">
                            {cart.map((item, i) => (
                                <li key={i} className="list-group-item d-flex justify-content-between">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </li>
                        </ul>

                        <button type="submit" className="btn unique-button w-100">
                            Place Order
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Checkout;
