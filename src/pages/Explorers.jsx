import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSort, 
  faSearch, 
  faStar,
  faUser,
  faMapMarkerAlt,
  faHiking,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { explorerService } from '../utils/api';
import '../styles/Explorers.css';

const Explorers = () => {
  const [explorers, setExplorers] = useState([]);
  const [filteredExplorers, setFilteredExplorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('explorer');
  
  // Filtros
  const [filters, setFilters] = useState({
    experienceLevel: '',
    country: '',
    preferredActivity: '',
    searchTerm: ''
  });
  
  // Ordenación
  const [sortBy, setSortBy] = useState('name_asc');
  
  // Estado para mostrar/ocultar los filtros en móvil
  const [showFilters, setShowFilters] = useState(false);

  // Lista de países y actividades para los filtros
  const [countries, setCountries] = useState([]);
  const [preferredActivities, setPreferredActivities] = useState([]);
  
  // Obtener rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role_name?.toLowerCase() || 'explorer');
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  // Cargar exploradores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // En un entorno real, estos serían llamados a tu API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de exploradores
        const explorersResponse = await fetchSampleExplorers();
        setExplorers(explorersResponse);
        setFilteredExplorers(explorersResponse);
        
        // Extraer países únicos de los exploradores
        const uniqueCountries = [...new Set(explorersResponse.map(explorer => explorer.country))];
        setCountries(uniqueCountries.map(country => ({ name: country })));
        
        // Cargar actividades preferidas
        const activitiesResponse = await fetchSampleActivities();
        setPreferredActivities(activitiesResponse);
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Hubo un problema al cargar los exploradores. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para simular carga de datos (reemplazar con llamadas a API reales)
  const fetchSampleExplorers = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Ana López',
            firstName: 'Ana',
            lastName: 'López',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            experience_level: 'Experto',
            country: 'Chile',
            preferredActivities: ['Trekking', 'Escalada', 'Montañismo'],
            points: 1250,
            completedActivities: 28,
            completedExpeditions: 5,
            averageRating: 4.8,
            bio: 'Apasionada por la montaña y los deportes extremos. He recorrido gran parte de la Patagonia y los Andes. Siempre buscando nuevos desafíos.',
            joinedDate: '2022-01-15'
          },
          {
            id: 2,
            name: 'Carlos Rodriguez',
            firstName: 'Carlos',
            lastName: 'Rodriguez',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
            experience_level: 'Intermedio',
            country: 'Argentina',
            preferredActivities: ['Rafting', 'Kayak', 'Canopy'],
            points: 780,
            completedActivities: 15,
            completedExpeditions: 2,
            averageRating: 4.5,
            bio: 'Amante de los deportes acuáticos y la aventura. Busco experiencias que me saquen de mi zona de confort.',
            joinedDate: '2022-06-20'
          },
          {
            id: 3,
            name: 'María Fernández',
            firstName: 'María',
            lastName: 'Fernández',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
            experience_level: 'Principiante',
            country: 'México',
            preferredActivities: ['Senderismo', 'Ciclismo', 'Camping'],
            points: 320,
            completedActivities: 8,
            completedExpeditions: 0,
            averageRating: 4.2,
            bio: 'Principiante en el mundo outdoor pero con mucho entusiasmo por aprender y descubrir nuevos lugares.',
            joinedDate: '2023-02-10'
          },
          {
            id: 4,
            name: 'Javier Morales',
            firstName: 'Javier',
            lastName: 'Morales',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
            experience_level: 'Experto',
            country: 'Perú',
            preferredActivities: ['Montañismo', 'Escalada', 'Trail Running'],
            points: 1680,
            completedActivities: 42,
            completedExpeditions: 7,
            averageRating: 4.9,
            bio: 'Escalador y montañista con experiencia en los Andes. Guía ocasional y amante de la naturaleza.',
            joinedDate: '2021-08-05'
          },
          {
            id: 5,
            name: 'Valentina Torres',
            firstName: 'Valentina',
            lastName: 'Torres',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/56.jpg',
            experience_level: 'Intermedio',
            country: 'Colombia',
            preferredActivities: ['Trekking', 'Fotografía', 'Camping'],
            points: 950,
            completedActivities: 22,
            completedExpeditions: 3,
            averageRating: 4.7,
            bio: 'Fotógrafa de naturaleza y aventurera. Busco capturar la belleza de los paisajes latinoamericanos.',
            joinedDate: '2022-03-18'
          },
          {
            id: 6,
            name: 'Gabriel Mendoza',
            firstName: 'Gabriel',
            lastName: 'Mendoza',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
            experience_level: 'Principiante',
            country: 'Chile',
            preferredActivities: ['Senderismo', 'Observación de aves', 'Camping'],
            points: 420,
            completedActivities: 10,
            completedExpeditions: 1,
            averageRating: 4.3,
            bio: 'Amante de la naturaleza y observador de aves. Disfruto de caminatas tranquilas y conectar con el entorno.',
            joinedDate: '2023-01-05'
          },
          {
            id: 7,
            name: 'Lucía Vargas',
            firstName: 'Lucía',
            lastName: 'Vargas',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/62.jpg',
            experience_level: 'Experto',
            country: 'Venezuela',
            preferredActivities: ['Rafting', 'Escalada', 'Montañismo'],
            points: 1420,
            completedActivities: 32,
            completedExpeditions: 6,
            averageRating: 4.8,
            bio: 'Aventurera extrema con experiencia en diversos terrenos. He recorrido gran parte de Sudamérica en busca de adrenalina.',
            joinedDate: '2021-10-12'
          },
          {
            id: 8,
            name: 'Diego Herrera',
            firstName: 'Diego',
            lastName: 'Herrera',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
            experience_level: 'Intermedio',
            country: 'Uruguay',
            preferredActivities: ['Surf', 'Senderismo', 'Ciclismo'],
            points: 860,
            completedActivities: 19,
            completedExpeditions: 2,
            averageRating: 4.6,
            bio: 'Surfista y ciclista apasionado. Busco constantemente nuevas rutas y olas para conquistar.',
            joinedDate: '2022-05-28'
          }
        ]);
      }, 800);
    });
  };
  
  const fetchSampleActivities = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Trekking' },
          { id: 2, name: 'Escalada' },
          { id: 3, name: 'Montañismo' },
          { id: 4, name: 'Rafting' },
          { id: 5, name: 'Kayak' },
          { id: 6, name: 'Canopy' },
          { id: 7, name: 'Senderismo' },
          { id: 8, name: 'Ciclismo' },
          { id: 9, name: 'Camping' },
          { id: 10, name: 'Trail Running' },
          { id: 11, name: 'Fotografía' },
          { id: 12, name: 'Observación de aves' },
          { id: 13, name: 'Surf' }
        ]);
      }, 600);
    });
  };
  
  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambios en la ordenación
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };
  
  // Aplicar filtros y ordenación
  useEffect(() => {
    let result = [...explorers];
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(explorer => 
        explorer.name.toLowerCase().includes(searchLower) ||
        explorer.bio.toLowerCase().includes(searchLower) ||
        explorer.country.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por nivel de experiencia
    if (filters.experienceLevel) {
      result = result.filter(explorer => 
        explorer.experience_level === filters.experienceLevel
      );
    }
    
    // Filtrar por país
    if (filters.country) {
      result = result.filter(explorer => 
        explorer.country === filters.country
      );
    }
    
    // Filtrar por actividad preferida
    if (filters.preferredActivity) {
      result = result.filter(explorer => 
        explorer.preferredActivities.includes(filters.preferredActivity)
      );
    }
    
    // Aplicar ordenación
    switch(sortBy) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'experience_asc':
        const expOrder = { 'Principiante': 1, 'Intermedio': 2, 'Experto': 3 };
        result.sort((a, b) => expOrder[a.experience_level] - expOrder[b.experience_level]);
        break;
      case 'experience_desc':
        const expOrderDesc = { 'Principiante': 1, 'Intermedio': 2, 'Experto': 3 };
        result.sort((a, b) => expOrderDesc[b.experience_level] - expOrderDesc[a.experience_level]);
        break;
      case 'rating_desc':
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'points_desc':
        result.sort((a, b) => b.points - a.points);
        break;
      case 'activities_desc':
        result.sort((a, b) => (b.completedActivities + b.completedExpeditions) - (a.completedActivities + a.completedExpeditions));
        break;
      case 'joined_asc':
        result.sort((a, b) => new Date(a.joinedDate) - new Date(b.joinedDate));
        break;
      case 'joined_desc':
        result.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
        break;
    }
    
    setFilteredExplorers(result);
  }, [explorers, filters, sortBy]);
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      experienceLevel: '',
      country: '',
      preferredActivity: '',
      searchTerm: ''
    });
    setSortBy('name_asc');
  };
  
  // Manejar toggle de filtros en móvil
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
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
  
  return (
    <div className="explorers-page">
      <Sidebar userRole={userRole} />
      
      <div className="explorers-content">
        <Navbar />
        
        <div className="explorers-container">
          <div className="explorers-header">
            <h1>Exploradores</h1>
          </div>
          
          <div className="explorers-actions">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar exploradores..."
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <button className="filter-toggle-btn" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} /> Filtros
            </button>
          </div>
          
          <div className="explorers-main">
            <div className={`explorers-filters ${showFilters ? 'show' : ''}`}>
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                  Resetear
                </button>
              </div>
              
              <div className="filter-group">
                <label htmlFor="experienceLevel">Nivel de experiencia</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={filters.experienceLevel}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los niveles</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="country">País</label>
                <select
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los países</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="preferredActivity">Actividad preferida</label>
                <select
                  id="preferredActivity"
                  name="preferredActivity"
                  value={filters.preferredActivity}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las actividades</option>
                  {preferredActivities.map(activity => (
                    <option key={activity.id} value={activity.name}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="sortBy">Ordenar por</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="experience_asc">Experiencia (Menor a Mayor)</option>
                  <option value="experience_desc">Experiencia (Mayor a Menor)</option>
                  <option value="rating_desc">Mejor valorados</option>
                  <option value="points_desc">Más puntos</option>
                  <option value="activities_desc">Más actividades</option>
                  <option value="joined_asc">Más antiguos</option>
                  <option value="joined_desc">Más recientes</option>
                </select>
              </div>
            </div>
            
            <div className="explorers-results">
              <div className="results-header">
                <span>
                  {filteredExplorers.length} {filteredExplorers.length === 1 ? 'explorador' : 'exploradores'} encontrados
                </span>
                <div className="sort-mobile">
                  <FontAwesomeIcon icon={faSort} />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="name_asc">Nombre (A-Z)</option>
                    <option value="name_desc">Nombre (Z-A)</option>
                    <option value="experience_desc">Experiencia ↓</option>
                    <option value="rating_desc">Valoración ↓</option>
                    <option value="points_desc">Puntos ↓</option>
                    <option value="activities_desc">Actividades ↓</option>
                    <option value="joined_desc">Recientes ↓</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Cargando exploradores...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <p>{error}</p>
                </div>
              ) : filteredExplorers.length === 0 ? (
                <div className="no-results">
                  <h3>No se encontraron exploradores</h3>
                  <p>Intenta cambiar los filtros o buscar con otros términos</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
                    Resetear filtros
                  </button>
                </div>
              ) : (
                <div className="explorers-grid">
                  {filteredExplorers.map(explorer => (
                    <div className="explorer-card" key={explorer.id}>
                      <div className="explorer-header">
                        <div className="explorer-avatar">
                          <img 
                            src={explorer.profileImageUrl} 
                            alt={explorer.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Explorador';
                            }}
                          />
                        </div>
                        <div className="explorer-info">
                          <h3>{explorer.name}</h3>
                          <div className="explorer-meta">
                            <span className={`experience-badge ${getExperienceLevelClass(explorer.experience_level)}`}>
                              {explorer.experience_level}
                            </span>
                            <span className="country-badge">
                              <FontAwesomeIcon icon={faMapMarkerAlt} /> {explorer.country}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="explorer-stats">
                        <div className="stat">
                          <div className="stat-value">{explorer.points}</div>
                          <div className="stat-label">Puntos</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">{explorer.completedActivities}</div>
                          <div className="stat-label">Actividades</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">{explorer.completedExpeditions}</div>
                          <div className="stat-label">Expediciones</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">
                            <FontAwesomeIcon icon={faStar} className="star-icon" /> {explorer.averageRating.toFixed(1)}
                          </div>
                          <div className="stat-label">Valoración</div>
                        </div>
                      </div>
                      
                      <div className="explorer-activities">
                        <h4>Actividades preferidas</h4>
                        <div className="activities-tags">
                          {explorer.preferredActivities.map((activity, index) => (
                            <span key={index} className="activity-tag">
                              <FontAwesomeIcon icon={faHiking} /> {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="explorer-bio">
                        <p>{explorer.bio}</p>
                      </div>
                      
                      <div className="explorer-footer">
                        <div className="joined-date">
                          Miembro desde {formatDate(explorer.joinedDate)}
                        </div>
                        <Link to={`/explorers/${explorer.id}`} className="view-profile-btn">
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorers;