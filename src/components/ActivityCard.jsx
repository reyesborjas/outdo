import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faClock,
  faUsers,
  faStar,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ActivityCard.css';

const ActivityCard = ({ activity }) => {
  // Default placeholder if no activity is provided
  const defaultActivity = {
    id: 'placeholder',
    name: 'Cargando actividad...',
    description: 'Descripción no disponible',
    difficulty_level: 'Moderada',
    location: {
      name: 'Ubicación desconocida'
    },
    duration_hours: 4,
    price_per_person: 50,
    currency_code: 'USD',
    average_rating: 0,
    total_reviews: 0,
    category: {
      name: 'Actividad'
    },
    min_participants: 1,
    max_participants: 10,
    featured_image_url: 'https://via.placeholder.com/400x250?text=Actividad',
    is_available: true
  };

  // Use provided activity or default
  const {
    id,
    name,
    description,
    difficulty_level,
    location,
    duration_hours,
    price_per_person,
    currency_code,
    average_rating,
    total_reviews,
    category,
    min_participants,
    max_participants,
    featured_image_url,
    is_available
  } = activity || defaultActivity;

  // Format price with currency symbol
  const formatPrice = (price, currency) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CLP: 'CLP' ,
      ARS: 'ARS' ,
      MXN: 'MXN' ,
      COP: 'COP' ,
      VES: 'Bs.',
      PEN: 'S/.',
      BRL: 'R'
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${price}`;
  };

  // Get difficulty level badge class
  const getDifficultyClass = (level) => {
    const levelMap = {
      'Fácil': 'difficulty-easy',
      'Moderada': 'difficulty-moderate',
      'Difícil': 'difficulty-hard',
      'Extrema': 'difficulty-extreme'
    };
    return levelMap[level] || 'difficulty-moderate';
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`activity-card ${!is_available ? 'unavailable' : ''}`}>
      {!is_available && (
        <div className="activity-unavailable-badge">
          No disponible
        </div>
      )}
      
      <div className="activity-image">
        <img 
          src={featured_image_url} 
          alt={name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Actividad';
          }}
        />
        
        <div className="activity-badges">
          <span className={`difficulty-badge ${getDifficultyClass(difficulty_level)}`}>
            {difficulty_level}
          </span>
          
          <span className="category-badge">
            <FontAwesomeIcon icon={faTag} /> {category.name}
          </span>
        </div>
      </div>
      
      <div className="activity-content">
        <h3 className="activity-title">{name}</h3>
        
        <div className="activity-meta">
          <div className="activity-location">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>{location.name}</span>
          </div>
          
          <div className="activity-duration">
            <FontAwesomeIcon icon={faClock} />
            <span>{duration_hours} horas</span>
          </div>
          
          <div className="activity-participants">
            <FontAwesomeIcon icon={faUsers} />
            <span>{min_participants}-{max_participants} personas</span>
          </div>
        </div>
        
        <div className="activity-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon 
                key={star}
                icon={faStar}
                className={star <= Math.round(average_rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="rating-count">
            {average_rating ? average_rating.toFixed(1) : 'N/A'} 
            {total_reviews > 0 ? ` (${total_reviews} reseñas)` : ''}
          </span>
        </div>
        
        <p className="activity-description">
          {truncateDescription(description)}
        </p>
        
        <div className="activity-footer">
          <div className="activity-price">
            {formatPrice(price_per_person, currency_code)}
            <span className="price-per-person"> / persona</span>
          </div>
          
          <Link to={`/activities/${id}`} className="activity-details-btn">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;