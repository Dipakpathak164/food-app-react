import React, { useEffect, useState } from 'react';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/customers') // Adjust to your backend route
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Failed to fetch customers:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Customers</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered On</th>
              <th>Total Orders</th>
              <th className='sticky-col text-center bg-warning'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>{user.total_orders}</td>
                  <td  className='sticky-col text-center'>
                    {/* You can link to order history, delete, or more */}
                    <button className="btn btn-primary btn-sm me-2">View</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTable;
