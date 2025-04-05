package com.conectividadcba.repositories;

import com.conectividadcba.models.Entity;
import java.util.List;
import java.util.Optional;

public interface EntityRepository {
    List<Entity> findAll();
    Optional<Entity> findById(Long id);
    List<Entity> findByType(String type);
    List<Entity> findByDepartmentId(Long departmentId);
    List<Entity> findByName(String name);
}
