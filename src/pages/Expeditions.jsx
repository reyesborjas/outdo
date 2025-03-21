import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSort, 
  faSearch, 
  faPlusCircle,
  faMapMarkerAlt,
  faCalendarAlt,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ExpeditionCard from '../components/ExpeditionCard';
import { expeditionService } from '../utils/api';
import '../styles/Expeditions.css';

const Expeditions = () => {
  const [expeditions, setExpeditions] = useState([]);
  const [filteredExpeditions, setFilteredExpeditions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('explorer');
  
  // Filtros
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    difficulty: '',
    duration: '',
    searchTerm: '',
    startDate: ''
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

  // Cargar expediciones y ubicaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // En un entorno real, estos serían llamados a tu API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de expediciones
        const expeditionsResponse = await fetchSampleExpeditions();
        setExpeditions(expeditionsResponse);
        setFilteredExpeditions(expeditionsResponse);
        
        // Simular carga de ubicaciones
        const locationsResponse = await fetchSampleLocations();
        setLocations(locationsResponse);
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Hubo un problema al cargar las expediciones. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para simular carga de datos (reemplazar con llamadas a API reales)
  const fetchSampleExpeditions = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Circuito W Torres del Paine',
            description: 'Recorrido completo por el famoso circuito W de Torres del Paine. Visita las Torres, Valle Francés, Glaciar Grey y más paisajes emblemáticos de la Patagonia chilena.',
            difficulty_level: 'Difícil',
            start_location: {
              id: 1,
              name: 'Puerto Natales, Chile'
            },
            end_location: {
              id: 1,
              name: 'Puerto Natales, Chile'
            },
            duration_days: 5,
            price_per_person: 750,
            currency_code: 'USD',
            average_rating: 4.9,
            total_reviews: 28,
            min_participants: 4,
            max_participants: 10,
            featured_image_url: 'https://www.trekkingchile.com/media/catalogue/route/thumb/torres-del-paine-circuito-w-en-camping.jpg',
            is_available: true,
            upcoming_date: '2025-04-15',
            leader: {
              first_name: 'María',
              last_name: 'González'
            }
          },
          {
            id: 2,
            name: 'Exploración de la Amazonía Venezolana',
            description: 'Aventura en la selva amazónica venezolana, explorando la biodiversidad de la región, navegando por ríos, visitando comunidades indígenas y descubriendo cascadas escondidas.',
            difficulty_level: 'Moderada',
            start_location: {
              id: 7,
              name: 'Puerto Ayacucho, Venezuela'
            },
            end_location: {
              id: 7,
              name: 'Puerto Ayacucho, Venezuela'
            },
            duration_days: 7,
            price_per_person: 980,
            currency_code: 'USD',
            average_rating: 4.7,
            total_reviews: 15,
            min_participants: 4,
            max_participants: 8,
            featured_image_url: 'https://www.veneto.eu/uploads/content/1599127879_amazonas.jpg',
            is_available: true,
            upcoming_date: '2025-06-10',
            leader: {
              first_name: 'Carlos',
              last_name: 'Ramírez'
            }
          },
          {
            id: 3,
            name: 'Travesía a las Cataratas del Iguazú',
            description: 'Expedición para conocer las majestuosas Cataratas del Iguazú desde Argentina y Brasil, recorriendo los senderos del parque nacional y experimentando el poder de la cascada más grande del mundo.',
            difficulty_level: 'Fácil',
            start_location: {
              id: 8,
              name: 'Puerto Iguazú, Argentina'
            },
            end_location: {
              id: 9,
              name: 'Foz do Iguaçu, Brasil'
            },
            duration_days: 4,
            price_per_person: 590,
            currency_code: 'USD',
            average_rating: 4.8,
            total_reviews: 34,
            min_participants: 2,
            max_participants: 15,
            featured_image_url: 'https://media.istockphoto.com/id/535175381/es/foto/cataratas-del-iguaz%C3%BA-visto-desde-argentina.jpg?s=612x612&w=0&k=20&c=v0J2Tg_HM9RD3uF1Fn-ZnxogMcD6Tj8o1wl7RZ0cSCY=',
            is_available: true,
            upcoming_date: '2025-03-22',
            leader: {
              first_name: 'Laura',
              last_name: 'Méndez'
            }
          },
          {
            id: 4,
            name: 'Camino Inca a Machu Picchu',
            description: 'Trekking por el histórico Camino Inca, siguiendo la ruta de los antiguos Incas hasta la ciudadela de Machu Picchu. Atravesarás diversos ecosistemas y visitarás ruinas arqueológicas en el camino.',
            difficulty_level: 'Difícil',
            start_location: {
              id: 10,
              name: 'Cusco, Perú'
            },
            end_location: {
              id: 11,
              name: 'Machu Picchu, Perú'
            },
            duration_days: 4,
            price_per_person: 699,
            currency_code: 'USD',
            average_rating: 4.9,
            total_reviews: 52,
            min_participants: 2,
            max_participants: 16,
            featured_image_url: 'https://andeangreattreks.com/wp-content/uploads/2020/01/inca-trail-to-machu-picchu-4-days.jpg',
            is_available: true,
            upcoming_date: '2025-05-05',
            leader: {
              first_name: 'Javier',
              last_name: 'Quispe'
            }
          },
          {
            id: 5,
            name: 'Travesía por el desierto de Atacama',
            description: 'Expedición por los paisajes lunares del desierto más árido del mundo. Visitarás el Valle de la Luna, el Valle de la Muerte, los géiseres del Tatio, lagunas altiplánicas y más.',
            difficulty_level: 'Moderada',
            start_location: {
              id: 2,
              name: 'San Pedro de Atacama, Chile'
            },
            end_location: {
              id: 2,
              name: 'San Pedro de Atacama, Chile'
            },
            duration_days: 6,
            price_per_person: 850,
            currency_code: 'USD',
            average_rating: 4.6,
            total_reviews: 23,
            min_participants: 4,
            max_participants: 10,
            featured_image_url: 'https://media.istockphoto.com/id/931097150/es/foto/laguna-cejar-chile.jpg?s=612x612&w=0&k=20&c=jTEW70VCOXlnf2-0ePY2-9Vha7CxZHH32fK_VgH4nk0=',
            is_available: false,
            upcoming_date: null,
            leader: {
              first_name: 'Andrea',
              last_name: 'Fuentes'
            }
          },
          {
            id: 6,
            name: 'Exploración Isla de Pascua',
            description: 'Aventura para descubrir los misterios de Rapa Nui, explorando los sitios arqueológicos, moais, volcanes y playas de esta remota isla polinésica en el Pacífico.',
            difficulty_level: 'Moderada',
            start_location: {
              id: 12,
              name: 'Isla de Pascua, Chile'
            },
            end_location: {
              id: 12,
              name: 'Isla de Pascua, Chile'
            },
            duration_days: 5,
            price_per_person: 1200,
            currency_code: 'USD',
            average_rating: 4.9,
            total_reviews: 18,
            min_participants: 4,
            max_participants: 12,
            featured_image_url: 'https://media.istockphoto.com/id/600890314/es/foto/tongariki-isla-de-pascua.jpg?s=612x612&w=0&k=20&c=ey-TrJyYVXlf0GCwAFMBJhKrjchJ7BklkA7aF78PU2A=',
            is_available: true,
            upcoming_date: '2025-07-15',
            leader: {
              first_name: 'Roberto',
              last_name: 'Pakarati'
            }
          }
        ]);
      }, 800);
    });
  };
  
  const fetchSampleLocations = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Puerto Natales, Chile' },
          { id: 2, name: 'San Pedro de Atacama, Chile' },
          { id: 3, name: 'Pucón, Chile' },
          { id: 7, name: 'Puerto Ayacucho, Venezuela' },
          { id: 8, name: 'Puerto Iguazú, Argentina' },
          { id: 9, name: 'Foz do Iguaçu, Brasil' },
          { id: 10, name: 'Cusco, Perú' },
          { id: 11, name: 'Machu Picchu, Perú' },
          { id: 12, name: 'Isla de Pascua, Chile' }
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
    let result = [...expeditions];
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(expedition => 
        expedition.name.toLowerCase().includes(searchLower) ||
        expedition.description.toLowerCase().includes(searchLower) ||
        expedition.start_location.name.toLowerCase().includes(searchLower) ||
        expedition.end_location.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      result = result.filter(expedition => 
        expedition.start_location.id.toString() === filters.location ||
        expedition.end_location.id.toString() === filters.location
      );
    }
    
    // Filtrar por precio mínimo
    if (filters.minPrice) {
      result = result.filter(expedition => 
        expedition.price_per_person >= parseFloat(filters.minPrice)
      );
    }
    
    // Filtrar por precio máximo
    if (filters.maxPrice) {
      result = result.filter(expedition => 
        expedition.price_per_person <= parseFloat(filters.maxPrice)
      );
    }
    
    // Filtrar por dificultad
    if (filters.difficulty) {
      result = result.filter(expedition => 
        expedition.difficulty_level === filters.difficulty
      );
    }
    
    // Filtrar por duración
    if (filters.duration) {
      const durationValue = parseInt(filters.duration);
      
      switch(filters.duration) {
        case '1-3':
          result = result.filter(expedition => expedition.duration_days <= 3);
          break;
        case '4-7':
          result = result.filter(expedition => 
            expedition.duration_days > 3 && expedition.duration_days <= 7
          );
          break;
        case '8-14':
          result = result.filter(expedition => 
            expedition.duration_days > 7 && expedition.duration_days <= 14
          );
          break;
        case '15+':
          result = result.filter(expedition => expedition.duration_days > 14);
          break;
      }
    }
    
    // Filtrar por fecha de inicio
    if (filters.startDate) {
      const selectedDate = new Date(filters.startDate);
      result = result.filter(expedition => {
        if (!expedition.upcoming_date) return false;
        const expeditionDate = new Date(expedition.upcoming_date);
        return expeditionDate >= selectedDate;
      });
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
        result.sort((a, b) => a.duration_days - b.duration_days);
        break;
      case 'duration_desc':
        result.sort((a, b) => b.duration_days - a.duration_days);
        break;
      case 'date_asc':
        result.sort((a, b) => {
          // Poner las expediciones sin fecha al final
          if (!a.upcoming_date) return 1;
          if (!b.upcoming_date) return -1;
          return new Date(a.upcoming_date) - new Date(b.upcoming_date);
        });
        break;
    }
    
    setFilteredExpeditions(result);
  }, [expeditions, filters, sortBy]);
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      difficulty: '',
      duration: '',
      searchTerm: '',
      startDate: ''
    });
    setSortBy('name_asc');
  };
  
  // Manejar toggle de filtros en móvil
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="expeditions-page">
      <Sidebar userRole={userRole} />
      
      <div className="expeditions-content">
        <Navbar />
        
        <div className="expeditions-container">
          <div className="expeditions-header">
            <h1>Expediciones</h1>
            
            {userRole === 'guide' && (
              <Link to="/create-expedition" className="create-expedition-btn">
                <FontAwesomeIcon icon={faPlusCircle} /> Nueva Expedición
              </Link>
            )}
          </div>
          
          <div className="expeditions-actions">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar expediciones..."
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <button className="filter-toggle-btn" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} /> Filtros
            </button>
          </div>
          
          <div className="expeditions-main">
            <div className={`expeditions-filters ${showFilters ? 'show' : ''}`}>
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                  Resetear
                </button>
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
                  <option value="1-3">1 a 3 días</option>
                  <option value="4-7">4 a 7 días</option>
                  <option value="8-14">8 a 14 días</option>
                  <option value="15+">15 días o más</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="startDate">Fecha de inicio (desde)</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
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
                  <option value="date_asc">Fecha de inicio (Próximas primero)</option>
                </select>
              </div>
            </div>
            
            <div className="expeditions-results">
              <div className="results-header">
                <span>
                  {filteredExpeditions.length} {filteredExpeditions.length === 1 ? 'expedición' : 'expediciones'} encontradas
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
                    <option value="date_asc">Próximas fechas</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Cargando expediciones...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <p>{error}</p>
                </div>
              ) : filteredExpeditions.length === 0 ? (
                <div className="no-results">
                  <h3>No se encontraron expediciones</h3>
                  <p>Intenta cambiar los filtros o buscar con otros términos</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
                    Resetear filtros
                  </button>
                </div>
              ) : (
                <div className="expeditions-grid">
                  {filteredExpeditions.map(expedition => (
                    <div className="expedition-card-wrapper" key={expedition.id}>
                      <ExpeditionCard expedition={expedition} />
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

export default Expeditions;