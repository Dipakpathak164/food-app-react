import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignInForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
      console.log("🧪 Login Response:", res.data);
  
      const { token, user } = res.data;
  
      if (token && user) {
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
  
        // ✅ Role-based redirect
        if (user.role === 'superadmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast.error('Login succeeded, but missing token or user data');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="SignUpForm formBoxParents">
      <div className='w-100'>
        <form onSubmit={handleSubmit} className='row'>
          <div className="col-md-12"><h1>Sign In</h1></div>
          <div className="col-md-12">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>
          <div className="col-md-12">
            <button
              type="submit"
              className="btn unique-button w-100 d-flex justify-content-center align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </div>
          <div className="col-md-12 text-center mt-3">
            <p className='bottomTexts'>Don't have an Account ?  <Link to="/signup" className="text-primary fw-bold">
              Create one
            </Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
