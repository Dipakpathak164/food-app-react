import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';

const FoodLists = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/foods');
      setFoods(res.data); // Make sure your backend sends an array of food objects
    } catch (error) {
      console.error('❌ Error fetching foods:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`);
      setFoods((prev) => prev.filter((food) => food.id !== id));
    } catch (error) {
      console.error('❌ Error deleting food:', error);
    }
  };

  return (
    <div className="container mt-4">
      <Breadcrumbs />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Food List</h3>
        <Link to="/admin/add-food-items" className="btn btn-success">Add New Food</Link>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Discounted Price (₹)</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No foods added yet.</td>
            </tr>
          ) : (
            foods.map((food, index) => (
              <tr key={food.id}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td>{food.price}</td>
                <td>{food.discounted_price || '-'}</td>
                <td>{food.description}</td>
                <td>
                  {food.image && (
                    <img
                      src={`http://localhost:5000/uploads/${food.image}`}
                      alt={food.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>
                  <Link to={`/admin/edit-food/${food.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FoodLists;
