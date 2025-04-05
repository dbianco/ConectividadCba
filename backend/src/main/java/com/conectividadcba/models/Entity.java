package com.conectividadcba.models;

public class Entity {
    private Long id;
    private String name;
    private EntityType type;
    private Coordinates coordinates;
    private String description;
    private Long departmentId;
    private String connectionType;

    public Entity() {}

    public Entity(Long id, String name, EntityType type, Coordinates coordinates, String description, Long departmentId, String connectionType) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.description = description;
        this.departmentId = departmentId;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public EntityType getType() { return type; }
    public void setType(EntityType type) { this.type = type; }

    public Coordinates getCoordinates() { return coordinates; }
    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getConnectionType() { return connectionType; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public enum EntityType {
        SCHOOL,
        LEARNING_CENTER
    }

    public static class Coordinates {
        private double lat;
        private double lng;

        public Coordinates() {}

        public Coordinates(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }

        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
    }
}
