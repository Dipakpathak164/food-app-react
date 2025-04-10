
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const SignupForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            // Simulate a 1-second delay before making the API call (if needed)
            await new Promise((resolve) => setTimeout(resolve, 1000));
    
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            const { token, user } = res.data;
    
            if (token && user) {
                // Store the token and user data in localStorage (or sessionStorage if preferred)
                localStorage.setItem('token', token);  // Store token
                localStorage.setItem('user', JSON.stringify(user));  // Store user data (optional)
    
                // Call the login function if necessary
                login(token, user);
    
                toast.success('Thanks for signing up!');
                navigate('/');  // Redirect to homepage or dashboard
            } else {
                toast.error('Signup succeeded, but missing token or user data');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed!');
        } finally {
            setIsSubmitting(false);
        }
    };
    





    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='SignUpForm formBoxParents'>
            <div className="w-100">
                <form onSubmit={handleSubmit} className='row'>
                    <div className="col-md-12">
                        <h1>Sign Up</h1>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className='form-control'
                            />
                            <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                                style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                    </div>
                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn unique-button w-100 d-flex justify-content-center align-items-center gap-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Signing Up ...
                                </>
                            ) : 'Sign Up'}
                        </button>


                    </div>
                    <div className="col-md-12 text-center mt-3">
                        <p className='bottomTexts'>Already have an Account ?  <Link to="/signin" className="text-primary fw-bold">
                            Sign In
                        </Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
