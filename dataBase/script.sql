CREATE DATABASE  bdlicencia;

USE bdlicencia;

-- Tabla conductor
CREATE TABLE conductor (
    idConductor INT AUTO_INCREMENT PRIMARY KEY,
    ci VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20)
);

-- Tabla vehiculo
CREATE TABLE vehiculo (
    placa VARCHAR(20) PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    color VARCHAR(30),
    
    -- clave foránea
    idConductor INT NOT NULL,
    
    FOREIGN KEY (idConductor) 
    REFERENCES conductor(idConductor)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO conductor (ci, nombres, apellidos, fecha_nacimiento, direccion, telefono)
VALUES
('1000001', 'Mr.', 'Bean', '1955-01-06', 'Londres', '70000001'),
('1000002', 'Jim', 'Carrey', '1962-01-17', 'Ontario', '70000002'),
('1000003', 'Adam', 'Sandler', '1966-09-09', 'Nueva York', '70000003'),
('1000004', 'Kevin', 'Hart', '1979-07-06', 'Filadelfia', '70000004'),
('1000005', 'Will', 'Ferrell', '1967-07-16', 'California', '70000005'),
('1000006', 'Jack', 'Black', '1969-08-28', 'California', '70000006'),
('1000007', 'Chris', 'Rock', '1965-02-07', 'Carolina del Sur', '70000007'),
('1000008', 'Eugenio', 'Derbez', '1961-09-02', 'Ciudad de México', '70000008'),
('1000009', 'Steve', 'Carell', '1962-08-16', 'Massachusetts', '70000009'),
('1000010', 'Robin', 'Williams', '1951-07-21', 'Chicago', '70000010');

INSERT INTO vehiculo (placa, marca, modelo, anio, color, idConductor)
VALUES
('LUX001', 'Ferrari', '488 Spider', 2022, 'Rojo', 1),
('LUX002', 'Lamborghini', 'Aventador', 2023, 'Amarillo', 2),
('LUX003', 'Rolls-Royce', 'Phantom', 2021, 'Negro', 3),
('LUX004', 'Bentley', 'Continental GT', 2022, 'Blanco', 4),
('LUX005', 'Porsche', '911 Turbo S', 2023, 'Gris', 5),
('LUX006', 'Mercedes-Benz', 'Clase G AMG', 2022, 'Negro', 6),
('LUX007', 'Maserati', 'Levante', 2021, 'Azul', 7),
('LUX008', 'Aston Martin', 'DB11', 2023, 'Verde', 8),
('LUX009', 'McLaren', '720S', 2022, 'Naranja', 9),
('LUX010', 'Bugatti', 'Chiron', 2023, 'Azul', 10);