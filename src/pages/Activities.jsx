import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSort, 
  faSearch, 
  faPlusCircle,
  faMapMarkerAlt,
  faTag,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ActivityCard from '../components/ActivityCard';
import { activityService } from '../utils/api';
import '../styles/Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('explorer');
  
  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    difficulty: '',
    duration: '',
    searchTerm: ''
  });
  
  // Ordenación
  const [sortBy, setSortBy] = useState('name_asc');
  
  // Estado para mostrar/ocultar los filtros en móvil
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Cargar actividades, categorías y ubicaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // En un entorno real, estos serían llamados a tu API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de actividades
        const activitiesResponse = await fetchSampleActivities();
        setActivities(activitiesResponse);
        setFilteredActivities(activitiesResponse);
        
        // Simular carga de categorías
        const categoriesResponse = await fetchSampleCategories();
        setCategories(categoriesResponse);
        
        // Simular carga de ubicaciones
        const locationsResponse = await fetchSampleLocations();
        setLocations(locationsResponse);
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Hubo un problema al cargar las actividades. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para simular carga de datos (reemplazar con llamadas a API reales)
  const fetchSampleActivities = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Trekking Torres del Paine',
            description: 'Recorrido por el famoso circuito W del Parque Nacional Torres del Paine, visitando sus principales atractivos como las Torres, Cuernos y Valle Francés.',
            difficulty_level: 'Moderada',
            location: {
              id: 1,
              name: 'Torres del Paine, Chile'
            },
            duration_hours: 8,
            price_per_person: 120,
            currency_code: 'USD',
            average_rating: 4.8,
            total_reviews: 24,
            category: {
              id: 1,
              name: 'Trekking'
            },
            min_participants: 2,
            max_participants: 10,
            featured_image_url: 'https://patagoniatours.cl/wp-content/uploads/2014/02/tour-trekking-base-torres-del-paine2.jpg',
            is_available: true
          },
          {
            id: 2,
            name: 'Sandboard en San Pedro de Atacama',
            description: 'Experiencia emocionante deslizándose por las dunas de arena del desierto de Atacama. Incluye equipo y guía experimentado.',
            difficulty_level: 'Moderada',
            location: {
              id: 2,
              name: 'San Pedro de Atacama, Chile'
            },
            duration_hours: 4,
            price_per_person: 65,
            currency_code: 'USD',
            average_rating: 4.5,
            total_reviews: 18,
            category: {
              id: 2,
              name: 'Sandboarding'
            },
            min_participants: 1,
            max_participants: 8,
            featured_image_url: 'https://sandboard.cl/wp-content/uploads/2025/01/GOPR1095-scaled.jpg',
            is_available: true
          },
          {
            id: 3,
            name: 'Canopy Tour Pucón',
            description: 'Tirolesas a través del dosel forestal ofreciendo vistas panorámicas de volcanes y lagos. Una experiencia llena de adrenalina.',
            difficulty_level: 'Fácil',
            location: {
              id: 3,
              name: 'Pucón, Chile'
            },
            duration_hours: 3,
            price_per_person: 50,
            currency_code: 'USD',
            average_rating: 4.7,
            total_reviews: 32,
            category: {
              id: 3,
              name: 'Canopy'
            },
            min_participants: 2,
            max_participants: 12,
            featured_image_url: 'https://puconchile.travel/wp-content/uploads/2023/12/Fotos-Canopy-Vuelo-del-condor3-1024x600.jpg',
            is_available: true
          },
          {
            id: 4,
            name: 'Rafting Río Barinas',
            description: 'Descenso por los rápidos del Río Barinas, atravesando paisajes impresionantes y experimentando la emoción de los rápidos de clase III y IV.',
            difficulty_level: 'Difícil',
            location: {
              id: 4,
              name: 'Barinas, Venezuela'
            },
            duration_hours: 5,
            price_per_person: 80,
            currency_code: 'USD',
            average_rating: 4.9,
            total_reviews: 15,
            category: {
              id: 4,
              name: 'Rafting'
            },
            min_participants: 4,
            max_participants: 8,
            featured_image_url: 'https://anacvarelar.wordpress.com/wp-content/uploads/2013/11/rafting-04y051-07-09_043.jpg',
            is_available: true
          },
          {
            id: 5,
            name: 'Tour Histórico Machu Picchu',
            description: 'Visita guiada por el santuario histórico de Machu Picchu, explorando sus templos, plazas y áreas agrícolas con un guía experto en historia inca.',
            difficulty_level: 'Moderada',
            location: {
              id: 5,
              name: 'Cusco, Perú'
            },
            duration_hours: 6,
            price_per_person: 150,
            currency_code: 'USD',
            average_rating: 4.9,
            total_reviews: 42,
            category: {
              id: 1,
              name: 'Trekking'
            },
            min_participants: 1,
            max_participants: 15,
            featured_image_url: 'https://ojo.pe/resizer/v2/HFSWMWMELZGVVB6NSC55554YNA.jpeg?auth=8846b5d6a19d04083aa26aaff3b80b031f07701abc94790efc03caba86dd344b&width=580&height=330&quality=75&smart=true',
            is_available: false
          },
          {
            id: 6,
            name: 'Buceo en Isla Margarita',
            description: 'Inmersión en las aguas cristalinas del Caribe, explorando arrecifes de coral y una variada vida marina. Incluye equipo y guía de buceo certificado.',
            difficulty_level: 'Moderada',
            location: {
              id: 6,
              name: 'Isla Margarita, Venezuela'
            },
            duration_hours: 5,
            price_per_person: 95,
            currency_code: 'USD',
            average_rating: 4.6,
            total_reviews: 28,
            category: {
              id: 5,
              name: 'Buceo'
            },
            min_participants: 2,
            max_participants: 6,
            featured_image_url: 'https://www.graylinedulce.com/wp-content/uploads/2018/08/buceolasranas.jpg',
            is_available: true
          }
        ]);
      }, 800);
    });
  };
  
  const fetchSampleCategories = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Trekking' },
          { id: 2, name: 'Sandboarding' },
          { id: 3, name: 'Canopy' },
          { id: 4, name: 'Rafting' },
          { id: 5, name: 'Buceo' },
          { id: 6, name: 'Escalada' },
          { id: 7, name: 'Ciclismo' }
        ]);
      }, 500);
    });
  };
  
  const fetchSampleLocations = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Torres del Paine, Chile' },
          { id: 2, name: 'San Pedro de Atacama, Chile' },
          { id: 3, name: 'Pucón, Chile' },
          { id: 4, name: 'Barinas, Venezuela' },
          { id: 5, name: 'Cusco, Perú' },
          { id: 6, name: 'Isla Margarita, Venezuela' }
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
    let result = [...activities];
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.location.name.toLowerCase().includes(searchLower) ||
        activity.category.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      result = result.filter(activity => 
        activity.category.id.toString() === filters.category
      );
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      result = result.filter(activity => 
        activity.location.id.toString() === filters.location
      );
    }
    
    // Filtrar por precio mínimo
    if (filters.minPrice) {
      result = result.filter(activity => 
        activity.price_per_person >= parseFloat(filters.minPrice)
      );
    }
    
    // Filtrar por precio máximo
    if (filters.maxPrice) {
      result = result.filter(activity => 
        activity.price_per_person <= parseFloat(filters.maxPrice)
      );
    }
    
    // Filtrar por dificultad
    if (filters.difficulty) {
      result = result.filter(activity => 
        activity.difficulty_level === filters.difficulty
      );
    }
    
    // Filtrar por duración
    if (filters.duration) {
      const durationValue = parseInt(filters.duration);
      
      switch(filters.duration) {
        case '0-2':
          result = result.filter(activity => activity.duration_hours <= 2);
          break;
        case '2-4':
          result = result.filter(activity => 
            activity.duration_hours > 2 && activity.duration_hours <= 4
          );
          break;
        case '4-8':
          result = result.filter(activity => 
            activity.duration_hours > 4 && activity.duration_hours <= 8
          );
          break;
        case '8+':
          result = result.filter(activity => activity.duration_hours > 8);
          break;
      }
    }
    
    // Aplicar ordenación
    switch(sortBy) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price_per_person - b.price_per_person);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price_per_person - a.price_per_person);
        break;
      case 'rating_desc':
        result.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'duration_asc':
        result.sort((a, b) => a.duration_hours - b.duration_hours);
        break;
      case 'duration_desc':
        result.sort((a, b) => b.duration_hours - a.duration_hours);
        break;
    }
    
    setFilteredActivities(result);
  }, [activities, filters, sortBy]);
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      difficulty: '',
      duration: '',
      searchTerm: ''
    });
    setSortBy('name_asc');
  };
  
  // Manejar toggle de filtros en móvil
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="activities-page">
      <Sidebar userRole={userRole} />
      
      <div className="activities-content">
        <Navbar />
        
        <div className="activities-container">
          <div className="activities-header">
            <h1>Actividades</h1>
            
            {userRole === 'guide' && (
              <Link to="/create-activity" className="create-activity-btn">
                <FontAwesomeIcon icon={faPlusCircle} /> Nueva Actividad
              </Link>
            )}
          </div>
          
          <div className="activities-actions">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <button className="filter-toggle-btn" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} /> Filtros
            </button>
          </div>
          
          <div className="activities-main">
            <div className={`activities-filters ${showFilters ? 'show' : ''}`}>
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                  Resetear
                </button>
              </div>
              
              <div className="filter-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="location">Ubicación</label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las ubicaciones</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="difficulty">Dificultad</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                >
                  <option value="">Cualquier dificultad</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Difícil">Difícil</option>
                  <option value="Extrema">Extrema</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="duration">Duración</label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                >
                  <option value="">Cualquier duración</option>
                  <option value="0-2">Menos de 2 horas</option>
                  <option value="2-4">2 a 4 horas</option>
                  <option value="4-8">4 a 8 horas</option>
                  <option value="8+">Más de 8 horas</option>
                </select>
              </div>
              
              <div className="filter-group price-range">
                <label>Rango de precio</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
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
                  <option value="price_asc">Precio (Menor a Mayor)</option>
                  <option value="price_desc">Precio (Mayor a Menor)</option>
                  <option value="rating_desc">Mejor valorados</option>
                  <option value="duration_asc">Duración (Corta a Larga)</option>
                  <option value="duration_desc">Duración (Larga a Corta)</option>
                </select>
              </div>
            </div>
            
            <div className="activities-results">
              <div className="results-header">
                <span>
                  {filteredActivities.length} {filteredActivities.length === 1 ? 'actividad' : 'actividades'} encontradas
                </span>
                <div className="sort-mobile">
                  <FontAwesomeIcon icon={faSort} />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="name_asc">Nombre (A-Z)</option>
                    <option value="name_desc">Nombre (Z-A)</option>
                    <option value="price_asc">Precio ↑</option>
                    <option value="price_desc">Precio ↓</option>
                    <option value="rating_desc">Mejor valorados</option>
                    <option value="duration_asc">Duración ↑</option>
                    <option value="duration_desc">Duración ↓</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Cargando actividades...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <p>{error}</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="no-results">
                  <h3>No se encontraron actividades</h3>
                  <p>Intenta cambiar los filtros o buscar con otros términos</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
                    Resetear filtros
                  </button>
                </div>
              ) : (
                <div className="activities-grid">
                  {filteredActivities.map(activity => (
                    <div className="activity-card-wrapper" key={activity.id}>
                      <ActivityCard activity={activity} />
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

export default Activities;