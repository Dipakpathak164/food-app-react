
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SignupForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      toast.success(res.data.message || 'Registration successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='SignUpForm formBoxParents'>
       <div className="container">
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
            <div className="form-group">
              <input 
               type="password" 
               name="password" 
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
               className='form-control'
              />
            </div>
        </div>
        <div className="col-md-12">
          <button type="submit" className='btn'>Register</button>
        </div>
        </form>
       </div>
    </div>
  );
};

export default SignupForm;
