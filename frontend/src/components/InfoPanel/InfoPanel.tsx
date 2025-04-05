import React from 'react';
import { Entity, Department } from '../../services/api';
import './InfoPanel.css';

interface InfoPanelProps {
  entities: Entity[];
  departments: Department[];
  selectedEntity: Entity | null;
  onEntitySelect: (entity: Entity | null) => void;
  baseMap: string;
  onBaseMapChange: (baseMap: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  filters: {
    name: string;
    type: string;
    department: string;
    connectionType: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  entities,
  departments,
  selectedEntity,
  onEntitySelect,
  baseMap,
  onBaseMapChange,
  onZoomIn,
  onZoomOut,
  filters,
  onFilterChange,
}) => {

  return (
    <div className="info-panel">
      <div className="panel-section">
        <h1>Conectividad Córdoba</h1>
        <p className="description">
          Explorador de instituciones educativas y centros de aprendizaje en la provincia de Córdoba.
          Visualice la distribución de escuelas y centros educativos en todo el territorio provincial.
        </p>
      </div>

      <div className="panel-section">
        <h2>Filtros</h2>
        <div className="filter-group">
          <label htmlFor="name-filter">Nombre</label>
          <input
            id="name-filter"
            type="text"
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            placeholder="Buscar por nombre..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Tipo de Institución</label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="SCHOOL">Escuelas</option>
            <option value="LEARNING_CENTER">Centros de Aprendizaje</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="department-filter">Departamento</label>
          <select
            id="department-filter"
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="">Todos</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="connection-filter">Tipo de Conexión</label>
          <select
            id="connection-filter"
            value={filters.connectionType}
            onChange={(e) => onFilterChange('connectionType', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Proveedor externo">Proveedor externo</option>
            <option value="Starlink">Starlink</option>
            <option value="Fibra Optica">Fibra Optica</option>
            <option value="Múltiple">Múltiple</option>
          </select>
        </div>

        <div className="filter-group">
          <button 
            className="base-map-button"
            onClick={() => {
              onFilterChange('name', '');
              onFilterChange('type', '');
              onFilterChange('department', '');
              onFilterChange('connectionType', '');
            }}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h2>Mapa Base</h2>
        <div className="base-map-selector">
          <button
            className={`base-map-button ${baseMap === 'street-map' ? 'active' : ''}`}
            onClick={() => onBaseMapChange('street-map')}
          >
            Calles
          </button>
          <button
            className={`base-map-button ${baseMap === 'light-gray' ? 'active' : ''}`}
            onClick={() => onBaseMapChange('light-gray')}
          >
            Gris Claro
          </button>
          <button
            className={`base-map-button ${baseMap === 'imagery' ? 'active' : ''}`}
            onClick={() => onBaseMapChange('imagery')}
          >
            Satélite
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h2>Zoom</h2>
        <div className="zoom-controls">
          <button onClick={onZoomIn} className="zoom-button">
            <span>+</span>
          </button>
          <button onClick={onZoomOut} className="zoom-button">
            <span>−</span>
          </button>
        </div>
      </div>

      {selectedEntity && (
        <div className="panel-section selected-entity">
          <h2>Detalle de la Institución</h2>
          <h3>{selectedEntity.name}</h3>
          <p className="entity-type">
            {selectedEntity.type === 'SCHOOL' ? 'Escuela' : 'Centro de Aprendizaje'}
          </p>
          <p className="entity-department">
            {departments.find(d => d.id === selectedEntity.departmentId)?.name}
          </p>
          <p className="entity-description">{selectedEntity.description}</p>
          <p className="entity-connection">Conexión: {selectedEntity.connectionType}</p>
          <button 
            className="close-button"
            onClick={() => onEntitySelect(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
