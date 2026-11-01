import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { apiRequest, formatPrice } from '../utils/api';
import Loader from '../components/Loader';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await apiRequest('/api/orders/myorders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className="page-shell">
      <section className="page-header">
        <span className="eyebrow">YOUR NEXCART ACCOUNT</span>
        <h1>My Profile<span>.</span></h1>
        <p>Manage your account and view your orders.</p>
      </section>

      {location.state?.orderSuccess && (
        <div className="success-message">
          Your order was placed successfully!
          {location.state.orderId && (
            <span> Order ID: {location.state.orderId}</span>
          )}
        </div>
      )}

      <section className="profile-layout">
        <aside className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <span className="role-label">
            {user.role || 'Customer'}
          </span>

          <button
            className="secondary-button profile-logout"
            onClick={handleLogout}
          >
            LOG OUT
          </button>
        </aside>

        <div className="orders-panel">
          <div className="orders-heading">
            <h2>My Orders</h2>
            <Link to="/shop">Continue Shopping ↗</Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : orders.length === 0 ? (
            <div className="product-message">
              <h3>No orders yet.</h3>
              <p>Your purchases will appear here.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order._id}>
                  <div className="order-card-heading">
                    <div>
                      <span className="eyebrow">ORDER ID</span>
                      <p>{order._id}</p>
                    </div>

                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-bottom">
                    <span>
                      {order.items?.length || 0} item(s)
                    </span>

                    <strong>
                      {formatPrice(order.totalAmount)}
                    </strong>
                  </div>

                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}