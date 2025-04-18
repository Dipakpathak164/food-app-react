import React, { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal'; // Make sure path is correct
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error('Failed to fetch customers:', err));
  }, []);

  const openConfirmModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;

    fetch(`http://localhost:5000/api/admin/customers/${deleteId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setCustomers(customers.filter((user) => user.id !== deleteId));
        toast.success('Customer deleted successfully');
      })
      .catch((err) => {
        console.error('Delete failed:', err);
        toast.error('Failed to delete customer');
      })
      .finally(() => {
        setShowModal(false);
        setDeleteId(null);
      });
  };

  const handleView = (id) => {
    navigate(`/admin/customers/${id}`);
  };

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
              <th className="sticky-col text-center bg-warning">Actions</th>
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
                  <td className="sticky-col text-center">
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleView(user.id)}>
                      <i className='bi bi-eye me-1' ></i>
                      View</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openConfirmModal(user.id)}
                    >
                      <i className='bi bi-trash me-1' ></i> Delete
                    </button>
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

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onConfirm={handleDelete}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default CustomersTable;
