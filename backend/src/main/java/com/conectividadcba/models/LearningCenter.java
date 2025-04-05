package com.conectividadcba.models;

public class LearningCenter extends Entity {
    private String specialization;
    private int capacity;

    public LearningCenter() {
        super();
        setType(EntityType.LEARNING_CENTER);
    }

    public LearningCenter(Long id, String name, Coordinates coordinates, String description, Long departmentId,
                          String specialization, int capacity, String connectionType) {
        super(id, name, EntityType.LEARNING_CENTER, coordinates, description, departmentId, connectionType);
        this.specialization = specialization;
        this.capacity = capacity;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
