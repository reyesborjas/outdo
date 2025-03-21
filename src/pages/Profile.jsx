import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faMapMarkerAlt,
  faStar,
  faCalendarAlt,
  faCheck,
  faHiking,
  faRoute,
  faShieldAlt,
  faUser,
  faMedal,
  faChartLine,
  faExclamationTriangle,
  faEnvelope,
  faBookmark,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../utils/auth';
import { guideService, explorerService } from '../utils/api';
import '../styles/Profile.css';

const Profile = () => {
  const { id } = useParams(); // Si se pasa un ID en la URL
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('explorer');
  
  // Datos para mostrar en perfil
  const [activities, setActivities] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener el usuario actual
        const currentUser = getCurrentUser();
        setCurrentUserRole(currentUser?.role || 'explorer');
        
        // Determinar qué ID usar: el de la URL o el del usuario actual
        const userId = id || currentUser?.id;
        
        // Verificar si es el perfil del usuario actual
        setIsCurrentUser(!id || id === currentUser?.id);
        
        // Fetch del perfil completo
        if (currentUser?.role === 'guide' || (id && await checkIfUserIsGuide(id))) {
          // Obtener perfil del guía
          const guideData = await fetchSampleGuideData(userId);
          setUser(guideData);
          
          // Obtener datos relacionados con guías
          setActivities(guideData.activities || []);
          setExpeditions(guideData.expeditions || []);
          setReviews(guideData.reviews || []);
          setCertifications(guideData.certifications || []);
          setStats({
            activitiesLed: guideData.total_activities_led || 0,
            expeditionsLed: guideData.total_expeditions_led || 0,
            totalReviews: guideData.total_reviews || 0,
            averageRating: guideData.average_rating || 0
          });
        } else {
          // Obtener perfil del explorador
          const explorerData = await fetchSampleExplorerData(userId);
          setUser(explorerData);
          
          // Obtener datos relacionados con exploradores
          setActivities(explorerData.completedActivities || []);
          setExpeditions(explorerData.completedExpeditions || []);
          setReviews(explorerData.reviews || []);
          setBookings(explorerData.bookings || []);
          setStats({
            activitiesCompleted: explorerData.activities_count || 0,
            expeditionsCompleted: explorerData.expeditions_count || 0,
            points: explorerData.points || 0,
            reviewsCount: explorerData.reviews_count || 0
          });
        }
      } catch (err) {
        console.error('Error al cargar datos del perfil:', err);
        setError('Hubo un problema al cargar la información del perfil.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id]);
  
  // Función para verificar si un usuario es guía (simulada)
  const checkIfUserIsGuide = async (userId) => {
    // En un entorno real, esto sería una llamada a la API
    return new Promise(resolve => {
      setTimeout(() => {
        // Para la simulación, asumimos que los IDs 1-10 son guías
        resolve(parseInt(userId) >= 1 && parseInt(userId) <= 10);
      }, 300);
    });
  };
  
  // Función para obtener datos de guía (simulada)
  const fetchSampleGuideData = async (guideId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: guideId || '1',
          firstName: 'Miguel',
          lastName: 'Sánchez',
          name: 'Miguel Sánchez',
          email: 'miguel.sanchez@outdoer.com',
          profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          coverImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
          guide_type: 'Master Guide',
          years_of_experience: 12,
          location: {
            id: 1,
            name: 'Torres del Paine, Chile'
          },
          country: 'Chile',
          phone: '+56 9 1234 5678',
          languages: ['Español', 'Inglés', 'Portugués'],
          available_for_hire: true,
          skills: [
            { name: 'Trekking', proficiency_level: 5 },
            { name: 'Montañismo', proficiency_level: 5 },
            { name: 'Supervivencia', proficiency_level: 4 },
            { name: 'Primeros Auxilios', proficiency_level: 5 },
            { name: 'Fotografía', proficiency_level: 3 }
          ],
          certifications: [
            { name: 'Guía de Montaña UIAGM', issuing_organization: 'UIAGM', issue_date: '2015-05-12', document_url: '#' },
            { name: 'Wilderness First Responder', issuing_organization: 'NOLS', issue_date: '2018-03-22', document_url: '#' },
            { name: 'Guía de Trekking', issuing_organization: 'SERNATUR', issue_date: '2010-08-15', document_url: '#' }
          ],
          average_rating: 4.9,
          total_reviews: 47,
          total_activities_led: 215,
          total_expeditions_led: 32,
          bio_extended: 'Guía de montaña profesional con más de 12 años de experiencia. Especialista en la Patagonia chilena y argentina. He liderado expediciones a Torres del Paine, Monte Fitz Roy y Cerro Torre, entre otros. Mi objetivo es brindar una experiencia segura, educativa y memorable para los amantes de la naturaleza.',
          activities: [
            { id: 1, name: 'Trekking Torres del Paine', type: 'Trekking', rating: 4.9, reviews_count: 28, featured_image_url: 'https://patagoniatours.cl/wp-content/uploads/2014/02/tour-trekking-base-torres-del-paine2.jpg', next_date: '2025-04-15' },
            { id: 2, name: 'Ascenso al Cerro Torre', type: 'Montañismo', rating: 4.8, reviews_count: 15, featured_image_url: 'https://media.istockphoto.com/id/1299687874/photo/cerro-torre-mountain-los-glaciares-national-park-patagonia-argentina.jpg?s=612x612&w=0&k=20&c=xOg1LvWYv9RgBOODTEfBhNwMkXhMGCEcGSVrknQkL3A=', next_date: '2025-05-20' },
            { id: 3, name: 'Valle del Francés', type: 'Trekking', rating: 4.7, reviews_count: 22, featured_image_url: 'https://media.istockphoto.com/id/1337588776/photo/cuernos-del-paine-french-valley-torres-del-paine-national-park-patagonia-chile.jpg?s=612x612&w=0&k=20&c=5-t0OBBt0AeYmcdKCeHVCUUBhRfbROhkY4-P8EsVuN4=', next_date: '2025-03-12' }
          ],
          expeditions: [
            { id: 1, name: 'Circuito W Torres del Paine', duration_days: 5, rating: 4.9, reviews_count: 12, featured_image_url: 'https://www.trekkingchile.com/media/catalogue/route/thumb/torres-del-paine-circuito-w-en-camping.jpg', next_date: '2025-04-15' },
            { id: 2, name: 'Expedición Monte Fitz Roy', duration_days: 7, rating: 4.8, reviews_count: 9, featured_image_url: 'https://media.istockphoto.com/id/1297605025/photo/mount-fitz-roy-at-sunset-view-from-the-hiking-trail-on-beautiful-mountain-landscape-in.jpg?s=612x612&w=0&k=20&c=gy6J0LiDJeJVVDGZcIr0YgMfnYCrX_2yTFD1Tug25os=', next_date: '2025-06-10' }
          ],
          reviews: [
            { id: 1, reviewer_name: 'Ana López', rating: 5, comment: 'Excelente guía, muy profesional y con amplio conocimiento de la zona. Hizo que nuestra experiencia fuera inolvidable.', date: '2024-08-15', reviewer_image_url: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: 2, reviewer_name: 'Carlos Rodríguez', rating: 5, comment: 'Miguel es un experto en la Patagonia. Nos explicó todo sobre la flora, fauna e historia del lugar. Muy recomendable.', date: '2024-07-22', reviewer_image_url: 'https://randomuser.me/api/portraits/men/67.jpg' },
            { id: 3, reviewer_name: 'María Fernández', rating: 4, comment: 'Gran experiencia con Miguel. Muy atento a las necesidades del grupo y excelentes conocimientos.', date: '2024-06-30', reviewer_image_url: 'https://randomuser.me/api/portraits/women/33.jpg' }
          ],
          joined_date: '2010-05-12'
        });
      }, 800);
    });
  };
  
  // Función para obtener datos de explorador (simulada)
  const fetchSampleExplorerData = async (explorerId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: explorerId || '20',
          firstName: 'Ana',
          lastName: 'López',
          name: 'Ana López',
          email: 'ana.lopez@correo.com',
          profileImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          coverImageUrl: 'https://images.unsplash.com/photo-1502492679910-87c17ba8a7b9',
          experience_level: 'Experto',
          country: 'Chile',
          location: 'Santiago, Chile',
          phone: '+56 9 8765 4321',
          languages: ['Español', 'Inglés'],
          bio: 'Apasionada por la montaña y los deportes extremos. He recorrido gran parte de la Patagonia y los Andes. Siempre buscando nuevos desafíos.',
          medical_conditions: 'Ninguna',
          special_requirements: 'Prefiero actividades vegetarianas',
          points: 1250,
          activities_count: 28,
          expeditions_count: 5,
          average_rating: 4.8,
          reviews_count: 15,
          completedActivities: [
            { id: 1, name: 'Trekking Torres del Paine', type: 'Trekking', date: '2024-07-15', guide_name: 'Miguel Sánchez', rating_given: 5, featured_image_url: 'https://patagoniatours.cl/wp-content/uploads/2014/02/tour-trekking-base-torres-del-paine2.jpg' },
            { id: 2, name: 'Sandboard San Pedro de Atacama', type: 'Sandboarding', date: '2024-05-22', guide_name: 'Camila Rojas', rating_given: 4, featured_image_url: 'https://sandboard.cl/wp-content/uploads/2025/01/GOPR1095-scaled.jpg' },
            { id: 3, name: 'Canopy Pucón', type: 'Canopy', date: '2024-03-10', guide_name: 'Antonio Pérez', rating_given: 5, featured_image_url: 'https://puconchile.travel/wp-content/uploads/2023/12/Fotos-Canopy-Vuelo-del-condor3-1024x600.jpg' }
          ],
          completedExpeditions: [
            { id: 1, name: 'Circuito W Torres del Paine', duration_days: 5, date: '2024-02-10', guide_name: 'Miguel Sánchez', rating_given: 5, featured_image_url: 'https://www.trekkingchile.com/media/catalogue/route/thumb/torres-del-paine-circuito-w-en-camping.jpg' },
            { id: 2, name: 'Travesía a las Cataratas del Iguazú', duration_days: 4, date: '2023-11-05', guide_name: 'Laura Gómez', rating_given: 5, featured_image_url: 'https://media.istockphoto.com/id/535175381/es/foto/cataratas-del-iguaz%C3%BA-visto-desde-argentina.jpg?s=612x612&w=0&k=20&c=v0J2Tg_HM9RD3uF1Fn-ZnxogMcD6Tj8o1wl7RZ0cSCY=' }
          ],
          preferredActivities: ['Trekking', 'Escalada', 'Montañismo'],
          reviews: [
            { id: 1, activity_name: 'Trekking Torres del Paine', guide_name: 'Miguel Sánchez', rating: 5, comment: 'Una experiencia increíble. Las vistas son espectaculares y el guía estaba muy bien preparado.', date: '2024-07-16' },
            { id: 2, activity_name: 'Sandboard San Pedro de Atacama', guide_name: 'Camila Rojas', rating: 4, comment: 'Muy divertido. Buena instrucción para principiantes. Recomendado.', date: '2024-05-23' },
            { id: 3, activity_name: 'Canopy Pucón', guide_name: 'Antonio Pérez', rating: 5, comment: 'Adrenalina pura con vistas increíbles. El personal muy seguro y atento.', date: '2024-03-11' }
          ],
          bookings: [
            { id: 1, activity_name: 'Rafting Río Barinas', type: 'Actividad', date: '2025-06-22', status: 'Confirmado', payment_status: 'Pagado', price: 80, currency: 'USD' },
            { id: 2, activity_name: 'Exploración Isla de Pascua', type: 'Expedición', date: '2025-07-15', status: 'Pendiente', payment_status: 'Pendiente', price: 1200, currency: 'USD' }
          ],
          joined_date: '2022-01-15'
        });
      }, 800);
    });
  };
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };
  
  // Renderizar estrellas para la valoración
  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon 
            key={star}
            icon={faStar}
            className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  // Renderizar nivel de habilidad con barras
  const renderSkillLevel = (level) => {
    return (
      <div className="skill-level">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div 
            key={bar} 
            className={`skill-bar ${bar <= level ? 'filled' : ''}`}
          ></div>
        ))}
      </div>
    );
  };
  
  // Función para obtener badge para guías
  const getGuideBadge = (guideType) => {
    if (guideType === 'Master Guide') {
      return (
        <span className="badge badge-master">
          <FontAwesomeIcon icon={faMedal} /> Master Guide
        </span>
      );
    } else if (guideType === 'Specialized Guide') {
      return (
        <span className="badge badge-specialized">
          <FontAwesomeIcon icon={faShieldAlt} /> Specialized
        </span>
      );
    } else if (guideType === 'Associate Guide') {
      return (
        <span className="badge badge-associate">
          <FontAwesomeIcon icon={faUser} /> Associate
        </span>
      );
    }
    return null;
  };
  
  // Obtener clase CSS para nivel de experiencia
  const getExperienceLevelClass = (level) => {
    const levelMap = {
      'Principiante': 'experience-beginner',
      'Intermedio': 'experience-intermediate',
      'Experto': 'experience-expert'
    };
    return levelMap[level] || '';
  };
  
  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar userRole={currentUserRole} />
        <div className="profile-content">
          <Navbar />
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="profile-page">
        <Sidebar userRole={currentUserRole} />
        <div className="profile-content">
          <Navbar />
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <h2>Error al cargar el perfil</h2>
            <p>{error || 'No se pudo encontrar el perfil solicitado.'}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <Sidebar userRole={currentUserRole} />
      
      <div className="profile-content">
        <Navbar />
        
        {/* Cover y foto de perfil */}
        <div className="profile-cover" style={{ backgroundImage: `url(${user.coverImageUrl || 'https://images.unsplash.com/photo-1502492679910-87c17ba8a7b9'})` }}>
          <div className="profile-header">
            <div className="profile-avatar">
              <img 
                src={user.profileImageUrl} 
                alt={user.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Usuario';
                }}
              />
              {isCurrentUser && (
                <button className="change-avatar-btn">
                  <FontAwesomeIcon icon={faCamera} />
                </button>
              )}
            </div>
            
            <div className="profile-title">
              <h1>{user.name}</h1>
              
              {/* Badge para guías o nivel para explorers */}
              {user.guide_type ? (
                getGuideBadge(user.guide_type)
              ) : (
                <span className={`badge experience-badge ${getExperienceLevelClass(user.experience_level)}`}>
                  {user.experience_level}
                </span>
              )}
              
              <div className="profile-meta">
                {user.location && (
                  <span className="meta-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {user.location.name || user.location}
                  </span>
                )}
                
                <span className="meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Miembro desde {formatDate(user.joined_date)}
                </span>
                
                {user.average_rating && (
                  <span className="meta-item">
                    {renderStars(user.average_rating)}
                    <span className="reviews-count">({user.total_reviews || user.reviews_count} reseñas)</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Acciones de perfil */}
            <div className="profile-actions">
              {isCurrentUser ? (
                <Link to="/edit-profile" className="btn btn-edit">
                  <FontAwesomeIcon icon={faEdit} /> Editar Perfil
                </Link>
              ) : (
                <>
                  <button className="btn btn-contact">
                    <FontAwesomeIcon icon={faEnvelope} /> Contactar
                  </button>
                  <button className="btn btn-save">
                    <FontAwesomeIcon icon={faBookmark} /> Guardar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Contenido del perfil */}
        <div className="profile-container">
          {/* Tabs de navegación */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Información
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              {user.guide_type ? 'Actividades' : 'Historial de Actividades'}
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'expeditions' ? 'active' : ''}`}
              onClick={() => setActiveTab('expeditions')}
            >
              Expediciones
            </button>
            
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas
            </button>
            
            {user.guide_type && (
              <button 
                className={`tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('certifications')}
              >
                Certificaciones
              </button>
            )}
            
            {!user.guide_type && (
              <button 
                className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Reservas
              </button>
            )}
          </div>
          
          {/* Contenido de las pestañas */}
          <div className="profile-tab-content">
            {/* Tab de información */}
            {activeTab === 'info' && (
              <div className="tab-info">
                <div className="info-grid">
                  {/* Columna izquierda */}
                  <div className="info-column">
                    <div className="info-card">
                      <h2>Biografía</h2>
                      <p>{user.bio_extended || user.bio}</p>
                    </div>
                    
                    {user.guide_type ? (
                      <div className="info-card">
                        <h2>Habilidades</h2>
                        <ul className="skills-list">
                          {user.skills && user.skills.map((skill, index) => (
                            <li key={index} className="skill-item">
                              <div className="skill-name">{skill.name}</div>
                              {renderSkillLevel(skill.proficiency_level)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="info-card">
                        <h2>Actividades Preferidas</h2>
                        <div className="preferred-activities">
                          {user.preferredActivities && user.preferredActivities.map((activity, index) => (
                            <span key={index} className="preferred-activity">
                              <FontAwesomeIcon icon={faHiking} /> {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="info-card">
                      <h2>Información Personal</h2>
                      <ul className="personal-info-list">
                        <li>
                          <span className="info-label">Nombre completo:</span>
                          <span className="info-value">{user.firstName} {user.lastName}</span>
                        </li>
                        <li>
                          <span className="info-label">Email:</span>
                          <span className="info-value">{user.email}</span>
                        </li>
                        <li>
                          <span className="info-label">Teléfono:</span>
                          <span className="info-value">{user.phone || 'No especificado'}</span>
                        </li>
                        <li>
                          <span className="info-label">País:</span>
                          <span className="info-value">{user.country}</span>
                        </li>
                        <li>
                          <span className="info-label">Idiomas:</span>
                          <span className="info-value">{user.languages?.join(', ') || 'No especificado'}</span>
                        </li>
                        {user.guide_type && (
                          <li>
                            <span className="info-label">Experiencia:</span>
                            <span className="info-value">{user.years_of_experience} años</span>
                          </li>
                        )}
                        {user.guide_type && (
                          <li>
                            <span className="info-label">Disponible:</span>
                            <span className="info-value">
                              {user.available_for_hire ? (
                                <span className="available"><FontAwesomeIcon icon={faCheck} /> Disponible para contratar</span>
                              ) : (
                                <span className="unavailable">No disponible actualmente</span>
                              )}
                            </span>
                          </li>
                        )}
                        {!user.guide_type && user.medical_conditions && (
                          <li>
                            <span className="info-label">Condiciones médicas:</span>
                            <span className="info-value">{user.medical_conditions}</span>
                          </li>
                        )}
                        {!user.guide_type && user.special_requirements && (
                          <li>
                            <span className="info-label">Requerimientos especiales:</span>
                            <span className="info-value">{user.special_requirements}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Columna derecha */}
                  <div className="info-column">
                    <div className="info-card stats-card">
                      <h2>Estadísticas</h2>
                      <div className="stats-grid">
                        {user.guide_type ? (
                          <>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faHiking} />
                              </div>
                              <div className="stat-number">{stats.activitiesLed}</div>
                              <div className="stat-label">Actividades</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faRoute} />
                              </div>
                              <div className="stat-number">{stats.expeditionsLed}</div>
                              <div className="stat-label">Expediciones</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                              <div className="stat-number">{stats.averageRating}</div>
                              <div className="stat-label">Valoración</div>
                            </div>
                                <div className="stat-icon">
                                <FontAwesomeIcon icon={faUser} />
                                </div>
                                <div className="stat-number">{stats.totalReviews}</div>
                                <div className="stat-label">Reseñas</div>
                             </>       
                        ) : (
                            <>|
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faHiking} />
                              </div>
                              <div className="stat-number">{stats.activitiesCompleted}</div>
                              <div className="stat-label">Actividades</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faRoute} />
                              </div>
                              <div className="stat-number">{stats.expeditionsCompleted}</div>
                              <div className="stat-label">Expediciones</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faChartLine} />
                              </div>
                              <div className="stat-number">{stats.points}</div>
                              <div className="stat-label">Puntos</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-icon">
                                <FontAwesomeIcon icon={faStar} />
                              </div>
                              <div className="stat-number">{stats.reviewsCount || 0}</div>
                              <div className="stat-label">Reseñas</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {user.guide_type && (
                      <div className="info-card">
                        <h2>Próximas Actividades</h2>
                        {activities.length > 0 ? (
                          <div className="upcoming-activities">
                            {activities.slice(0, 2).map((activity, index) => (
                              <div key={index} className="upcoming-activity-item">
                                <div className="activity-thumb">
                                  <img 
                                    src={activity.featured_image_url}
                                    alt={activity.name}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/80?text=Actividad';
                                    }}
                                  />
                                </div>
                                <div className="activity-details">
                                  <h3>{activity.name}</h3>
                                  <div className="activity-meta">
                                    <span className="activity-type">{activity.type}</span>
                                    <span className="activity-date">
                                      <FontAwesomeIcon icon={faCalendarAlt} />
                                      {formatDate(activity.next_date)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <Link to={`/guides/${user.id}/activities`} className="view-all-link">
                              Ver todas las actividades
                            </Link>
                          </div>
                        ) : (
                          <p className="no-data">No hay actividades próximas</p>
                        )}
                      </div>
                    )}
                    
                    {user.guide_type ? (
                      <div className="info-card">
                        <h2>Reseñas Recientes</h2>
                        {reviews.length > 0 ? (
                          <div className="recent-reviews">
                            {reviews.slice(0, 2).map((review, index) => (
                              <div key={index} className="review-item">
                                <div className="review-header">
                                  <img 
                                    src={review.reviewer_image_url}
                                    alt={review.reviewer_name}
                                    className="reviewer-avatar"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/40?text=Usuario';
                                    }}
                                  />
                                  <div className="reviewer-info">
                                    <div className="reviewer-name">{review.reviewer_name}</div>
                                    <div className="review-date">{formatDate(review.date)}</div>
                                  </div>
                                  <div className="review-rating">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <div className="review-comment">
                                  {review.comment}
                                </div>
                              </div>
                            ))}
                            <Link to={`/guides/${user.id}/reviews`} className="view-all-link">
                              Ver todas las reseñas
                            </Link>
                          </div>
                        ) : (
                          <p className="no-data">No hay reseñas disponibles</p>
                        )}
                      </div>
                    ) : (
                      <div className="info-card">
                        <h2>Actividades Recientes</h2>
                        {activities.length > 0 ? (
                          <div className="upcoming-activities">
                            {activities.slice(0, 2).map((activity, index) => (
                              <div key={index} className="upcoming-activity-item">
                                <div className="activity-thumb">
                                  <img 
                                    src={activity.featured_image_url}
                                    alt={activity.name}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/80?text=Actividad';
                                    }}
                                  />
                                </div>
                                <div className="activity-details">
                                  <h3>{activity.name}</h3>
                                  <div className="activity-meta">
                                    <span className="activity-type">{activity.type}</span>
                                    <span className="activity-date">
                                      <FontAwesomeIcon icon={faCalendarAlt} />
                                      {formatDate(activity.date)}
                                    </span>
                                    <span className="activity-guide">
                                      <FontAwesomeIcon icon={faUser} />
                                      {activity.guide_name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-data">No hay actividades recientes</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab de actividades */}
            {activeTab === 'activities' && (
              <div className="tab-activities">
                <h2>
                  {user.guide_type ? 'Actividades Ofrecidas' : 'Historial de Actividades'}
                </h2>
                
                {activities.length > 0 ? (
                  <div className="activities-grid">
                    {activities.map((activity, index) => (
                      <div key={index} className="activity-card">
                        <div className="activity-image">
                          <img 
                            src={activity.featured_image_url}
                            alt={activity.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300?text=Actividad';
                            }}
                          />
                          <span className="activity-type-badge">{activity.type}</span>
                        </div>
                        <div className="activity-content">
                          <h3>{activity.name}</h3>
                          
                          {user.guide_type ? (
                            <div className="activity-stats">
                              <div className="activity-rating">
                                {renderStars(activity.rating)}
                                <span className="reviews-count">({activity.reviews_count} reseñas)</span>
                              </div>
                              <div className="activity-date">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>Próxima: {formatDate(activity.next_date)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="activity-stats">
                              <div className="activity-date">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>{formatDate(activity.date)}</span>
                              </div>
                              <div className="activity-guide">
                                <FontAwesomeIcon icon={faUser} />
                                <span>Guía: {activity.guide_name}</span>
                              </div>
                              {activity.rating_given && (
                                <div className="activity-rating">
                                  <span>Tu valoración: </span>
                                  {renderStars(activity.rating_given)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="activity-footer">
                            {user.guide_type ? (
                              <Link to={`/activities/${activity.id}`} className="view-details-btn">
                                Ver detalles
                              </Link>
                            ) : (
                              <Link to={`/activities/${activity.id}`} className="view-details-btn">
                                Ver actividad
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay actividades disponibles para mostrar.</p>
                    {user.guide_type && isCurrentUser && (
                      <Link to="/create-activity" className="btn btn-primary">
                        Crear nueva actividad
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Tab de expediciones */}
            {activeTab === 'expeditions' && (
              <div className="tab-expeditions">
                <h2>
                  {user.guide_type ? 'Expediciones Organizadas' : 'Expediciones Completadas'}
                </h2>
                
                {expeditions.length > 0 ? (
                  <div className="expeditions-grid">
                    {expeditions.map((expedition, index) => (
                      <div key={index} className="expedition-card">
                        <div className="expedition-image">
                          <img 
                            src={expedition.featured_image_url}
                            alt={expedition.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300?text=Expedición';
                            }}
                          />
                          <span className="expedition-duration">
                            {expedition.duration_days} días
                          </span>
                        </div>
                        <div className="expedition-content">
                          <h3>{expedition.name}</h3>
                          
                          {user.guide_type ? (
                            <div className="expedition-stats">
                              <div className="expedition-rating">
                                {renderStars(expedition.rating)}
                                <span className="reviews-count">({expedition.reviews_count} reseñas)</span>
                              </div>
                              <div className="expedition-date">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>Próxima: {formatDate(expedition.next_date)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="expedition-stats">
                              <div className="expedition-date">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>{formatDate(expedition.date)}</span>
                              </div>
                              <div className="expedition-guide">
                                <FontAwesomeIcon icon={faUser} />
                                <span>Guía: {expedition.guide_name}</span>
                              </div>
                              {expedition.rating_given && (
                                <div className="expedition-rating">
                                  <span>Tu valoración: </span>
                                  {renderStars(expedition.rating_given)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="expedition-footer">
                            {user.guide_type ? (
                              <Link to={`/expeditions/${expedition.id}`} className="view-details-btn">
                                Ver detalles
                              </Link>
                            ) : (
                              <Link to={`/expeditions/${expedition.id}`} className="view-details-btn">
                                Ver expedición
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay expediciones disponibles para mostrar.</p>
                    {user.guide_type && isCurrentUser && (
                      <Link to="/create-expedition" className="btn btn-primary">
                        Crear nueva expedición
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Tab de reseñas */}
            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <h2>
                  {user.guide_type ? 'Reseñas Recibidas' : 'Reseñas Realizadas'}
                </h2>
                
                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review, index) => (
                      <div key={index} className="review-card">
                        {user.guide_type ? (
                          <>
                            <div className="review-header">
                              <img 
                                src={review.reviewer_image_url}
                                alt={review.reviewer_name}
                                className="reviewer-avatar"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/60?text=Usuario';
                                }}
                              />
                              <div className="reviewer-info">
                                <div className="reviewer-name">{review.reviewer_name}</div>
                                <div className="review-date">{formatDate(review.date)}</div>
                              </div>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <div className="review-comment">
                              {review.comment}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="review-header">
                              <div className="review-entity-info">
                                <h3>{review.activity_name}</h3>
                                <div className="review-guide">
                                  <FontAwesomeIcon icon={faUser} />
                                  <span>Guía: {review.guide_name}</span>
                                </div>
                              </div>
                              <div className="review-right">
                                <div className="review-date">{formatDate(review.date)}</div>
                                <div className="review-rating">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                            </div>
                            <div className="review-comment">
                              {review.comment}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay reseñas disponibles para mostrar.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab de certificaciones (solo para guías) */}
            {activeTab === 'certifications' && user.guide_type && (
              <div className="tab-certifications">
                <h2>Certificaciones</h2>
                
                {certifications.length > 0 ? (
                  <div className="certifications-list">
                    {certifications.map((cert, index) => (
                      <div key={index} className="certification-card">
                        <div className="certification-icon">
                          <FontAwesomeIcon icon={faShieldAlt} />
                        </div>
                        <div className="certification-content">
                          <h3>{cert.name}</h3>
                          <div className="certification-meta">
                            <div className="certification-org">
                              <span className="meta-label">Organización:</span>
                              <span className="meta-value">{cert.issuing_organization}</span>
                            </div>
                            <div className="certification-date">
                              <span className="meta-label">Fecha de emisión:</span>
                              <span className="meta-value">{formatDate(cert.issue_date)}</span>
                            </div>
                          </div>
                        </div>
                        {cert.document_url && (
                          <a href={cert.document_url} className="certification-view-btn" target="_blank" rel="noopener noreferrer">
                            Ver certificado
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay certificaciones disponibles para mostrar.</p>
                    {isCurrentUser && (
                      <Link to="/add-certification" className="btn btn-primary">
                        Añadir certificación
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Tab de reservas (solo para exploradores) */}
            {activeTab === 'bookings' && !user.guide_type && (
              <div className="tab-bookings">
                <h2>Reservas</h2>
                
                {bookings.length > 0 ? (
                  <div className="bookings-list">
                    {bookings.map((booking, index) => (
                      <div key={index} className="booking-card">
                        <div className="booking-header">
                          <h3>{booking.activity_name}</h3>
                          <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="booking-details">
                          <div className="booking-detail">
                            <span className="detail-label">Tipo:</span>
                            <span className="detail-value">{booking.type}</span>
                          </div>
                          <div className="booking-detail">
                            <span className="detail-label">Fecha:</span>
                            <span className="detail-value">{formatDate(booking.date)}</span>
                          </div>
                          <div className="booking-detail">
                            <span className="detail-label">Precio:</span>
                            <span className="detail-value">{booking.price} {booking.currency}</span>
                          </div>
                          <div className="booking-detail">
                            <span className="detail-label">Estado de pago:</span>
                            <span className="detail-value">{booking.payment_status}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <Link to={`/booking/${booking.id}`} className="btn btn-outline">
                            Ver detalles
                          </Link>
                          {booking.status === 'Pendiente' && (
                            <button className="btn btn-danger">
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No tienes reservas activas.</p>
                    <Link to="/activities" className="btn btn-primary">
                      Explorar actividades
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;