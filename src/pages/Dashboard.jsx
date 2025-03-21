import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHiking, faCompass, faMapMarkerAlt, faUsers,
  faCalendarAlt, faChartLine, faStar
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import UpcomingTrips from "../components/UpcomingTrips";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("explorer");
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    activities: 0,
    expeditions: 0,
    upcomingTrips: 0,
    locations: 0,
    guides: 0,
    explorers: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Get user data from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role_name?.toLowerCase() || "explorer");
        setUserName(decoded.username || "");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    // Simulate data loading
    setTimeout(() => {
      setStats({
        activities: 28,
        expeditions: 12,
        upcomingTrips: 3,
        locations: 16,
        guides: 8,
        explorers: 42,
        averageRating: 4.7
      });
      setLoading(false);
    }, 800);
  }, []);
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />
      
      {/* Main content */}
      <main className="dashboard-content">
        <Navbar />
        
        <div className="dashboard-main">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>¡Bienvenido, {userName || "Aventurero"}!</h1>
              <p>Explora el mundo con Outdoer, tu plataforma para aventuras al aire libre</p>
            </div>
            
            {userRole === "guide" && (
              <div className="action-btns">
                <Link to="/create-activity" className="btn btn-primary">
                  + Nueva Actividad
                </Link>
                <Link to="/create-expedition" className="btn btn-secondary">
                  + Nueva Expedición
                </Link>
              </div>
            )}
          </div>
          
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faHiking} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.activities}</h3>
                  <p>Actividades</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faCompass} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.expeditions}</h3>
                  <p>Expediciones</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.upcomingTrips}</h3>
                  <p>Próximos viajes</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.locations}</h3>
                  <p>Ubicaciones</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.guides}</h3>
                  <p>Guías</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="stat-content">
                  <h3>{loading ? "-" : stats.averageRating}</h3>
                  <p>Valoración media</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map and Upcoming Trips Section */}
          <div className="dashboard-dual-section">
            <div className="dashboard-map-section">
              <div className="section-header">
                <h2>Mapa de Actividades</h2>
                <Link to="/locations" className="text-link">Ver todas</Link>
              </div>
              <div className="map-container">
                <MapView />
              </div>
            </div>
            
            <div className="dashboard-upcoming-section">
              <div className="section-header">
                <h2>Próximos Viajes</h2>
                <Link to="/mytrips" className="text-link">Ver todos</Link>
              </div>
              <UpcomingTrips />
            </div>
          </div>
          
          {/* Featured Activities Section */}
          <div className="featured-section">
            <div className="section-header">
              <h2>Actividades Destacadas</h2>
              <Link to="/activities" className="text-link">Ver todas</Link>
            </div>
            
            <div className="activities-grid">
              {loading ? (
                <div className="loading-message">Cargando actividades...</div>
              ) : (
                Array(3).fill(0).map((_, i) => (
                  <div className="activity-card" key={i}>
                    <div className="activity-image">
                      <img src={`https://source.unsplash.com/300x200/?adventure,${i}`} alt="Activity" />
                      <span className="activity-category">Trekking</span>
                    </div>
                    <div className="activity-content">
                      <h3>Aventura en Torres del Paine</h3>
                      <div className="activity-details">
                        <span className="detail"><FontAwesomeIcon icon={faMapMarkerAlt} /> Patagonia, Chile</span>
                        <span className="detail"><FontAwesomeIcon icon={faCalendarAlt} /> 8 horas</span>
                        <span className="detail"><FontAwesomeIcon icon={faStar} /> 4.8 (24 reseñas)</span>
                      </div>
                      <p className="activity-description">
                        Explora las majestuosas torres de granito en uno de los parques nacionales más impresionantes de Sudamérica.
                      </p>
                      <div className="activity-footer">
                        <span className="activity-price">$75 USD</span>
                        <Link to={`/activities/${i}`} className="btn btn-outline">Ver detalles</Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;