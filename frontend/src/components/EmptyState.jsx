import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'Explore our collection and find something you love.',
  buttonText = 'Explore Products',
  buttonLink = '/shop'
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">✦</div>

      <h2>{title}</h2>

      <p>{message}</p>

      <Link to={buttonLink} className="primary-button">
        {buttonText}
      </Link>
    </div>
  );
}