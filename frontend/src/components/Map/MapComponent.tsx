import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Entity, Department } from '../../services/api';
import './MapComponent.css';

interface MapComponentProps {
  entities: Entity[];
  departments: Department[];
  selectedEntity: Entity | null;
  onEntitySelect: (entity: Entity | null) => void;
  baseMap: string;
}

interface DepartmentGroup {
  center: [number, number];
  entities: Entity[];
  department: Department;
}

const MapComponent: React.FC<MapComponentProps> = ({
  entities,
  departments,
  selectedEntity,
  onEntitySelect,
  baseMap
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>();
  const currentTileLayerRef = useRef<L.TileLayer>();
  const ZOOM_THRESHOLD = 8; // Zoom level at which to switch between grouped and individual markers

  // Group entities by department
  const groupByDepartment = (): DepartmentGroup[] => {
    const groups: DepartmentGroup[] = [];
    
    departments.forEach(dept => {
      const departmentEntities = entities.filter(e => e.departmentId === dept.id);
      if (departmentEntities.length > 0) {
        // Calculate center point of all entities in the department
        const lats = departmentEntities.map(e => e.coordinates.lat);
        const lngs = departmentEntities.map(e => e.coordinates.lng);
        const centerLat = lats.reduce((a, b) => a + b) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b) / lngs.length;

        groups.push({
          center: [centerLat, centerLng],
          entities: departmentEntities,
          department: dept
        });
      }
    });

    return groups;
  };

  // Update markers based on zoom level
  const updateMarkers = (map: L.Map) => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    const currentZoom = map.getZoom();
    
    if (currentZoom < ZOOM_THRESHOLD) {
      // Show department groups
      const groups = groupByDepartment();
      groups.forEach(group => {
        const marker = L.circleMarker(
          group.center,
          {
            radius: Math.min(Math.max(12, Math.sqrt(group.entities.length) * 4), 25),
            fillColor: '#2196f3',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
          }
        );

        // Calculate counts for schools and learning centers
        const schoolCount = group.entities.filter(e => e.type === 'SCHOOL').length;
        const centerCount = group.entities.filter(e => e.type === 'LEARNING_CENTER').length;

        marker.bindTooltip(
          `<strong>${group.department.name}</strong><br/>
          ${schoolCount} Escuelas<br/>
          ${centerCount} Centros de Aprendizaje`,
          { direction: 'top', offset: [0, -10] }
        );

        marker.on('click', () => {
          map.setView(group.center, ZOOM_THRESHOLD + 1);
        });

        marker.on('mouseover', () => {
          marker.setStyle({ fillOpacity: 0.9 });
        });

        marker.on('mouseout', () => {
          marker.setStyle({ fillOpacity: 0.7 });
        });

        marker.addTo(markersRef.current!);
      });
    } else {
      // Show individual markers
      entities.forEach(entity => {
        const marker = L.circleMarker(
          [entity.coordinates.lat, entity.coordinates.lng],
          {
            radius: selectedEntity?.id === entity.id ? 8 : 6,
            fillColor: entity.type === 'SCHOOL' ? '#ff6b6b' : '#4ecdc4',
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }
        );

        marker.on('click', () => {
          onEntitySelect(entity);
        });

        marker.on('mouseover', () => {
          marker.setStyle({
            radius: 8,
            fillOpacity: 1
          });

          marker.bindTooltip(
            `<strong>${entity.name}</strong><br/>
            ${entity.type === 'SCHOOL' ? 'Escuela' : 'Espacio ABC'}<br/>
            ${departments.find(d => d.id === entity.departmentId)?.name}<br/>
            Conexión: ${entity.connectionType}`,
            { direction: 'top', offset: [0, -10] }
          ).openTooltip();
        });

        marker.on('mouseout', () => {
          marker.setStyle({
            radius: selectedEntity?.id === entity.id ? 8 : 6,
            fillOpacity: 0.8
          });
          marker.closeTooltip();
        });

        marker.addTo(markersRef.current!);
      });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-31.5, -64.5], 7);
      markersRef.current = L.layerGroup().addTo(mapRef.current);

      // Add zoom event listener
      mapRef.current.on('zoomend', () => {
        if (mapRef.current) {
          updateMarkers(mapRef.current);
        }
      });
    }

    // Update tile layer based on baseMap selection
    if (currentTileLayerRef.current) {
      mapRef.current.removeLayer(currentTileLayerRef.current);
    }

    let tileLayer;
    switch (baseMap) {
      case 'imagery':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });
        break;
      case 'light-gray':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        });
        break;
      case 'street-map':
      default:
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        });
        break;
    }

    currentTileLayerRef.current = tileLayer;
    tileLayer.addTo(mapRef.current);

    // Load and display GeoJSON data for departments
    fetch('/data/cordoba.json')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#2196f3',
            weight: 1,
            fillOpacity: 0.1,
            fillColor: '#e3f2fd'
          }
        }).addTo(mapRef.current!);
      })
      .catch(error => {
        console.error('Error loading map data:', error);
      });

    // Update markers
    if (mapRef.current) {
      updateMarkers(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [entities, departments, selectedEntity, baseMap, onEntitySelect]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapComponent;
