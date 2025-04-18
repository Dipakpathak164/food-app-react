// src/components/GetInTouch.jsx
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const GetInTouch = () => {
    const location = useLocation();  // Get the current location (route)

    // Check if the current path matches '/contact-us'
    const isActivePage = location.pathname === '/contact-us' ? 'activePage' : '';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const res = await axios.post('http://localhost:5000/api/contact', formData);
            toast.success(res.data.message || 'Message sent!');
            setFormData({ fullName: '', email: '', phone: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
        }

        setLoading(false);
    };


    return (
        <section className={`getInTouch position-relative ${isActivePage}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h3>Get In Touch</h3>
                        {status && <p className="text-info mt-2">{status}</p>}
                    </div>

                    <div className="col-md-6">
                        <form className="row formBox mx-0" onSubmit={handleSubmit}>
                            <div className="col-md-12 mb-3">
                                <label>Full Name <span className='text-danger'>*</span></label>
                                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Email <span className='text-danger'>*</span></label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Phone Number</label>
                                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Message <span className='text-danger'>*</span></label>
                                <textarea className="form-control" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                            </div>

                            <div className="col-md-12">
                                <button
                                    type="submit"
                                    className="btn unique-button w-100 d-flex justify-content-center align-items-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : 'Submit'}
                                </button>

                            </div>
                        </form>
                    </div>

                    <div className="col-md-6 d-flex align-items-center">
                        <img src="/assets/images/pexels-olly-789822.jpg" className="w-100" alt="Get in touch" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GetInTouch;
