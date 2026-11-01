
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { apiRequest, formatPrice } from '../utils/api';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadDashboard();
  }, [user, navigate]);

  // Load products and analytics independently
  const loadDashboard = async () => {
    setError('');

    try {
      const productData = await apiRequest('/api/products');

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.products || []
      );
    } catch (err) {
      setError(`Products: ${err.message}`);
    }

    try {
      const statsData = await apiRequest('/api/analytics');
      setStats(statsData);
    } catch (err) {
      setError((previous) =>
        previous
          ? `${previous} | Analytics: ${err.message}`
          : `Analytics: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: files ? files[0] : value
    }));
  };

  // Reset product form
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null
    });

    const fileInput = document.getElementById('product-image');

    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      await apiRequest('/api/products', {
        method: 'POST',
        body: formData
      });

      resetForm();

      setMessage('Product created successfully!');

      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE'
      });

      setMessage('Product deleted successfully!');

      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    }
  };

  // Wait while checking authentication
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <main className="page-shell">

      {/* Dashboard Header */}
      <section className="page-header">
        <span className="eyebrow">
          STORE MANAGEMENT
        </span>

        <h1>
          Admin Dashboard<span>.</span>
        </h1>

        <p>
          Manage your NexCart store, products and orders.
        </p>
      </section>

      {/* Messages */}
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>

          {/* Dashboard Statistics */}
          <section className="admin-stats">

            <div className="admin-stat">
              <span>Total Products</span>
              <strong>
                {stats?.totalProducts ?? products.length}
              </strong>
            </div>

            <div className="admin-stat">
              <span>Total Orders</span>
              <strong>
                {stats?.totalOrders ?? 0}
              </strong>
            </div>

            <div className="admin-stat">
              <span>Total Users</span>
              <strong>
                {stats?.totalUsers ?? 0}
              </strong>
            </div>

            <div className="admin-stat">
              <span>Total Revenue</span>
              <strong>
                {formatPrice(stats?.totalRevenue ?? 0)}
              </strong>
            </div>

          </section>

          {/* Add Product */}
          <section className="admin-section">

            <h2>Add New Product</h2>

            <form
              className="admin-form"
              onSubmit={handleCreateProduct}
            >

              <div className="form-group">
                <label htmlFor="product-name">
                  Product Name
                </label>

                <input
                  id="product-name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-description">
                  Description
                </label>

                <textarea
                  id="product-description"
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="product-price">
                    Price (INR)
                  </label>

                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-stock">
                    Stock
                  </label>

                  <input
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="Enter stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="product-category">
                  Category
                </label>

                <input
                  id="product-category"
                  name="category"
                  type="text"
                  placeholder="Example: Electronics"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-image">
                  Product Image
                </label>

                <input
                  id="product-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'ADDING PRODUCT...'
                  : 'ADD PRODUCT'}
              </button>

            </form>
          </section>

          {/* Product Management */}
          <section className="admin-section">

            <h2>Manage Products</h2>

            {products.length === 0 ? (
              <div className="product-message">
                <h3>No products found.</h3>
                <p>Add your first product using the form above.</p>
              </div>
            ) : (
              <div className="admin-product-list">

                {products.map((product) => (
                  <article
                    className="admin-product"
                    key={product._id}
                  >

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                    />

                    <div className="admin-product-info">
                      <h3>{product.name}</h3>

                      <p>
                        {formatPrice(product.price)}
                      </p>

                      <small>
                        Category: {product.category}
                      </small>

                      <br />

                      <small>
                        Stock: {product.stock}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>

                  </article>
                ))}

              </div>
            )}

          </section>

        </>
      )}

      {/* Back to Store */}
      <Link to="/shop" className="back-link">
        ← Back to Store
      </Link>

    </main>
  );
}
