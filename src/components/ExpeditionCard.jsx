import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faStar,
  faRoute,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ExpeditionCard.css';

const ExpeditionCard = ({ expedition }) => {
  // Default placeholder if no expedition is provided
  const defaultExpedition = {
    id: 'placeholder',
    name: 'Cargando expedición...',
    description: 'Descripción no disponible',
    difficulty_level: 'Moderada',
    start_location: {
      name: 'Ubicación desconocida'
    },
    end_location: {
      name: 'Ubicación desconocida'
    },
    duration_days: 3,
    price_per_person: 200,
    currency_code: 'USD',
    average_rating: 0,
    total_reviews: 0,
    min_participants: 4,
    max_participants: 12,
    featured_image_url: 'https://via.placeholder.com/400x250?text=Expedición',
    is_available: true,
    upcoming_date: null,
    leader: {
      first_name: '',
      last_name: ''
    }
  };

  // Use provided expedition or default
  const {
    id,
    name,
    description,
    difficulty_level,
    start_location,
    end_location,
    duration_days,
    price_per_person,
    currency_code,
    average_rating,
    total_reviews,
    min_participants,
    max_participants,
    featured_image_url,
    is_available,
    upcoming_date,
    leader
  } = expedition || defaultExpedition;

  // Format price with currency symbol
  const formatPrice = (price, currency) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CLP: 'CLP $',
      ARS: 'ARS $',
      MXN: 'MXN $',
      COP: 'COP $',
      VES: 'Bs.',
      PEN: 'S/.',
      BRL: 'R$'
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${price}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Próximamente';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (err) {
      return 'Fecha inválida';
    }
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
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`expedition-card ${!is_available ? 'unavailable' : ''}`}>
      {!is_available && (
        <div className="expedition-unavailable-badge">
          No disponible
        </div>
      )}
      
      <div className="expedition-image">
        <img 
          src={featured_image_url} 
          alt={name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Expedición';
          }}
        />
        
        <div className="expedition-badges">
          <span className={`difficulty-badge ${getDifficultyClass(difficulty_level)}`}>
            {difficulty_level}
          </span>
          
          <span className="duration-badge">
            <FontAwesomeIcon icon={faCalendarAlt} /> {duration_days} días
          </span>
        </div>
      </div>
      
      <div className="expedition-content">
        <h3 className="expedition-title">{name}</h3>
        
        <div className="expedition-meta">
          <div className="expedition-location">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>{start_location.name}</span>
            {end_location.name !== start_location.name && (
              <>
                <FontAwesomeIcon icon={faRoute} className="route-icon" />
                <span>{end_location.name}</span>
              </>
            )}
          </div>
          
          <div className="expedition-participants">
            <FontAwesomeIcon icon={faUsers} />
            <span>{min_participants}-{max_participants} personas</span>
          </div>
        </div>
        
        <div className="expedition-rating">
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
        
        <p className="expedition-description">
          {truncateDescription(description)}
        </p>
        
        {leader && (leader.first_name || leader.last_name) && (
          <div className="expedition-guide">
            Dirigido por: <span>{`${leader.first_name} ${leader.last_name}`}</span>
          </div>
        )}
        
        <div className="expedition-footer">
          <div className="expedition-info">
            <div className="expedition-price">
              {formatPrice(price_per_person, currency_code)}
              <span className="price-per-person"> / persona</span>
            </div>
            
            {upcoming_date && (
              <div className="expedition-date">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{formatDate(upcoming_date)}</span>
              </div>
            )}
          </div>
          
          <Link to={`/expeditions/${id}`} className="expedition-details-btn">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpeditionCard;