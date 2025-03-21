import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faHiking,
  faCompass,
  faUsers,
  faUser,
  faMap,
  faBook,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
  faCloudSun
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar.css";
import logo from "../assets/logo.svg";

const Sidebar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Santiago");

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = "your-openweather-api-key"; // Replace with your API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
        );

        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [city]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? "show" : ""}`} 
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar content */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="Outdoer" />
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faHome} />
                <span>Dashboard</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/activities") ? "active" : ""}>
              <Link to="/activities">
                <FontAwesomeIcon icon={faHiking} />
                <span>Actividades</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/expeditions") ? "active" : ""}>
              <Link to="/expeditions">
                <FontAwesomeIcon icon={faCompass} />
                <span>Expediciones</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/guides") ? "active" : ""}>
              <Link to="/guides">
                <FontAwesomeIcon icon={faUsers} />
                <span>Guías</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/explorers") ? "active" : ""}>
              <Link to="/explorers">
                <FontAwesomeIcon icon={faUser} />
                <span>Exploradores</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/locations") ? "active" : ""}>
              <Link to="/locations">
                <FontAwesomeIcon icon={faMap} />
                <span>Ubicaciones</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes("/resources") ? "active" : ""}>
              <Link to="/resources">
                <FontAwesomeIcon icon={faBook} />
                <span>Recursos</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Guide/Explorer-specific options */}
        {userRole === "guide" && (
          <div className="action-buttons">
            <Link to="/create-activity" className="btn btn-primary">
              + Nueva Actividad
            </Link>
            <Link to="/create-expedition" className="btn btn-secondary">
              + Nueva Expedición
            </Link>
          </div>
        )}

        {/* Weather widget */}
        <div className="weather-widget">
          <div className="weather-icon">
            <FontAwesomeIcon icon={faCloudSun} />
          </div>
          {weather && (
            <div className="weather-info">
              <div className="weather-location">{weather.name}</div>
              <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-desc">
                {weather.weather[0].description}
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="sidebar-footer">
          <Link to="/settings" className="sidebar-footer-icon">
            <FontAwesomeIcon icon={faCog} />
          </Link>
          <button onClick={handleLogout} className="sidebar-footer-icon">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;