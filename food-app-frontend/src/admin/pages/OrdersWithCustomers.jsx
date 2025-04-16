import React, { useState, useEffect } from 'react';

const OrdersWithCustomers = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = async () => {
    const res = await fetch('http://localhost:5000/api/admin/orders-with-customers');
    const data = await res.json();
    console.log('Fetched Orders:', data); // ⬅️ Debug log
    setOrders(data);
  };

  fetchOrders();
}, []);


  return (
    <div className="container">
      <h2>Orders with Customer Details</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Order Date</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.customer_email}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersWithCustomers;
