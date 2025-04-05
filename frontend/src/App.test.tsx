import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the api service
jest.mock('./services/api', () => ({
  api: {
    getEntities: () => Promise.resolve([])
  }
}));

// Mock the MapComponent
jest.mock('./components/Map/MapComponent', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="map-component">Map Component</div>
  };
});

// Mock the InfoPanel component
jest.mock('./components/InfoPanel/InfoPanel', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="info-panel">Info Panel</div>
  };
});

test('renders loading state initially', async () => {
  render(<App />);
  
  // Check initial loading state
  expect(screen.getByText(/Cargando datos.../i)).toBeInTheDocument();

  // Wait for the loading state to finish and component to update
  await screen.findByTestId('map-component');
  await screen.findByTestId('info-panel');
});
