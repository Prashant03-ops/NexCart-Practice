
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { apiRequest } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async (signal) => {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/products', {
        signal
      });

      if (!Array.isArray(data)) {
        throw new Error('Invalid product response from server.');
      }

      setProducts(data.slice(0, 4));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to load products.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal);

    return () => controller.abort();
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="eyebrow">
            THE FUTURE OF SHOPPING
          </span>

          <h1>
            Discover Something
            <span> Extraordinary.</span>
          </h1>

          <p>
            Explore a curated collection of products designed
            to elevate your everyday lifestyle.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              EXPLORE COLLECTION
            </Link>

            <Link to="/shop" className="secondary-button">
              DISCOVER MORE
            </Link>
          </div>
        </div>

        <div className="hero-bottom">
          <span>01 / PREMIUM COLLECTION</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section section-padding">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              HANDPICKED FOR YOU
            </span>

            <h2>
              Featured Products<span>.</span>
            </h2>
          </div>

          <Link to="/shop" className="text-link">
            VIEW ALL PRODUCTS ↗
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="product-message">
            <h3>Unable to load products</h3>
            <p>{error}</p>

            <button
              className="primary-button"
              onClick={() => fetchProducts()}
            >
              TRY AGAIN
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="product-message">
            <h3>No products available yet.</h3>
            <p>Please check back soon.</p>

            <Link to="/shop" className="primary-button">
              EXPLORE SHOP
            </Link>
          </div>
        )}
      </section>

      {/* PROMOTIONAL SECTION */}
      <section className="promo-banner">
        <div className="promo-content">
          <span className="eyebrow">
            A BETTER WAY TO SHOP
          </span>

          <h2>
            Shop smarter.
            <br />
            Live better.
          </h2>

          <p>
            Great products. Thoughtful choices.
            A shopping experience made for you.
          </p>

          <Link to="/shop" className="primary-button">
            START SHOPPING
          </Link>
        </div>

        <div className="promo-decoration">
          <div className="promo-circle"></div>
          <span>N</span>
        </div>
      </section>
    </main>
  );
}
