import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faMapMarkerAlt,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/UpcomingTrips.css';

const UpcomingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      return 'Fecha inválida';
    }
  };

  // Get user data from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.user_id);
        setUserRole(decoded.role_name?.toLowerCase() || 'explorer');
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error de autenticación");
      }
    }
  }, []);

  // Fetch upcoming trips
  useEffect(() => {
    if (!userId) return;

    // Simulate API call
    setLoading(true);
    
    // In a real app, replace with actual API call
    setTimeout(() => {
      // Sample data - in a real app, this would come from your API
      const mockTrips = [
        {
          id: 1,
          name: 'Trekking Torres del Paine',
          start_date: '2025-04-10',
          status: 'confirmado',
          type: 'expedition',
          location: 'Patagonia, Chile',
          guide: 'María González',
          participants: 8,
          max_participants: 12
        },
        {
          id: 2,
          name: 'Sandboard San Pedro',
          start_date: '2025-05-15',
          status: 'pendiente',
          type: 'activity',
          location: 'San Pedro de Atacama, Chile',
          guide: 'Carlos Rodriguez',
          participants: 4,
          max_participants: 8
        },
        {
          id: 3,
          name: 'Rafting Río Barinas',
          start_date: '2025-06-22',
          status: 'confirmado',
          type: 'activity',
          location: 'Barinas, Venezuela',
          guide: 'Pedro Pérez',
          participants: 6,
          max_participants: 10
        }
      ];

      setTrips(mockTrips);
      setLoading(false);
    }, 800);
  }, [userId]);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'confirmado': 'status-confirmed',
      'pendiente': 'status-pending',
      'cancelado': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  return (
    <div className="upcoming-trips-component">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tus próximos viajes...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>{error}</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <p>No tienes viajes programados.</p>
          <Link to="/trips" className="btn btn-primary">Explorar viajes</Link>
        </div>
      ) : (
        <div className="trip-list">
          {trips.map(trip => (
            <div key={trip.id} className="trip-card">
              <div className="trip-header">
                <h3>{trip.name}</h3>
                <span className={`status-badge ${getStatusBadgeClass(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
              
              <div className="trip-details">
                <div className="trip-detail">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{formatDate(trip.start_date)}</span>
                </div>
                
                <div className="trip-detail">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{trip.location}</span>
                </div>
                
                <div className="trip-detail">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{trip.participants}/{trip.max_participants} participantes</span>
                </div>
              </div>
              
              <div className="trip-footer">
                <Link 
                  to={`/${trip.type}s/${trip.id}`} 
                  className="btn btn-outline"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTrips;