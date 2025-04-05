export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Entity {
  id: number;
  name: string;
  type: 'SCHOOL' | 'LEARNING_CENTER';
  coordinates: Coordinates;
  description: string;
  departmentId: number;
  connectionType: 'Proveedor externo' | 'Starlink' | 'Fibra Optica' | 'Múltiple';
}

export interface Department {
  id: number;
  name: string;
}

export const api = {
  getEntities: async (): Promise<Entity[]> => {
    try {
      const response = await fetch('/api/entities');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  },
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await fetch('/api/departments');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }
};
