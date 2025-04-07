import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const AddFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountedPrice: '',
    description: '',
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceError, setPriceError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user is updating prices, clear the error first
    if (name === 'price' || name === 'discountedPrice') {
      setPriceError('');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { price, discountedPrice } = formData;

    // Convert string to number
    const priceNum = parseFloat(price);
    const discountedNum = parseFloat(discountedPrice);

    // ✅ Price validation
    if (
      discountedPrice &&
      (!priceNum || !discountedNum || discountedNum >= priceNum)
    ) {
      setPriceError('Discounted price must be less than the actual price');
      return;
    }

    setIsSubmitting(true);

    try {
      const foodForm = new FormData();
      foodForm.append('name', formData.name);
      foodForm.append('price', formData.price);
      foodForm.append('discountedPrice', formData.discountedPrice);
      foodForm.append('description', formData.description);
      foodForm.append('image', formData.image);

      const res = await axios.post('http://localhost:5000/api/foods', foodForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Food added successfully!');
      console.log('Food added:', res.data);

      // Reset form
      setFormData({ name: '', price: '', discountedPrice: '', description: '', image: null });
      setPreview(null);

      // 🔁 Redirect after short delay
      setTimeout(() => navigate('/admin/foods'), 1000);
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Breadcrumbs />
    <div className="container mt-4 inner_div p-3">
      <h2>Add New Food</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Food Name <span className='text-danger'>*</span></label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹) <span className='text-danger'>*</span></label>
          <input
            type="number"
            name="price"
            className={`form-control ${priceError ? 'is-invalid' : ''}`}
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Discounted Price (₹)</label>
          <input
            type="number"
            name="discountedPrice"
            className={`form-control ${priceError ? 'is-invalid' : ''}`}
            value={formData.discountedPrice}
            onChange={handleChange}
          />
          {priceError && <div className="invalid-feedback">{priceError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description <span className='text-danger'>*</span></label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image <span className='text-danger'>*</span></label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
          </div>
        )}

        <div className="text-center">
        <button type="submit" className="btn btn-outline-primary px-4" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Food'}
        </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AddFood;
