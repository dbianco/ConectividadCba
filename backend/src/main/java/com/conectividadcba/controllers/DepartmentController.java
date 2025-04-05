package com.conectividadcba.controllers;

import com.conectividadcba.models.Department;
import com.conectividadcba.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return departments.stream()
            .map(dept -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", dept.getId());
                map.put("name", dept.getName());
                return map;
            })
            .collect(Collectors.toList());
    }
}
