import React, { useState, useEffect } from 'react';

const OrdersWithCustomers = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/orders-with-customers');
        const data = await res.json();
        console.log('Fetched Orders:', data);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });
      const result = await res.json();
      console.log('Marked as delivered:', result);
      // Refresh orders
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, status: 'delivered' } : order
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const result = await res.json();
      console.log('Cancelled order:', result);
      // Refresh orders
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  return (
    <div className="container">
      <h2>Orders with Customer Details</h2>
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th className='th_sm'>Order ID</th>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Phone</th>
              <th>Delivery Address</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th className='sticky-col text-center bg-warning'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_email}</td>
                <td>{order.customer_phone}</td>
                <td>{order.delivery_address}</td>
                <td>
                  <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>₹{order.total_amount}</td>
                <td className='sticky-col text-center'>
                  {order.status !== 'delivered' && (
                    <button className="btn btn-sm btn-success me-1" onClick={() => markAsDelivered(order.order_id)}>
                      Mark as Delivered
                    </button>
                  )}
                  {order.status !== 'cancelled' && (
                    <button className="btn btn-sm btn-danger" onClick={() => cancelOrder(order.order_id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OrdersWithCustomers;
