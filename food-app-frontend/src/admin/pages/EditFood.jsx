import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MdEdit } from 'react-icons/md'; // Edit icon

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [priceError, setPriceError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountedPrice: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/foods/${id}`)
        .then((res) => {
          const data = res.data;
          setFood(data);
          setFormData({
            name: data.name || '',
            price: data.price || '',
            discountedPrice: data.discounted_price || '',
            description: data.description || '',
            image: null,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching food:", err);
          toast.error('Failed to fetch food data');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === 'discountedPrice' || name === 'price') {
      setPriceError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { price, discountedPrice } = formData;

    const priceNum = parseFloat(price);
    const discountedNum = parseFloat(discountedPrice);

    if (
      discountedPrice &&
      (!priceNum || !discountedNum || discountedNum >= priceNum)
    ) {
      setPriceError('Discounted price must be less than the actual price');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Updating food...');

    const updatedData = new FormData();
    updatedData.append('name', formData.name);
    updatedData.append('price', formData.price);
    updatedData.append('discountedPrice', formData.discountedPrice);
    updatedData.append('description', formData.description);
    if (formData.image) {
      updatedData.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/api/foods/${id}`, updatedData);
      toast.success('Food updated successfully!', { id: toastId });

      // Simulate delay for UX smoothness
      setTimeout(() => {
        navigate('/admin/foods');
      }, 1000);
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update food', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!food) return <p>Food not found</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Food</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹) *</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Discounted Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
          />
          {priceError && <div className="text-danger mt-1">{priceError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image </label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          {food.image && (
            <div className="mt-2">
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt={food.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary px-4"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Updating...
            </>
          ) : (
            <>
              <MdEdit className="me-2" />
              Update Food
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditFood;
