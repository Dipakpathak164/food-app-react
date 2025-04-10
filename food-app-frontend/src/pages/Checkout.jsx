import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TopSection from '../components/TopSection';
import toast from 'react-hot-toast';


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

        // For phone field: allow only digits and max 10
        if (name === 'phone') {
            if (!/^\d{0,10}$/.test(value)) return; // ignore non-digit or more than 10
        }

        if (name === 'zip') {
            if (!/^\d{0,6}$/.test(value)) return; // ignore non-digit or more than 10
        }

        if (isShipping) {
            setShippingData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if cart has items
        if (cart.length === 0) {
            toast.error("Your cart is empty. Please add items before placing the order.");
            navigate('/');
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to continue your order or sign up.");
            navigate('/signin');
            return;
        }


        console.log('Token found:', token); // Debugging line to ensure token is being retrieved

        const orderData = {
            billingDetails: formData,
            shippingDetails: shipToDifferent ? shippingData : formData,
            paymentMethod,
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount
        };

        try {
            // Send request with token in headers
            const res = await fetch('http://localhost:5000/api/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token in the Authorization header
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || 'Order placed successfully!');
                clearCart();
                navigate('/thank-you');
            } else {
                alert(data.message || 'Order failed');
            }
        } catch (err) {
            console.error(err);
            toast.error(data.message || 'Order failed. Please try again.');
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
                                        maxLength="10"
                                        pattern="\d{10}"
                                        inputMode="numeric"
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
                                        inputMode="numeric"
                                        value={formData.zip}
                                        maxLength="10"

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
