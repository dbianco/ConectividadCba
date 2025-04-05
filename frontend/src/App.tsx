import React, { useEffect, useState, useCallback } from 'react';
import { Entity, Department, api } from './services/api';
import MapComponent from './components/Map/MapComponent';
import InfoPanel from './components/InfoPanel/InfoPanel';
import './App.css';

const App: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [baseMap, setBaseMap] = useState<string>('street-map');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    department: '',
    connectionType: '',
  });

  // Load entities and departments from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [entitiesData, departmentsData] = await Promise.all([
          api.getEntities(),
          api.getDepartments()
        ]);
        setEntities(entitiesData);
        setFilteredEntities(entitiesData);
        setDepartments(departmentsData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter entities based on search criteria
  useEffect(() => {
    const filtered = entities.filter((entity) => {
      const nameMatch = entity.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const typeMatch = !filters.type || entity.type === filters.type;
      const departmentMatch =
        !filters.department || entity.departmentId.toString() === filters.department;
      const connectionMatch =
        !filters.connectionType || entity.connectionType === filters.connectionType;

      return nameMatch && typeMatch && departmentMatch && connectionMatch;
    });

    setFilteredEntities(filtered);
  }, [entities, filters]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Handle entity selection
  const handleEntitySelect = useCallback((entity: Entity | null) => {
    setSelectedEntity(entity);
  }, []);

  // Handle base map changes
  const handleBaseMapChange = useCallback((newBaseMap: string) => {
    setBaseMap(newBaseMap);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <InfoPanel
        entities={entities}
        departments={departments}
        selectedEntity={selectedEntity}
        onEntitySelect={handleEntitySelect}
        baseMap={baseMap}
        onBaseMapChange={handleBaseMapChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onZoomIn={() => {}} // These will be connected to the map's zoom controls
        onZoomOut={() => {}}
      />
      <MapComponent
        entities={filteredEntities}
        departments={departments}
        selectedEntity={selectedEntity}
        onEntitySelect={handleEntitySelect}
        baseMap={baseMap}
      />
    </div>
  );
};

export default App;
