import { useEffect, useState } from 'react';
import axios from 'axios';
import TopSection from '../components/TopSection';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/place-order/user/${user.id}`)
      .then(res => {
        console.log("📦 Orders fetched:", res.data);
        setOrders(res.data);
      })
      .catch(err => console.error('❌ Failed to fetch user orders:', err));
  }, [user]);

  // ✅ Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <>
      <TopSection title="Check Your Order" subtitle="We guarantee delivery that arrives within an hour" />
      <section className='pt-5 commonColor'>
        <div className="container bg-white p-4">
          <div className="row">
            <div className="col-md-12">
              <h2>Your Orders</h2>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <ul>
                  {orders.map(order => (
                    <li key={order.id} className="mb-3">
                      <strong>Order ID:</strong> {order.id} |
                      <strong> Amount:</strong> ₹{order.total_amount} |
                      <strong> Status:</strong> {order.status} |
                      <strong> Placed on:</strong> {formatDate(order.created_at)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserOrders;
