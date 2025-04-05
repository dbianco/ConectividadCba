import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { Entity, Department } from '../../services/api';
import './MapComponent.css';

interface Cluster {
  center: [number, number];
  entities: Entity[];
}

interface MapComponentProps {
  entities: Entity[];
  departments: Department[];
  selectedEntity: Entity | null;
  onEntitySelect: (entity: Entity | null) => void;
  baseMap: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  entities, 
  departments,
  selectedEntity, 
  onEntitySelect,
  baseMap
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [currentTransform, setCurrentTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; entity: Entity | null }>({
    x: 0,
    y: 0,
    entity: null,
  });

  // Load GeoJSON data
  useEffect(() => {
    d3.json('/data/cordoba.json')
      .then((data) => {
        setMapData(data);
      })
      .catch((error) => {
        console.error('Error loading map data:', error);
      });
  }, []);

  // Render map
  useEffect(() => {
    if (!mapData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create projection centered on Córdoba
    const projection = geoMercator()
      .center([-64.5, -31.5]) // Adjusted center to cover more of the province
      .scale(10000)
      .translate([width / 2, height / 2]);

    // Create path generator
    const pathGenerator = geoPath().projection(projection);

    // Create map group
    const mapGroup = svg.append('g');

    // Apply base map style
    let fillColor = '#f0f0f0';
    let strokeColor = '#333';
    
    switch (baseMap) {
      case 'imagery':
        fillColor = '#a8d5e5';
        strokeColor = '#ffffff';
        break;
      case 'light-gray':
        fillColor = '#e8e8e8';
        strokeColor = '#cccccc';
        break;
      case 'street-map':
      default:
        fillColor = '#f0f0f0';
        strokeColor = '#333';
        break;
    }

    // Draw department boundaries
    mapGroup
      .selectAll('path.department')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('class', 'department')
      .attr('d', pathGenerator as any)
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.5)
      .append('title')
      .text((d: any) => d.properties.departamento);

    // Add department labels
    mapGroup
      .selectAll('text.department-label')
      .data(mapData.features)
      .enter()
      .append('text')
      .attr('class', 'department-label')
      .attr('transform', (d: any) => {
        const centroid = pathGenerator.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('fill', '#333')
      .text((d: any) => d.properties.departamento);

    // Function to cluster nearby entities with zoom-aware radius
    const clusterEntities = (entities: Entity[], baseRadius: number, transform: d3.ZoomTransform): Cluster[] => {
      // Adjust clustering radius based on zoom scale, with a minimum radius
      const radius = Math.max(baseRadius / transform.k, 10);
      const clusters: Cluster[] = [];
      const processed = new Set<number>();

      entities.forEach((entity) => {
        if (processed.has(entity.id)) return;

        const entityCoords = projection([entity.coordinates.lng, entity.coordinates.lat]) || [0, 0];
        let nearbyEntities = [entity];
        let sumX = entityCoords[0];
        let sumY = entityCoords[1];

        entities.forEach((other) => {
          if (other.id === entity.id || processed.has(other.id)) return;

          const otherCoords = projection([other.coordinates.lng, other.coordinates.lat]) || [0, 0];
          const distance = Math.sqrt(
            Math.pow(entityCoords[0] - otherCoords[0], 2) +
            Math.pow(entityCoords[1] - otherCoords[1], 2)
          );

          if (distance <= radius) {
            nearbyEntities.push(other);
            sumX += otherCoords[0];
            sumY += otherCoords[1];
            processed.add(other.id);
          }
        });

        // Calculate centroid of all points in cluster
        const centerX = sumX / nearbyEntities.length;
        const centerY = sumY / nearbyEntities.length;

        processed.add(entity.id);
        clusters.push({
          center: [centerX, centerY],
          entities: nearbyEntities
        });
      });

      return clusters;
    };

    // Add entities and clusters
    const entitiesGroup = svg.append('g');
    const clusters = clusterEntities(entities, 15, currentTransform); // 15px base radius

    const markers = entitiesGroup
      .selectAll('g.marker')
      .data(clusters)
      .enter()
      .append('g')
      .attr('class', 'marker')
      .attr('transform', d => `translate(${d.center[0]},${d.center[1]})`);

    // Add circle for each marker with dynamic sizing based on cluster size
    markers
      .append('circle')
      .attr('r', d => {
        if (d.entities.length === 1) return 5;
        // Dynamic radius based on number of entities, with a minimum and maximum
        return Math.min(Math.max(8, Math.sqrt(d.entities.length) * 5), 20);
      })
      .attr('fill', d => {
        if (d.entities.length > 1) {
          // Calculate mix of colors based on entity types in cluster
          const schoolCount = d.entities.filter(e => e.type === 'SCHOOL').length;
          const ratio = schoolCount / d.entities.length;
          return d3.interpolateRgb('#ff6b6b', '#4ecdc4')(ratio);
        }
        return d.entities[0].type === 'SCHOOL' ? '#ff6b6b' : '#4ecdc4';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', d => {
        const isSelected = d.entities.length === 1 && 
          selectedEntity && 
          selectedEntity.id === d.entities[0].id;
        return isSelected ? 1 : 0.8;
      });

    // Add count label for clusters
    markers
      .filter(d => d.entities.length > 1)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .text(d => d.entities.length);

    // Add interactions
    markers
      .on('mouseover', (event, d) => {
        const marker = d3.select(event.currentTarget);
        marker.select('circle')
          .attr('r', d.entities.length > 1 ? 10 : 8)
          .attr('opacity', 1);

        // Always show tooltip at bottom right
        setTooltip({
          x: window.innerWidth,
          y: window.innerHeight,
              entity: d.entities.length === 1 ? d.entities[0] : {
                id: -1,
                name: `Grupo de ${d.entities.length} entidades`,
                type: 'SCHOOL',
                coordinates: { lat: 0, lng: 0 },
                description: d.entities.length > 1 
                  ? Object.entries(d.entities.reduce((acc, e) => {
                      acc[e.type] = (acc[e.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>))
                    .map(([type, count]) => `${count} ${type === 'SCHOOL' ? 'Escuelas' : 'Espacios ABC'}`)
                    .join('\n')
                  : '',
                departmentId: d.entities[0].departmentId,
                connectionType: 'Múltiple'
          }
        });
      })
      .on('mouseout', (event, d) => {
        const marker = d3.select(event.currentTarget);
        marker.select('circle')
          .attr('r', d.entities.length > 1 ? 8 : 5)
          .attr('opacity', d.entities.length === 1 && selectedEntity?.id === d.entities[0].id ? 1 : 0.7);

        setTooltip({
          x: 0,
          y: 0,
          entity: null,
        });
      })
      .on('click', (_, d) => {
        if (d.entities.length === 1) {
          onEntitySelect(d.entities[0]);
        } else {
          // For clusters, we might want to zoom in instead of selecting
          const bounds = d3.select(svgRef.current)
            .transition()
            .duration(750)
            .call(
              zoom.transform as any,
              d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(2)
                .translate(-d.center[0], -d.center[1])
            );
        }
      });

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 8])
      .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform);
        entitiesGroup.attr('transform', event.transform);
        
        // Update current transform and re-cluster entities
        setCurrentTransform(event.transform);
        
        // Re-cluster and update markers
        const newClusters = clusterEntities(entities, 15, event.transform);
        
        // Remove existing markers
        entitiesGroup.selectAll('g.marker').remove();
        
        // Create new markers
        const newMarkers = entitiesGroup
          .selectAll('g.marker')
          .data(newClusters)
          .enter()
          .append('g')
          .attr('class', 'marker')
          .attr('transform', d => `translate(${d.center[0]},${d.center[1]})`);

        // Add circles with dynamic sizing
        newMarkers
          .append('circle')
          .attr('r', d => {
            if (d.entities.length === 1) return 5;
            // Dynamic radius based on number of entities, with a minimum and maximum
            return Math.min(Math.max(8, Math.sqrt(d.entities.length) * 5), 20);
          })
          .attr('fill', d => {
            if (d.entities.length > 1) {
              // Calculate mix of colors based on entity types in cluster
              const schoolCount = d.entities.filter(e => e.type === 'SCHOOL').length;
              const ratio = schoolCount / d.entities.length;
              return d3.interpolateRgb('#ff6b6b', '#4ecdc4')(ratio);
            }
            return d.entities[0].type === 'SCHOOL' ? '#ff6b6b' : '#4ecdc4';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('opacity', d => {
            const isSelected = d.entities.length === 1 && 
              selectedEntity && 
              selectedEntity.id === d.entities[0].id;
            return isSelected ? 1 : 0.8;
          });

        // Add count labels
        newMarkers
          .filter(d => d.entities.length > 1)
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .attr('fill', '#fff')
          .attr('font-size', '10px')
          .text(d => d.entities.length);

        // Re-add interactions
        newMarkers
          .on('mouseover', (event, d) => {
            const marker = d3.select(event.currentTarget);
            marker.select('circle')
              .attr('r', d.entities.length > 1 ? 10 : 8)
              .attr('opacity', 1);

            // Always show tooltip at bottom right
            setTooltip({
              x: window.innerWidth,
              y: window.innerHeight,
              entity: d.entities.length === 1 ? d.entities[0] : {
                id: -1,
                name: `Grupo de ${d.entities.length} entidades`,
                type: 'SCHOOL',
                coordinates: { lat: 0, lng: 0 },
                description: d.entities.length > 1 
                  ? Object.entries(d.entities.reduce((acc, e) => {
                      acc[e.type] = (acc[e.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>))
                    .map(([type, count]) => `${count} ${type === 'SCHOOL' ? 'Escuelas' : 'Centros'}`)
                    .join('\n')
                  : '',
                departmentId: d.entities[0].departmentId,
                connectionType: 'Múltiple'
              }
            });
          })
          .on('mouseout', (event, d) => {
            const marker = d3.select(event.currentTarget);
            marker.select('circle')
              .attr('r', d.entities.length > 1 ? 8 : 5)
              .attr('opacity', d.entities.length === 1 && selectedEntity?.id === d.entities[0].id ? 1 : 0.7);

            setTooltip({
              x: 0,
              y: 0,
              entity: null,
            });
          })
          .on('click', (_, d) => {
            if (d.entities.length === 1) {
              onEntitySelect(d.entities[0]);
            } else {
              // For clusters, zoom in
              svg.transition()
                .duration(750)
                .call(
                  zoom.transform as any,
                  d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(currentTransform.k * 2)
                    .translate(-d.center[0], -d.center[1])
                );
            }
          });
      });

    svg.call(zoom as any);

  }, [mapData, entities, selectedEntity, baseMap, onEntitySelect]);

  return (
    <div className="map-container">
      <svg ref={svgRef} width="100%" height="100%"></svg>
      {tooltip.entity && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            pointerEvents: 'none',
            zIndex: 1000,
            maxWidth: '300px',
            right: '20px',
            bottom: '20px',
          }}
        >
          <strong>{tooltip.entity?.name}</strong>
          <div>{tooltip.entity?.type === 'SCHOOL' ? 'Escuela' : 'Espacio ABC'}</div>
          <div>
            {tooltip.entity?.departmentId !== undefined && 
             departments.find(d => d.id === tooltip.entity?.departmentId)?.name}
          </div>
          <div>Conexión: {tooltip.entity?.connectionType === 'Múltiple' ? 'Múltiple' : tooltip.entity?.connectionType}</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
