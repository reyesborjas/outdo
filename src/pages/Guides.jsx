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
  faMedal,
  faExclamationTriangle,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { guideService } from '../utils/api';
import '../styles/Guides.css';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('explorer');
  
  // Filtros
  const [filters, setFilters] = useState({
    guideType: '',
    location: '',
    skill: '',
    certification: '',
    yearsExperience: '',
    searchTerm: ''
  });
  
  // Ordenación
  const [sortBy, setSortBy] = useState('rating_desc');
  
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

  // Cargar guías, habilidades, certificaciones y ubicaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // En un entorno real, estos serían llamados a tu API
        // Por ahora, usamos datos de ejemplo
        
        // Simular carga de guías
        const guidesResponse = await fetchSampleGuides();
        setGuides(guidesResponse);
        setFilteredGuides(guidesResponse);
        
        // Simular carga de habilidades
        const skillsResponse = await fetchSampleSkills();
        setSkills(skillsResponse);
        
        // Simular carga de certificaciones
        const certificationsResponse = await fetchSampleCertifications();
        setCertifications(certificationsResponse);
        
        // Extraer ubicaciones únicas de los guías
        const uniqueLocations = [...new Set(guidesResponse.map(guide => 
          guide.location ? guide.location.name : null).filter(Boolean))];
        setLocations(uniqueLocations.map(name => ({ name })));
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Hubo un problema al cargar los guías. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para simular carga de datos (reemplazar con llamadas a API reales)
  const fetchSampleGuides = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Miguel Sánchez',
            firstName: 'Miguel',
            lastName: 'Sánchez',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            guide_type: 'Master Guide',
            years_of_experience: 12,
            location: {
              id: 1,
              name: 'Torres del Paine, Chile'
            },
            available_for_hire: true,
            skills: [
              { name: 'Trekking', proficiency_level: 5 },
              { name: 'Montañismo', proficiency_level: 5 },
              { name: 'Supervivencia', proficiency_level: 4 },
              { name: 'Primeros Auxilios', proficiency_level: 5 }
            ],
            certifications: [
              { name: 'Guía de Montaña UIAGM', issuing_organization: 'UIAGM' },
              { name: 'Wilderness First Responder', issuing_organization: 'NOLS' },
              { name: 'Guía de Trekking', issuing_organization: 'SERNATUR' }
            ],
            average_rating: 4.9,
            total_reviews: 47,
            total_activities_led: 215,
            total_expeditions_led: 32,
            bio_extended: 'Guía de montaña profesional con más de 12 años de experiencia. Especialista en la Patagonia chilena y argentina. He liderado expediciones a Torres del Paine, Monte Fitz Roy y Cerro Torre, entre otros. Mi objetivo es brindar una experiencia segura, educativa y memorable para los amantes de la naturaleza.'
          },
          {
            id: 2,
            name: 'Camila Rojas',
            firstName: 'Camila',
            lastName: 'Rojas',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
            guide_type: 'Specialized Guide',
            years_of_experience: 8,
            location: {
              id: 2,
              name: 'San Pedro de Atacama, Chile'
            },
            available_for_hire: true,
            skills: [
              { name: 'Sandboarding', proficiency_level: 5 },
              { name: 'Tracking', proficiency_level: 4 },
              { name: 'Geología', proficiency_level: 5 },
              { name: 'Astronomía', proficiency_level: 5 }
            ],
            certifications: [
              { name: 'Guía Turística', issuing_organization: 'SERNATUR' },
              { name: 'Guía Astronómica', issuing_organization: 'Observatorio ALMA' }
            ],
            average_rating: 4.8,
            total_reviews: 36,
            total_activities_led: 172,
            total_expeditions_led: 15,
            bio_extended: 'Especialista en el desierto de Atacama. Ofrezco tours que combinan aventura, geología y astronomía. El desierto de Atacama es único en el mundo y mi pasión es compartir sus secretos con viajeros de todo el mundo. Enfoque en turismo sostenible y respeto por las comunidades locales.'
          },
          {
            id: 3,
            name: 'Antonio Pérez',
            firstName: 'Antonio',
            lastName: 'Pérez',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/43.jpg',
            guide_type: 'Associate Guide',
            years_of_experience: 4,
            location: {
              id: 3,
              name: 'Pucón, Chile'
            },
            available_for_hire: true,
            skills: [
              { name: 'Rafting', proficiency_level: 5 },
              { name: 'Kayak', proficiency_level: 4 },
              { name: 'Canopy', proficiency_level: 4 },
              { name: 'Primeros Auxilios', proficiency_level: 3 }
            ],
            certifications: [
              { name: 'Guía de Rafting', issuing_organization: 'IRF' },
              { name: 'Primeros Auxilios', issuing_organization: 'Cruz Roja' }
            ],
            average_rating: 4.6,
            total_reviews: 22,
            total_activities_led: 95,
            total_expeditions_led: 5,
            bio_extended: 'Apasionado por los deportes acuáticos y la adrenalina. Especializado en rafting en los ríos de la región de la Araucanía. Comprometido con la seguridad de mis grupos y con hacer que cada aventura sea inolvidable.'
          },
          {
            id: 4,
            name: 'Valentina Medina',
            firstName: 'Valentina',
            lastName: 'Medina',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
            guide_type: 'Master Guide',
            years_of_experience: 15,
            location: {
              id: 4,
              name: 'Puerto Natales, Chile'
            },
            available_for_hire: true,
            skills: [
              { name: 'Trekking', proficiency_level: 5 },
              { name: 'Montañismo', proficiency_level: 5 },
              { name: 'Fotografía', proficiency_level: 5 },
              { name: 'Supervivencia', proficiency_level: 5 },
              { name: 'Primeros Auxilios', proficiency_level: 5 }
            ],
            certifications: [
              { name: 'Guía de Montaña UIAGM', issuing_organization: 'UIAGM' },
              { name: 'Wilderness First Responder', issuing_organization: 'NOLS' },
              { name: 'Guía Fotográfica', issuing_organization: 'Nat Geo' }
            ],
            average_rating: 5.0,
            total_reviews: 64,
            total_activities_led: 298,
            total_expeditions_led: 48,
            bio_extended: 'Quince años guiando en la Patagonia me han enseñado a respetar y amar esta tierra. Combino aventura con fotografía para que los viajeros no solo vivan la experiencia sino que también puedan capturarla. Mi especialidad es el Circuito W y O de Torres del Paine.'
          },
          {
            id: 5,
            name: 'Carlos Mendoza',
            firstName: 'Carlos',
            lastName: 'Mendoza',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/53.jpg',
            guide_type: 'Specialized Guide',
            years_of_experience: 9,
            location: {
              id: 5,
              name: 'Barinas, Venezuela'
            },
            available_for_hire: true,
            skills: [
              { name: 'Rafting', proficiency_level: 5 },
              { name: 'Kayak', proficiency_level: 5 },
              { name: 'Ornitología', proficiency_level: 4 },
              { name: 'Primeros Auxilios', proficiency_level: 4 }
            ],
            certifications: [
              { name: 'Guía de Rafting', issuing_organization: 'IRF' },
              { name: 'Ornitólogo Certificado', issuing_organization: 'ONFV' }
            ],
            average_rating: 4.7,
            total_reviews: 31,
            total_activities_led: 142,
            total_expeditions_led: 18,
            bio_extended: 'Experto en los ríos venezolanos con foco en el avistamiento de aves durante las expediciones de rafting. Combinamos la adrenalina del descenso de ríos con la tranquilidad de observar la rica avifauna de Venezuela.'
          },
          {
            id: 6,
            name: 'María Toro',
            firstName: 'María',
            lastName: 'Toro',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/38.jpg',
            guide_type: 'Associate Guide',
            years_of_experience: 3,
            location: {
              id: 6,
              name: 'Cusco, Perú'
            },
            available_for_hire: true,
            skills: [
              { name: 'Trekking', proficiency_level: 4 },
              { name: 'Historia Inca', proficiency_level: 5 },
              { name: 'Primeros Auxilios', proficiency_level: 4 }
            ],
            certifications: [
              { name: 'Guía Oficial Camino Inca', issuing_organization: 'DIRCETUR' },
              { name: 'Primeros Auxilios', issuing_organization: 'Cruz Roja' }
            ],
            average_rating: 4.5,
            total_reviews: 18,
            total_activities_led: 62,
            total_expeditions_led: 8,
            bio_extended: 'Cusqueña de nacimiento, apasionada por compartir la historia y cultura inca. Especializada en el Camino Inca a Machu Picchu y otras rutas ancestrales. Comprometida con el turismo sostenible y el respeto a las comunidades andinas.'
          },
          {
            id: 7,
            name: 'Pablo Herrera',
            firstName: 'Pablo',
            lastName: 'Herrera',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
            guide_type: 'Master Guide',
            years_of_experience: 20,
            location: {
              id: 7,
              name: 'Isla de Pascua, Chile'
            },
            available_for_hire: true,
            skills: [
              { name: 'Buceo', proficiency_level: 5 },
              { name: 'Historia Rapa Nui', proficiency_level: 5 },
              { name: 'Navegación', proficiency_level: 5 },
              { name: 'Primeros Auxilios', proficiency_level: 5 }
            ],
            certifications: [
              { name: 'PADI Divemaster', issuing_organization: 'PADI' },
              { name: 'Capitán de Embarcaciones', issuing_organization: 'Marina de Chile' },
              { name: 'Guía Patrimonio Cultural', issuing_organization: 'UNESCO' }
            ],
            average_rating: 4.9,
            total_reviews: 52,
            total_activities_led: 263,
            total_expeditions_led: 38,
            bio_extended: 'Isleño de nacimiento, llevo dos décadas compartiendo los secretos y la historia de Rapa Nui. Ofrezco una perspectiva única que combina el conocimiento ancestral con la aventura. Especialista en expediciones de buceo alrededor de la isla y tours culturales.'
          },
          {
            id: 8,
            name: 'Laura Gómez',
            firstName: 'Laura',
            lastName: 'Gómez',
            profileImageUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
            guide_type: 'Specialized Guide',
            years_of_experience: 7,
            location: {
              id: 8,
              name: 'Puerto Iguazú, Argentina'
            },
            available_for_hire: true,
            skills: [
              { name: 'Trekking', proficiency_level: 4 },
              { name: 'Botánica', proficiency_level: 5 },
              { name: 'Fotografía', proficiency_level: 4 },
              { name: 'Primeros Auxilios', proficiency_level: 4 }
            ],
            certifications: [
              { name: 'Guía Parques Nacionales', issuing_organization: 'APN Argentina' },
              { name: 'Botánica Especializada', issuing_organization: 'Universidad Buenos Aires' }
            ],
            average_rating: 4.8,
            total_reviews: 29,
            total_activities_led: 134,
            total_expeditions_led: 12,
            bio_extended: 'Bióloga y guía especializada en la flora y fauna de la selva misionera. Ofrezco tours educativos en las Cataratas del Iguazú y la selva circundante, enfocados en la biodiversidad y conservación de este ecosistema único.'
          }
        ]);
      }, 800);
    });
  };
  
  const fetchSampleSkills = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Trekking' },
          { id: 2, name: 'Montañismo' },
          { id: 3, name: 'Supervivencia' },
          { id: 4, name: 'Primeros Auxilios' },
          { id: 5, name: 'Sandboarding' },
          { id: 6, name: 'Tracking' },
          { id: 7, name: 'Geología' },
          { id: 8, name: 'Astronomía' },
          { id: 9, name: 'Rafting' },
          { id: 10, name: 'Kayak' },
          { id: 11, name: 'Canopy' },
          { id: 12, name: 'Fotografía' },
          { id: 13, name: 'Historia Inca' },
          { id: 14, name: 'Buceo' },
          { id: 15, name: 'Historia Rapa Nui' },
          { id: 16, name: 'Navegación' },
          { id: 17, name: 'Botánica' },
          { id: 18, name: 'Ornitología' }
        ]);
      }, 500);
    });
  };
  
  const fetchSampleCertifications = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Guía de Montaña UIAGM', issuing_organization: 'UIAGM' },
          { id: 2, name: 'Wilderness First Responder', issuing_organization: 'NOLS' },
          { id: 3, name: 'Guía de Trekking', issuing_organization: 'SERNATUR' },
          { id: 4, name: 'Guía Turística', issuing_organization: 'SERNATUR' },
          { id: 5, name: 'Guía Astronómica', issuing_organization: 'Observatorio ALMA' },
          { id: 6, name: 'Guía de Rafting', issuing_organization: 'IRF' },
          { id: 7, name: 'Primeros Auxilios', issuing_organization: 'Cruz Roja' },
          { id: 8, name: 'Guía Fotográfica', issuing_organization: 'Nat Geo' },
          { id: 9, name: 'Ornitólogo Certificado', issuing_organization: 'ONFV' },
          { id: 10, name: 'Guía Oficial Camino Inca', issuing_organization: 'DIRCETUR' },
          { id: 11, name: 'PADI Divemaster', issuing_organization: 'PADI' },
          { id: 12, name: 'Capitán de Embarcaciones', issuing_organization: 'Marina de Chile' },
          { id: 13, name: 'Guía Patrimonio Cultural', issuing_organization: 'UNESCO' },
          { id: 14, name: 'Guía Parques Nacionales', issuing_organization: 'APN Argentina' },
          { id: 15, name: 'Botánica Especializada', issuing_organization: 'Universidad Buenos Aires' }
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
    let result = [...guides];
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(guide => 
        guide.name.toLowerCase().includes(searchLower) ||
        guide.bio_extended.toLowerCase().includes(searchLower) ||
        (guide.location && guide.location.name.toLowerCase().includes(searchLower)) ||
        guide.skills.some(skill => skill.name.toLowerCase().includes(searchLower)) ||
        guide.certifications.some(cert => cert.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por tipo de guía
    if (filters.guideType) {
      result = result.filter(guide => 
        guide.guide_type === filters.guideType
      );
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      result = result.filter(guide => 
        guide.location && guide.location.name === filters.location
      );
    }
    
    // Filtrar por habilidad
    if (filters.skill) {
      result = result.filter(guide => 
        guide.skills.some(skill => skill.name === filters.skill)
      );
    }
    
    // Filtrar por certificación
    if (filters.certification) {
      result = result.filter(guide => 
        guide.certifications.some(cert => cert.name === filters.certification)
      );
    }
    
    // Filtrar por años de experiencia
    if (filters.yearsExperience) {
      const [min, max] = filters.yearsExperience.split('-').map(Number);
      if (max) {
        result = result.filter(guide => 
          guide.years_of_experience >= min && guide.years_of_experience <= max
        );
      } else {
        // Caso para "10+" años
        result = result.filter(guide => 
          guide.years_of_experience >= min
        );
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
      case 'rating_desc':
        result.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'experience_desc':
        result.sort((a, b) => b.years_of_experience - a.years_of_experience);
        break;
      case 'activities_desc':
        result.sort((a, b) => (b.total_activities_led + b.total_expeditions_led) - (a.total_activities_led + a.total_expeditions_led));
        break;
      case 'reviews_desc':
        result.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
    }
    
    setFilteredGuides(result);
  }, [guides, filters, sortBy]);
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      guideType: '',
      location: '',
      skill: '',
      certification: '',
      yearsExperience: '',
      searchTerm: ''
    });
    setSortBy('rating_desc');
  };
  
  // Manejar toggle de filtros en móvil
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
  
  return (
    <div className="guides-page">
      <Sidebar userRole={userRole} />
      
      <div className="guides-content">
        <Navbar />
        
        <div className="guides-container">
          <div className="guides-header">
            <h1>Guías</h1>
          </div>
          
          <div className="guides-actions">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar guías por nombre, habilidades, certificaciones..."
                value={filters.searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <button className="filter-toggle-btn" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} /> Filtros
            </button>
          </div>
          
          <div className="guides-main">
            <div className={`guides-filters ${showFilters ? 'show' : ''}`}>
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                  Resetear
                </button>
              </div>
              
              <div className="filter-group">
                <label htmlFor="guideType">Tipo de Guía</label>
                <select
                  id="guideType"
                  name="guideType"
                  value={filters.guideType}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Master Guide">Master Guide</option>
                  <option value="Specialized Guide">Specialized Guide</option>
                  <option value="Associate Guide">Associate Guide</option>
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
                  {locations.map((location, index) => (
                    <option key={index} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="skill">Habilidad</label>
                <select
                  id="skill"
                  name="skill"
                  value={filters.skill}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las habilidades</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="certification">Certificación</label>
                <select
                  id="certification"
                  name="certification"
                  value={filters.certification}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas las certificaciones</option>
                  {certifications.map(cert => (
                    <option key={cert.id} value={cert.name}>
                      {cert.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="yearsExperience">Años de experiencia</label>
                <select
                  id="yearsExperience"
                  name="yearsExperience"
                  value={filters.yearsExperience}
                  onChange={handleFilterChange}
                >
                  <option value="">Cualquier experiencia</option>
                  <option value="0-2">0-2 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="6-10">6-10 años</option>
                  <option value="10">+10 años</option>
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
                  <option value="rating_desc">Mejor valorados</option>
                  <option value="name_asc">Nombre (A-Z)</option>
                  <option value="name_desc">Nombre (Z-A)</option>
                  <option value="experience_desc">Más experiencia</option>
                  <option value="activities_desc">Más actividades/expediciones</option>
                  <option value="reviews_desc">Más reseñas</option>
                </select>
              </div>
            </div>
            
            <div className="guides-results">
              <div className="results-header">
                <span>
                  {filteredGuides.length} {filteredGuides.length === 1 ? 'guía' : 'guías'} encontrados
                </span>
                <div className="sort-mobile">
                  <FontAwesomeIcon icon={faSort} />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="rating_desc">Valoración ↓</option>
                    <option value="name_asc">Nombre (A-Z)</option>
                    <option value="name_desc">Nombre (Z-A)</option>
                    <option value="experience_desc">Experiencia ↓</option>
                    <option value="activities_desc">Actividades ↓</option>
                    <option value="reviews_desc">Reseñas ↓</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Cargando guías...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <p>{error}</p>
                </div>
              ) : filteredGuides.length === 0 ? (
                <div className="no-results">
                  <h3>No se encontraron guías</h3>
                  <p>Intenta cambiar los filtros o buscar con otros términos</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                  >
                    Resetear filtros
                  </button>
                </div>
              ) : (
                <div className="guides-grid">
                  {filteredGuides.map(guide => (
                    <div className="guide-card" key={guide.id}>
                      <div className="guide-header">
                        <div className="guide-badge">
                          {guide.guide_type === 'Master Guide' && (
                            <span className="badge badge-master">
                              <FontAwesomeIcon icon={faMedal} /> Master Guide
                            </span>
                          )}
                          {guide.guide_type === 'Specialized Guide' && (
                            <span className="badge badge-specialized">
                              <FontAwesomeIcon icon={faShieldAlt} /> Specialized
                            </span>
                          )}
                          {guide.guide_type === 'Associate Guide' && (
                            <span className="badge badge-associate">
                              <FontAwesomeIcon icon={faUser} /> Associate
                            </span>
                          )}
                        </div>
                        <div className="guide-avatar">
                          <img 
                            src={guide.profileImageUrl} 
                            alt={guide.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Guía';
                            }}
                          />
                        </div>
                        <div className="guide-info">
                          <h3>{guide.name}</h3>
                          <div className="guide-meta">
                            <span className="years-experience">
                              <strong>{guide.years_of_experience}</strong> años de experiencia
                            </span>
                            {guide.location && (
                              <span className="location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {guide.location.name}
                              </span>
                            )}
                          </div>
                          <div className="guide-rating">
                            {renderStars(guide.average_rating)}
                            <span className="reviews-count">
                              ({guide.total_reviews} reseñas)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="guide-stats">
                        <div className="stat">
                          <div className="stat-value">{guide.total_activities_led}</div>
                          <div className="stat-label">Actividades</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">{guide.total_expeditions_led}</div>
                          <div className="stat-label">Expediciones</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">
                            {guide.available_for_hire ? 
                              <span className="available">Disponible</span> : 
                              <span className="unavailable">No disponible</span>
                            }
                          </div>
                          <div className="stat-label">Estado</div>
                        </div>
                      </div>
                      
                      <div className="guide-skills">
                        <h4>Principales habilidades</h4>
                        <ul className="skills-list">
                          {guide.skills.slice(0, 4).map((skill, index) => (
                            <li key={index} className="skill-item">
                              <div className="skill-name">{skill.name}</div>
                              {renderSkillLevel(skill.proficiency_level)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="guide-certifications">
                        <h4>Certificaciones</h4>
                        <div className="certifications-tags">
                          {guide.certifications.map((cert, index) => (
                            <span key={index} className="certification-tag" title={`Otorgado por: ${cert.issuing_organization}`}>
                              <FontAwesomeIcon icon={faShieldAlt} /> {cert.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="guide-bio">
                        <p>{guide.bio_extended.substring(0, 150)}...</p>
                      </div>
                      
                      <div className="guide-footer">
                        <Link to={`/guides/${guide.id}`} className="guide-profile-btn">
                          Ver perfil completo
                        </Link>
                        {guide.available_for_hire && (
                          <Link to={`/contact-guide/${guide.id}`} className="contact-guide-btn">
                            Contactar
                          </Link>
                        )}
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

export default Guides;