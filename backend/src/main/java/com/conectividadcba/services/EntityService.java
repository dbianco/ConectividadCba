package com.conectividadcba.services;

import com.conectividadcba.models.Entity;
import com.conectividadcba.repositories.EntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntityService {
    private final EntityRepository entityRepository;

    @Autowired
    public EntityService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    public List<Entity> getAllEntities() {
        return entityRepository.findAll();
    }

    public Optional<Entity> getEntityById(Long id) {
        return entityRepository.findById(id);
    }

    public List<Entity> getSchools() {
        return entityRepository.findByType("SCHOOL");
    }

    public List<Entity> getLearningCenters() {
        return entityRepository.findByType("LEARNING_CENTER");
    }

    public List<Entity> getEntitiesByDepartmentId(Long departmentId) {
        return entityRepository.findByDepartmentId(departmentId);
    }

    public List<Entity> getEntitiesByName(String name) {
        return entityRepository.findByName(name);
    }

    public List<Long> getAllDepartmentIds() {
        return entityRepository.findAll().stream()
                .map(Entity::getDepartmentId)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
