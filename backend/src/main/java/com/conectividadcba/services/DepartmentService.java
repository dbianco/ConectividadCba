package com.conectividadcba.services;

import com.conectividadcba.models.Department;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentService {

    // This is a mock implementation. In a real application, this would typically interact with a database.
    public List<Department> getAllDepartments() {
        List<Department> departments = new ArrayList<>();
        departments.add(new Department(1L, "Capital"));
        departments.add(new Department(2L, "Río Segundo"));
        departments.add(new Department(3L, "Río Tercero"));
        departments.add(new Department(4L, "Río Cuarto"));
        departments.add(new Department(5L, "Punilla"));
        departments.add(new Department(6L, "San Justo"));
        departments.add(new Department(7L, "Colón"));
        departments.add(new Department(8L, "Santa María"));
        departments.add(new Department(9L, "Unión"));
        departments.add(new Department(10L, "Marcos Juárez"));
        departments.add(new Department(11L, "General San Martín"));
        departments.add(new Department(12L, "Tercero Arriba"));
        departments.add(new Department(13L, "San Javier"));
        departments.add(new Department(14L, "Calamuchita"));
        departments.add(new Department(15L, "General Roca"));
        departments.add(new Department(16L, "Juárez Celman"));
        departments.add(new Department(17L, "Pocho"));
        departments.add(new Department(18L, "Minas"));
        departments.add(new Department(19L, "Cruz del Eje"));
        departments.add(new Department(20L, "Río Primero"));
        departments.add(new Department(21L, "Totoral"));
        departments.add(new Department(22L, "Tulumba"));
        departments.add(new Department(23L, "Sobremonte"));
        departments.add(new Department(24L, "Ischilín"));
        departments.add(new Department(25L, "Río Seco"));
        departments.add(new Department(26L, "Presidente Roque Sáenz Peña"));
        return departments;
    }
}
