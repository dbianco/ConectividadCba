# Aplicación GIS de Conectividad Córdoba

Esta aplicación muestra un mapa interactivo de escuelas y centros de aprendizaje en la provincia de Córdoba, Argentina.

## Estructura del Proyecto

```
ConectividadCba/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── conectividadcba/
│   │   │   │           ├── controllers/
│   │   │   │           │   └── EntityController.java
│   │   │   │           ├── models/
│   │   │   │           │   └── Entity.java
│   │   │   │           └── ConectividadCbaApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── cordoba.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── InfoPanel/
│   │   │   │   ├── InfoPanel.tsx
│   │   │   │   └── InfoPanel.css
│   │   │   └── Map/
│   │   │       ├── MapComponent.tsx
│   │   │       └── MapComponent.css
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   └── package.json
│
└── README.md
```

## Requisitos

- Java 17 o superior
- Node.js 14 o superior
- npm 6 o superior

## Instrucciones para Ejecutar la Aplicación

### Backend (Spring Boot)

1. Abra una terminal
2. Navegue al directorio del backend:
   ```
   cd ConectividadCba/backend
   ```
3. Ejecute el siguiente comando para iniciar el servidor:
   ```
   ./mvnw spring-boot:run
   ```
   El backend estará disponible en `http://localhost:8080`

### Frontend (React)

1. Abra otra terminal
2. Navegue al directorio del frontend:
   ```
   cd ConectividadCba/frontend
   ```
3. Instale las dependencias (si aún no lo ha hecho):
   ```
   npm install
   ```
4. Inicie la aplicación frontend:
   ```
   npm start
   ```
   El frontend estará disponible en `http://localhost:3000`

## Uso de la Aplicación

1. Abra un navegador web y vaya a `http://localhost:3000`
2. Verá un mapa de la provincia de Córdoba con marcadores para escuelas y centros de aprendizaje
3. Use el panel de información a la izquierda para:
   - Filtrar entidades por nombre, tipo o departamento
   - Cambiar el mapa base
   - Hacer zoom en el mapa
4. Haga clic en los marcadores para ver más detalles sobre cada entidad

## Desarrollo Futuro

Esta versión inicial incluye un mapa de la provincia de Córdoba, muestra entidades preconfiguradas (escuelas y centros de aprendizaje) y permite filtrado y zoom. La aplicación está lista para futuras mejoras, como:

- Agregar más funcionalidades
- Conectar con una base de datos real
- Expandir la API del backend
- Mejorar la interfaz de usuario
- Agregar autenticación y autorización de usuarios
