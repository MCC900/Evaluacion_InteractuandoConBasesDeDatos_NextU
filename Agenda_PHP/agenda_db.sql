-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-08-2018 a las 05:04:38
-- Versión del servidor: 10.1.30-MariaDB
-- Versión de PHP: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agenda_db`
--

-- --------------------------------------------------------

--
--  Creamos la base de datos
--

CREATE DATABASE `agenda_db`;

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(127) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `fecha_finalizacion` date DEFAULT NULL,
  `hora_finalizacion` time DEFAULT NULL,
  `dia_completo` tinyint(1) NOT NULL,
  `fk_usuario` varchar(127) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `email` varchar(127) NOT NULL,
  `nombre` varchar(127) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evento_usuario` (`fk_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_evento_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios` (`email`);
COMMIT;

--
-- Creamos todos los usuarios requeridos
--
# Privilegios para `agenda_actualizarEvento`@`localhost`

GRANT USAGE ON *.* TO 'agenda_actualizarEvento'@'localhost' IDENTIFIED BY PASSWORD '*026E589F7B0D825DE7678BC784BDFE780E3A2A3E';

GRANT SELECT (fk_usuario, id), UPDATE (hora_inicio, hora_finalizacion, fecha_finalizacion, fecha_inicio) ON `agenda_db`.`eventos` TO 'agenda_actualizarEvento'@'localhost';


# Privilegios para `agenda_crearEvento`@`localhost`

GRANT USAGE ON *.* TO 'agenda_crearEvento'@'localhost' IDENTIFIED BY PASSWORD '*C1634196913DF11AD82A3BECF0DE243E5979FFC5';

GRANT INSERT (fk_usuario, dia_completo, fecha_inicio, hora_finalizacion, hora_inicio, fecha_finalizacion, titulo) ON `agenda_db`.`eventos` TO 'agenda_crearEvento'@'localhost';


# Privilegios para `agenda_crearUsuario`@`localhost`

GRANT USAGE ON *.* TO 'agenda_crearUsuario'@'localhost' IDENTIFIED BY PASSWORD '*AB85013F5B4E3CF455E86889BAAEBF206D299F04';

GRANT INSERT ON `agenda_db`.`usuarios` TO 'agenda_crearUsuario'@'localhost';


# Privilegios para `agenda_eliminarEvento`@`localhost`

GRANT USAGE ON *.* TO 'agenda_eliminarEvento'@'localhost' IDENTIFIED BY PASSWORD '*F22399E6B7566F63D77E25242FA4FE4227818E95';

GRANT SELECT (id, fk_usuario), DELETE ON `agenda_db`.`eventos` TO 'agenda_eliminarEvento'@'localhost';


# Privilegios para `agenda_getEventosUsuario`@`localhost`

GRANT USAGE ON *.* TO 'agenda_getEventosUsuario'@'localhost' IDENTIFIED BY PASSWORD '*C82EBF17EA50FC81DD9798C29F93DE8985548987';

GRANT SELECT ON `agenda_db`.`eventos` TO 'agenda_getEventosUsuario'@'localhost';


# Privilegios para `agenda_login`@`localhost`

GRANT USAGE ON *.* TO 'agenda_login'@'localhost' IDENTIFIED BY PASSWORD '*067B6B0281103AEDB7E4C759E9CAE74655F44B8A';

GRANT SELECT (email, contrasena) ON `agenda_db`.`usuarios` TO 'agenda_login'@'localhost';

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
