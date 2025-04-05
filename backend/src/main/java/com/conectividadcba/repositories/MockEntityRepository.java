package com.conectividadcba.repositories;

import com.conectividadcba.models.Entity;
import com.conectividadcba.models.LearningCenter;
import com.conectividadcba.models.School;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class MockEntityRepository implements EntityRepository {
    private final List<Entity> entities;

    public MockEntityRepository() {
        entities = new ArrayList<>();
        initializeData();
    }

    private void initializeData() {
        String[] connectionTypes = {"Proveedor externo", "Starlink", "Fibra Optica"};

        // Keep the first 20 detailed schools
        entities.add(new School(1L, "Escuela Primaria José de San Martín", 
                new Entity.Coordinates(-31.4201, -64.1888), 
                "Escuela primaria pública en el centro de Córdoba", 
                1L, "Primario", 450, "Fibra Optica"));
        
        entities.add(new School(2L, "Colegio Nacional de Monserrat", 
                new Entity.Coordinates(-31.4180, -64.1850), 
                "Colegio preuniversitario dependiente de la UNC", 
                1L, "Secundario", 800, "Fibra Optica"));
        
        entities.add(new School(3L, "Escuela Normal Superior Dr. Alejandro Carbó", 
                new Entity.Coordinates(-31.4230, -64.1830), 
                "Escuela de formación docente", 
                1L, "Primario y Secundario", 1200, "Fibra Optica"));
        
        entities.add(new School(4L, "Instituto Domingo Faustino Sarmiento", 
                new Entity.Coordinates(-31.4150, -64.1920), 
                "Instituto educativo privado", 
                1L, "Inicial, Primario y Secundario", 950, "Proveedor externo"));
        
        entities.add(new School(5L, "Escuela Provincial Jerónimo Luis de Cabrera", 
                new Entity.Coordinates(-31.4280, -64.1870), 
                "Escuela secundaria pública", 
                1L, "Secundario", 600, "Fibra Optica"));
        
        entities.add(new School(6L, "Colegio Gabriel Taborin", 
                new Entity.Coordinates(-31.4320, -64.1940), 
                "Colegio católico privado", 
                1L, "Inicial, Primario y Secundario", 1100, "Proveedor externo"));
        
        entities.add(new School(7L, "Escuela Primaria Mariano Moreno", 
                new Entity.Coordinates(-31.2510, -64.3850), 
                "Escuela primaria rural", 
                7L, "Primario", 180, "Starlink"));
        
        entities.add(new School(8L, "Instituto Secundario Manuel Belgrano", 
                new Entity.Coordinates(-31.6520, -63.8790), 
                "Instituto secundario técnico", 
                2L, "Secundario Técnico", 420, "Fibra Optica"));
        
        entities.add(new School(9L, "Escuela Rural Juan Bautista Alberdi", 
                new Entity.Coordinates(-30.9840, -64.5230), 
                "Escuela rural de jornada completa", 
                5L, "Primario", 95, "Starlink"));
        
        entities.add(new School(10L, "Colegio Técnico Ingeniero Renato De Marco", 
                new Entity.Coordinates(-31.3680, -64.2540), 
                "Colegio técnico especializado en electrónica", 
                1L, "Secundario Técnico", 560, "Fibra Optica"));
        
        entities.add(new School(11L, "Escuela Provincial Dr. Dalmacio Vélez Sarsfield", 
                new Entity.Coordinates(-32.4120, -63.2510), 
                "Escuela secundaria pública", 
                13L, "Secundario", 380, "Proveedor externo"));
        
        entities.add(new School(12L, "Instituto Educativo Nuevo Sol", 
                new Entity.Coordinates(-31.3980, -64.2210), 
                "Instituto privado con pedagogía alternativa", 
                1L, "Inicial y Primario", 240, "Fibra Optica"));
        
        entities.add(new School(13L, "Escuela Técnica General Paz", 
                new Entity.Coordinates(-31.4050, -64.1930), 
                "Escuela técnica con orientación en informática", 
                1L, "Secundario Técnico", 620, "Fibra Optica"));
        
        entities.add(new School(14L, "Colegio Bilingüe San Patricio", 
                new Entity.Coordinates(-31.3890, -64.2370), 
                "Colegio privado bilingüe inglés-español", 
                1L, "Inicial, Primario y Secundario", 780, "Proveedor externo"));
        
        entities.add(new School(15L, "Escuela Rural Los Molinos", 
                new Entity.Coordinates(-31.8520, -64.5120), 
                "Escuela rural de nivel primario", 
                15L, "Primario", 75, "Starlink"));
        
        entities.add(new School(16L, "Instituto Superior Dr. Bernardo Houssay", 
                new Entity.Coordinates(-31.4130, -64.1810), 
                "Instituto de formación terciaria en salud", 
                1L, "Terciario", 350, "Fibra Optica"));
        
        entities.add(new School(17L, "Escuela Primaria Domingo Savio", 
                new Entity.Coordinates(-31.7230, -63.9840), 
                "Escuela primaria salesiana", 
                2L, "Primario", 320, "Proveedor externo"));
        
        entities.add(new School(18L, "Colegio Secundario Presidente Roca", 
                new Entity.Coordinates(-31.4290, -64.1750), 
                "Colegio secundario público", 
                1L, "Secundario", 540, "Fibra Optica"));
        
        entities.add(new School(19L, "Escuela Especial Dra. Carolina Tobar García", 
                new Entity.Coordinates(-31.4180, -64.2050), 
                "Escuela de educación especial", 
                1L, "Educación Especial", 120, "Fibra Optica"));
        
        entities.add(new School(20L, "Instituto Técnico Agrario Inchausti", 
                new Entity.Coordinates(-32.1240, -63.8750), 
                "Instituto técnico con orientación agraria", 
                14L, "Secundario Técnico", 290, "Proveedor externo"));
        
        // Generate remaining schools (to reach 633 total)
        String[] departments = {
            "Capital", "Río Segundo", "Río Tercero", "Río Cuarto", "Punilla",
            "San Justo", "Colón", "Santa María", "Unión", "Marcos Juárez",
            "General San Martín", "Tercero Arriba", "San Javier", "Calamuchita",
            "General Roca", "Juárez Celman", "Pocho", "Minas", "Cruz del Eje",
            "Río Primero", "Totoral", "Tulumba", "Sobremonte", "Ischilín",
            "Río Seco", "Presidente Roque Sáenz Peña"
        };
        
        String[] levels = {"Primario", "Secundario", "Inicial y Primario", "Primario y Secundario"};
        
        for (long i = 21; i <= 633; i++) {
            String department = departments[(int)(Math.random() * departments.length)];
            String level = levels[(int)(Math.random() * levels.length)];
            int studentCount = 100 + (int)(Math.random() * 900);
            String connectionType = connectionTypes[(int)(Math.random() * connectionTypes.length)];
            
            // Generate coordinates within department bounds and get corresponding departmentId
            double lat, lng;
            long departmentId;
            switch (department.toUpperCase()) {
                case "CAPITAL":
                    lat = -31.521699752000018 + (Math.random() * 0.215194938);
                    lng = -64.29016917500002 + (Math.random() * 0.215194938);
                    departmentId = 1L; // Capital
                    break;
                case "RÍO CUARTO":
                    lat = -33.905096456999985 + (Math.random() * 1.258133380999985);
                    lng = -65.14272943200001 + (Math.random() * 1.258133380999985);
                    departmentId = 4L; // Río Cuarto
                    break;
                case "CRUZ DEL EJE":
                    lat = -31.14634663299998 + (Math.random() * 0.984864342);
                    lng = -65.59031895499999 + (Math.random() * 0.984864342);
                    departmentId = 19L; // Cruz del Eje
                    break;
                case "PUNILLA":
                    lat = -31.408243827000007 + (Math.random() * 0.427009424);
                    lng = -64.839409724 + (Math.random() * 0.427009424);
                    departmentId = 5L; // Punilla
                    break;
                case "COLÓN":
                    lat = -31.459442721000016 + (Math.random() * 0.545739034);
                    lng = -64.414998849 + (Math.random() * 0.545739034);
                    departmentId = 7L; // Colón
                    break;
                case "SAN JUSTO":
                    lat = -31.933140546000004 + (Math.random() * 1.432767927);
                    lng = -63.274243861 + (Math.random() * 1.432767927);
                    departmentId = 6L; // San Justo
                    break;
                case "CALAMUCHITA":
                    lat = -32.58038708649997 + (Math.random() * 0.733264102);
                    lng = -64.94316433699998 + (Math.random() * 0.733264102);
                    departmentId = 14L; // Calamuchita
                    break;
                case "GENERAL SAN MARTÍN":
                    lat = -32.94377784449998 + (Math.random() * 0.727242941);
                    lng = -63.58022143599999 + (Math.random() * 0.727242941);
                    departmentId = 11L; // General San Martín
                    break;
                case "TERCERO ARRIBA":
                    lat = -32.83089075100003 + (Math.random() * 0.894954498);
                    lng = -64.14930592300001 + (Math.random() * 0.894954498);
                    departmentId = 12L; // Tercero Arriba
                    break;
                case "SAN JAVIER":
                    lat = -32.32558897000001 + (Math.random() * 0.454152535);
                    lng = -65.48270239599998 + (Math.random() * 0.454152535);
                    departmentId = 13L; // San Javier
                    break;
                case "RÍO PRIMERO":
                    lat = -31.566309697999998 + (Math.random() * 1.030626849);
                    lng = -63.89743929549999 + (Math.random() * 1.030626849);
                    departmentId = 20L; // Río Primero
                    break;
                case "RÍO SEGUNDO":
                    lat = -32.076585247000025 + (Math.random() * 0.769730122);
                    lng = -63.82459303800002 + (Math.random() * 0.769730122);
                    departmentId = 2L; // Río Segundo
                    break;
                case "MARCOS JUÁREZ":
                    lat = -33.53358895400001 + (Math.random() * 1.048903815);
                    lng = -62.81979724199999 + (Math.random() * 1.048903815);
                    departmentId = 10L; // Marcos Juárez
                    break;
                case "UNIÓN":
                    lat = -33.410520924 + (Math.random() * 0.949523739);
                    lng = -63.23825341899999 + (Math.random() * 0.949523739);
                    departmentId = 9L; // Unión
                    break;
                case "SANTA MARÍA":
                    lat = -32.012080235999974 + (Math.random() * 0.663110605);
                    lng = -64.74074297199999 + (Math.random() * 0.663110605);
                    departmentId = 8L; // Santa María
                    break;
                case "POCHO":
                    lat = -31.755452049999974 + (Math.random() * 0.509053614);
                    lng = -65.6029568555 + (Math.random() * 0.509053614);
                    departmentId = 17L; // Pocho
                    break;
                case "MINAS":
                    lat = -31.253410185000007 + (Math.random() * 0.613899841);
                    lng = -65.65540737500004 + (Math.random() * 0.613899841);
                    departmentId = 18L; // Minas
                    break;
                case "TULUMBA":
                    lat = -30.687226991999978 + (Math.random() * 1.168552789);
                    lng = -64.25043800149999 + (Math.random() * 1.168552789);
                    departmentId = 22L; // Tulumba
                    break;
                case "SOBREMONTE":
                    lat = -30.098846735999985 + (Math.random() * 0.598424154);
                    lng = -64.39245071299999 + (Math.random() * 0.598424154);
                    departmentId = 23L; // Sobremonte
                    break;
                case "ISCHILIN":
                    lat = -30.801426548999984 + (Math.random() * 0.791864673);
                    lng = -64.96201719449999 + (Math.random() * 0.791864673);
                    departmentId = 24L; // Ischilín
                    break;
                case "TOTORAL":
                    lat = -31.032791456999973 + (Math.random() * 0.617315134);
                    lng = -64.32122708099996 + (Math.random() * 0.617315134);
                    departmentId = 21L; // Totoral
                    break;
                case "RÍO SECO":
                    lat = -30.5 + (Math.random() * 0.5); // Approximate coordinates
                    lng = -63.5 + (Math.random() * 0.5);
                    departmentId = 25L; // Río Seco
                    break;
                case "PRESIDENTE ROQUE SÁENZ PEÑA":
                    lat = -34.0 + (Math.random() * 0.5); // Approximate coordinates
                    lng = -63.5 + (Math.random() * 0.5);
                    departmentId = 26L; // Presidente Roque Sáenz Peña
                    break;
                default:
                    // For any unhandled departments, use general province bounds
                    lat = -32.0 + (Math.random() * 0.5);
                    lng = -64.0 + (Math.random() * 0.5);
                    departmentId = 1L; // Default to Capital
            }
            
            entities.add(new School(i,
                String.format("Escuela N°%d - %s", i, department),
                new Entity.Coordinates(lat, lng),
                String.format("Escuela de nivel %s en %s", level.toLowerCase(), department),
                departmentId,
                level,
                studentCount,
                connectionType));
        }

        // Add learning centers
        entities.add(new LearningCenter(101L, "Centro Cultural España Córdoba", 
                new Entity.Coordinates(-31.4170, -64.1830), 
                "Centro cultural con actividades educativas y artísticas", 
                1L, "Cultural", 150, "Fibra Optica"));
        
        entities.add(new LearningCenter(102L, "Biblioteca Provincial Córdoba", 
                new Entity.Coordinates(-31.4190, -64.1870), 
                "Biblioteca pública provincial con programas educativos", 
                1L, "Biblioteca", 200, "Fibra Optica"));
        
        entities.add(new LearningCenter(103L, "Centro de Capacitación Digital", 
                new Entity.Coordinates(-31.4250, -64.1920), 
                "Centro de formación en tecnologías digitales", 
                1L, "Tecnológico", 80, "Fibra Optica"));
        
        entities.add(new LearningCenter(104L, "Centro de Idiomas Municipal", 
                new Entity.Coordinates(-31.4210, -64.1850), 
                "Centro de enseñanza de idiomas", 
                1L, "Idiomas", 120, "Fibra Optica"));
        
        entities.add(new LearningCenter(105L, "Centro Educativo Rural La Serranita", 
                new Entity.Coordinates(-31.7320, -64.4530), 
                "Centro educativo para comunidades rurales", 
                15L, "Rural", 50, "Starlink"));
        
        entities.add(new LearningCenter(106L, "Centro de Formación Profesional N°3", 
                new Entity.Coordinates(-31.4280, -64.1980), 
                "Centro de formación en oficios", 
                1L, "Oficios", 100, "Fibra Optica"));
        
        entities.add(new LearningCenter(107L, "Centro de Arte y Oficios Tradicionales", 
                new Entity.Coordinates(-31.4150, -64.1910), 
                "Centro de enseñanza de artes y oficios tradicionales", 
                1L, "Artístico", 75, "Fibra Optica"));
        
        entities.add(new LearningCenter(108L, "Centro Tecnológico Comunitario Villa Allende", 
                new Entity.Coordinates(-31.2940, -64.2950), 
                "Centro tecnológico para la comunidad", 
                7L, "Tecnológico", 90, "Proveedor externo"));
        
        entities.add(new LearningCenter(109L, "Centro de Educación Ambiental Sierras Chicas", 
                new Entity.Coordinates(-31.3210, -64.3580), 
                "Centro educativo sobre medio ambiente", 
                7L, "Ambiental", 60, "Proveedor externo"));
        
        entities.add(new LearningCenter(110L, "Centro de Formación Musical Carlos Guastavino", 
                new Entity.Coordinates(-31.4230, -64.1840), 
                "Centro de formación musical", 
                1L, "Musical", 100, "Fibra Optica"));
    }

    @Override
    public List<Entity> findAll() {
        return new ArrayList<>(entities);
    }

    @Override
    public List<Entity> findByDepartmentId(Long departmentId) {
        return entities.stream()
                .filter(e -> e.getDepartmentId() != null && e.getDepartmentId().equals(departmentId))
                .collect(Collectors.toList());
    }

    @Override
    public List<Entity> findByType(String type) {
        return entities.stream()
                .filter(entity -> entity.getType().name().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Entity> findById(Long id) {
        return entities.stream()
                .filter(entity -> entity.getId().equals(id))
                .findFirst();
    }

    @Override
    public List<Entity> findByName(String name) {
        return entities.stream()
                .filter(entity -> entity.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }
}
