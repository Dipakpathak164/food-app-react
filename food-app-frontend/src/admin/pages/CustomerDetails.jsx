import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/customers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Customer not found');
        return res.json();
      })
      .then((data) => {
        setCustomer(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!customer) return <div className="container mt-4 text-danger">Customer not found.</div>;

  return (
    <div className="container mt-4">
      <h2>Customer Details</h2>
      <div className="card p-4 mt-3">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Registered On:</strong> {new Date(customer.created_at).toLocaleDateString()}</p>
        <p><strong>Total Orders:</strong> {customer.total_orders}</p>
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        ← Back to Customers
      </button>
    </div>
  );
};

export default CustomerDetails;
