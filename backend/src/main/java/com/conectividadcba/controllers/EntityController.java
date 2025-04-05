package com.conectividadcba.controllers;

import com.conectividadcba.models.Entity;
import com.conectividadcba.services.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entities")
@CrossOrigin(origins = "*")
public class EntityController {
    private final EntityService entityService;

    @Autowired
    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping
    public List<Entity> getAllEntities() {
        return entityService.getAllEntities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entity> getEntityById(@PathVariable Long id) {
        return entityService.getEntityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/schools")
    public List<Entity> getSchools() {
        return entityService.getSchools();
    }

    @GetMapping("/learning-centers")
    public List<Entity> getLearningCenters() {
        return entityService.getLearningCenters();
    }

    @GetMapping("/departments")
    public List<Long> getAllDepartmentIds() {
        return entityService.getAllDepartmentIds();
    }

    @GetMapping("/filter")
    public List<Entity> filterEntities(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String type) {
        
        if (name != null && !name.isEmpty()) {
            return entityService.getEntitiesByName(name);
        } else if (departmentId != null) {
            return entityService.getEntitiesByDepartmentId(departmentId);
        } else if (type != null && !type.isEmpty()) {
            if (type.equalsIgnoreCase("school")) {
                return entityService.getSchools();
            } else if (type.equalsIgnoreCase("learning_center")) {
                return entityService.getLearningCenters();
            }
        }
        
        return entityService.getAllEntities();
    }
}
