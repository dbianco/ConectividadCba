import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';
import { Entity, Department } from '../../services/api';
import './MapComponent.css';

interface MapComponentProps {
  entities: Entity[];
  departments: Department[];
  selectedEntity: Entity | null;
  onEntitySelect: (entity: Entity | null) => void;
  baseMap: string;
  showDensityContour: boolean;
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
  baseMap,
  showDensityContour
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>();
  const currentTileLayerRef = useRef<L.TileLayer>();
  const contourLayerRef = useRef<L.LayerGroup>();
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

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([-31.5, -64.5], 7);
    markersRef.current = L.layerGroup().addTo(mapRef.current);
    contourLayerRef.current = L.layerGroup().addTo(mapRef.current);

    // Add zoom event listeners
    mapRef.current.on('zoomend', () => {
      if (mapRef.current) {
        updateMarkers(mapRef.current);
      }
    });
    
    // Update contours on zoom and move
    mapRef.current.on('moveend', () => {
      if (mapRef.current && showDensityContour) {
        updateDensityContour();
      }
    });

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array since this should only run once

  // Function to update density contour
  const updateDensityContour = () => {
    if (!mapRef.current || !contourLayerRef.current || !showDensityContour || entities.length === 0) return;
    
    contourLayerRef.current.clearLayers();
    
    try {
      // Create a grid of points for density calculation
      const bounds = mapRef.current.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      
      const width = 100;
      const height = 100;
      const cellSize = (ne.lng - sw.lng) / width;
      const latCellSize = (ne.lat - sw.lat) / height;
      
      const grid = new Array(width * height).fill(0);
      
      // Count entities in each grid cell with gaussian smoothing
      entities.forEach(entity => {
        // Swap lat/lng for proper geographic mapping
        const centerX = (entity.coordinates.lat - sw.lat) / latCellSize;
        const centerY = (entity.coordinates.lng - sw.lng) / cellSize;
        
        // Apply gaussian smoothing around each point
        for (let y = Math.floor(centerY - 3); y <= Math.ceil(centerY + 3); y++) {
          for (let x = Math.floor(centerX - 3); x <= Math.ceil(centerX + 3); x++) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
              const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
              const influence = Math.exp(-distance * distance / 2);
              grid[y * width + x] += influence;
            }
          }
        }
      });

      // Get max value for threshold calculation
      const maxValue = Math.max(...grid);
      
      // Create contours from the grid
      const contours = d3.contours()
        .size([width, height])
        .thresholds(Array.from({ length: 8 }, (_, i) => maxValue * (i + 1) / 10))
        (grid);

      // Convert contours to geographic coordinates
      contours.forEach((contour, i) => {
        const geoJSON = {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: contour.coordinates.map(polygon =>
              polygon.map(ring =>
                ring.map(point => [
                  point[1] * cellSize + sw.lng,
                  point[0] * latCellSize + sw.lat
                ])
              )
            )
          }
        };

        const geoJsonLayer = L.geoJSON(geoJSON as any, {
          style: {
            color: '#1976d2',
            weight: 1,
            fillColor: '#2196f3',
            fillOpacity: Math.min(0.2 + (i * 0.1), 0.8),
            opacity: 0.8
          }
        });
        geoJsonLayer.addTo(contourLayerRef.current!);
      });
    } catch (error) {
      console.error('Error generating contours:', error);
    }
  };

  // Update map layers and markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Update tile layer
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

    // Update markers
    updateMarkers(mapRef.current);

    // Update density contour
    updateDensityContour();
  }, [entities, selectedEntity, baseMap, showDensityContour]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapComponent;
