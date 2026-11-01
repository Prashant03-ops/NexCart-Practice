import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { formatPrice } from '../utils/api';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <article className="product-card">
      <Link
        to={`/products/${product._id}`}
        className="product-image-wrap"
      >
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        <span className="product-view">VIEW PRODUCT</span>
      </Link>

      <div className="product-info">
        <div>
          <p className="product-category">
            {product.category || 'Featured'}
          </p>

          <Link
            to={`/products/${product._id}`}
            className="product-name"
          >
            {product.name}
          </Link>
        </div>

        <div className="product-card-bottom">
          <span className="product-price">
            {formatPrice(product.price)}
          </span>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sold Out' : 'Add +'}
          </button>
        </div>
      </div>
    </article>
  );
}

