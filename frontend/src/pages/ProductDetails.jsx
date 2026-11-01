import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../redux/cartSlice';
import { apiRequest, formatPrice } from '../utils/api';
import Loader from '../components/Loader';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !product) {
    return (
      <main className="page-shell">
        <div className="product-message">
          <h2>Product not found</h2>
          <p>{error || 'This product may have been removed.'}</p>
          <Link to="/shop" className="primary-button">
            BACK TO SHOP
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{' '}
        {product.name}
      </div>

      <section className="product-details">
        <div className="details-image">
          <img
            src={product.imageUrl}
            alt={product.name}
          />
        </div>

        <div className="details-content">
          <span className="eyebrow">
            {product.category || 'NEXCART COLLECTION'}
          </span>

          <h1>{product.name}</h1>

          <h2 className="details-price">
            {formatPrice(product.price)}
          </h2>

          <p className="details-description">
            {product.description || 'Discover quality and style with NexCart.'}
          </p>

          <p className="stock-status">
            {product.stock > 0
              ? `${product.stock} items available`
              : 'Currently out of stock'}
          </p>

          <button
            className="primary-button"
            disabled={product.stock === 0}
            onClick={() => dispatch(addToCart(product))}
          >
            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>

          <Link to="/shop" className="back-link">
            ← Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}