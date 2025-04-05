package com.conectividadcba.models;

public class School extends Entity {
    private String level;
    private int studentCount;

    public School() {
        super();
    }

    public School(Long id, String name, Coordinates coordinates, String description, Long departmentId, String level, int studentCount, String connectionType) {
        super(id, name, EntityType.SCHOOL, coordinates, description, departmentId, connectionType);
        this.level = level;
        this.studentCount = studentCount;
    }

    // Getters and setters
    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }
}
