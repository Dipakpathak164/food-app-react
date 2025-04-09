import { useState } from 'react';
import { useCart } from '../context/CartContext';
import TopSection from '../components/TopSection';

const Checkout = () => {
    const { cart } = useCart();
    const [shipToDifferent, setShipToDifferent] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const countries = ['India', 'United States', 'Canada', 'United Kingdom', 'Australia'];

    return (
        <>
            <TopSection
                title="Check Your Order"
                subtitle="We guarantee delivery that arrives within an hour"
            />
            <section className='second-bg-white cartViewSection'>
                <div className="container p-5">
                    <h2 className="mb-4">Checkout</h2>

                    <form>
                        {/* Billing Details */}
                        <h5 className="mb-3">Billing Details</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label>Email *</label>
                                <input type="email" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label>Phone *</label>
                                <input type="tel" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label>Full Name *</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label>Country *</label>
                                <select className="form-select" required>
                                    {countries.map((country, i) => (
                                        <option key={i}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label>State *</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label>Town / City *</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label>ZIP *</label>
                                <input type="text" className="form-control" required />
                            </div>
                            <div className="col-12">
                                <label>Street Address *</label>
                                <input type="text" className="form-control" required />
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
                                    <div className="col-md-6">
                                        <label>Full Name *</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Country *</label>
                                        <select className="form-select" required>
                                            {countries.map((country, i) => (
                                                <option key={i}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>State / Province *</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Town / City *</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label>ZIP / Postal Code *</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-12">
                                        <label>Street Address *</label>
                                        <input type="text" className="form-control" required />
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
