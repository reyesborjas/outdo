import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faSearch,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get user data from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: decoded.user_id,
          name: decoded.username || "Usuario",
          role: decoded.role_name,
          avatar: decoded.avatar || "https://via.placeholder.com/40"
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Mock notification data
  useEffect(() => {
    // In a real app, this would be from an API
    setNotifications([
      {
        id: 1,
        type: "message",
        content: "Nuevo mensaje de Juan Pérez",
        time: "Hace 5 minutos",
        read: false
      },
      {
        id: 2,
        type: "booking",
        content: "Reserva confirmada para 'Trekking Torres del Paine'",
        time: "Hace 1 hora",
        read: false
      },
      {
        id: 3,
        type: "system",
        content: "Actualización del sistema completada",
        time: "Hace 2 días",
        read: true
      }
    ]);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="navbar">
      <div className="navbar-search">
        <form onSubmit={handleSearch}>
          <div className="search-input">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>
      </div>

      <div className="navbar-actions">
        <div className="navbar-item">
          <Link to="/messages" className="icon-button">
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="badge">3</span>
          </Link>
        </div>

        <div className="navbar-item notifications-dropdown">
          <button className="icon-button" onClick={toggleNotifications}>
            <FontAwesomeIcon icon={faBell} />
            <span className="badge">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <h4>Notificaciones</h4>
                <button className="text-button">Marcar todas como leídas</button>
              </div>

              <div className="dropdown-content">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? "unread" : ""}`}
                    >
                      <div className="notification-content">
                        {notification.content}
                      </div>
                      <div className="notification-time">
                        {notification.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    No tienes notificaciones
                  </div>
                )}
              </div>

              <div className="dropdown-footer">
                <Link to="/notifications">Ver todas</Link>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-item user-dropdown">
          <div className="user-info">
            {user && (
              <>
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </>
            )}
            <Link to="/profile" className="user-avatar">
              <img 
                src={user?.avatar || "https://via.placeholder.com/40"} 
                alt="Avatar"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;