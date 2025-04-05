const fs = require('fs');
const geojson = JSON.parse(fs.readFileSync('frontend/public/data/departamentos-cordoba.json', 'utf8'));

function calculateBoundingBox(coordinates) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  
  // Handle nested coordinate structure
  coordinates[0].forEach(point => {
    const lat = point[1];
    const lng = point[0];
    
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  // Calculate the center point of the bounding box
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate the dimensions of the bounding box
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  // Calculate the minimum square that fits inside the bounding box
  const minDimension = Math.min(latSpan, lngSpan);

  return {
    centerLat,
    centerLng,
    minLat: centerLat - minDimension / 2,
    maxLat: centerLat + minDimension / 2,
    minLng: centerLng - minDimension / 2,
    maxLng: centerLng + minDimension / 2
  };
}

const departmentBounds = {};

geojson.features.forEach(feature => {
  const name = feature.properties.departamento;
  const coordinates = feature.geometry.coordinates;
  departmentBounds[name] = calculateBoundingBox(coordinates);
});

console.log('\nDepartment bounds:');
console.log(JSON.stringify(departmentBounds, null, 2));
