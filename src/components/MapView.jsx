import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import '../styles/MapView.css';

const MapView = ({ tripId = null, defaultLat = -33.4489, defaultLon = -70.6693, defaultZoom = 5 }) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Sample locations - in a real app, fetch these from an API based on tripId
    const activityLocations = [
      { id: 1, name: 'Torres del Paine', lat: -51.0, lon: -73.0, type: 'hiking' },
      { id: 2, name: 'San Pedro de Atacama', lat: -22.9, lon: -68.2, type: 'sandboarding' },
      { id: 3, name: 'Pucon', lat: -39.27, lon: -71.98, type: 'canopy' },
      { id: 4, name: 'Río Barinas', lat: 8.6, lon: -70.2, type: 'rafting' },
      { id: 5, name: 'Machu Picchu', lat: -13.16, lon: -72.54, type: 'trekking' }
    ];

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Create vector source and layer for markers
      const vectorSource = new VectorSource();
      
      // Add activity locations to the map
      activityLocations.forEach(location => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([location.lon, location.lat])),
          name: location.name,
          type: location.type,
          id: location.id
        });
        
        // Style for the marker based on activity type
        const iconStyle = new Style({
          image: new Icon({
            src: `https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/geo-alt-fill.svg`,
            scale: 1.5,
            color: getColorForActivityType(location.type)
          })
        });
        
        feature.setStyle(iconStyle);
        vectorSource.addFeature(feature);
      });
      
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      
      // Create map
      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([defaultLon, defaultLat]),
          zoom: defaultZoom
        })
      });
      
      // Add popup functionality
      const container = document.createElement('div');
      container.className = 'ol-popup';
      
      const content = document.createElement('div');
      content.className = 'ol-popup-content';
      container.appendChild(content);
      
      const closer = document.createElement('a');
      closer.className = 'ol-popup-closer';
      closer.href = '#';
      container.appendChild(closer);
      
      const overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      
      mapInstanceRef.current.addOverlay(overlay);
      
      // Display popup on click
      mapInstanceRef.current.on('click', function(evt) {
        const feature = mapInstanceRef.current.forEachFeatureAtPixel(evt.pixel, function(feature) {
          return feature;
        });
        
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          content.innerHTML = `
            <h4>${feature.get('name')}</h4>
            <p>Tipo: ${feature.get('type')}</p>
            <a href="/activities/${feature.get('id')}">Ver detalles</a>
          `;
          
          overlay.setPosition(coordinates);
        } else {
          overlay.setPosition(undefined);
        }
      });
      
      // Close popup when X is clicked
      closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      
      // Change cursor on hover
      mapInstanceRef.current.on('pointermove', function(evt) {
        const pixel = mapInstanceRef.current.getEventPixel(evt.originalEvent);
        const hit = mapInstanceRef.current.hasFeatureAtPixel(pixel);
        mapInstanceRef.current.getViewport().style.cursor = hit ? 'pointer' : '';
      });
    }
    
    // If tripId changes, update the map view
    if (tripId) {
      // In a real app, fetch trip location data and update the map
      console.log(`Fetching trip data for ID: ${tripId}`);
      // Simulating focusing on a specific location
      const selectedTrip = activityLocations.find(loc => loc.id === parseInt(tripId, 10));
      
      if (selectedTrip) {
        mapInstanceRef.current.getView().animate({
          center: fromLonLat([selectedTrip.lon, selectedTrip.lat]),
          zoom: 10,
          duration: 1000
        });
      }
    }
    
    // Cleanup
    return () => {
      // We don't destroy the map on unmount to avoid unnecessary re-creation
      // But in a production app, you might want to: mapInstanceRef.current.setTarget(null);
    };
  }, [tripId, defaultLat, defaultLon, defaultZoom]);
  
  // Helper function to get color based on activity type
  const getColorForActivityType = (type) => {
    const colorMap = {
      hiking: '#3d7e78',
      trekking: '#3d7e78',
      rafting: '#2980b9',
      sandboarding: '#e88c24',
      canopy: '#27ae60',
      default: '#0a2d2b'
    };
    
    return colorMap[type] || colorMap.default;
  };
  
  return (
    <div className="map-component">
      <div ref={mapRef} className="map-container"></div>
    </div>
  );
};

export default MapView;