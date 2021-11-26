-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2021 a las 22:08:33
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.1
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET
  time_zone = "+00:00";
  /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
  /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
  /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
  /*!40101 SET NAMES utf8mb4 */;
--
  -- Base de datos: `allgames`
  --
  -- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `carrito`
  --
  CREATE TABLE `carrito` (
    `pedidoId` int(11) NOT NULL,
    `juegoId` int(11) NOT NULL,
    `unidades` int(11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `genero`
  --
  CREATE TABLE `genero` (
    `id` int(11) NOT NULL,
    `nombre` varchar(45) COLLATE utf8_spanish_ci NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;
--
  -- Volcado de datos para la tabla `genero`
  --
INSERT INTO
  `genero` (`id`, `nombre`)
VALUES
  (1, 'Acción'),
  (2, 'Aventura'),
  (3, 'Ciencia Ficción'),
  (4, 'Carreras'),
  (5, 'Deporte'),
  (6, 'Estrategia'),
  (7, 'Rol'),
  (8, 'Shooter'),
  (9, 'Simulación'),
  (10, 'Terror');
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `genero_juego`
  --
  CREATE TABLE `genero_juego` (
    `generoId` int(11) NOT NULL,
    `juegoId` int(11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
  -- Volcado de datos para la tabla `genero_juego`
  --
INSERT INTO
  `genero_juego` (`generoId`, `juegoId`)
VALUES
  (5, 1),
  (4, 3),
  (2, 2),
  (7, 2);
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `juego`
  --
  CREATE TABLE `juego` (
    `id` int(11) NOT NULL,
    `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
    `descripcion` text NOT NULL,
    `portada` varchar(100) NOT NULL,
    `trailer` text NOT NULL,
    `pegi` varchar(100) NOT NULL,
    `precio` decimal(10, 2) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
  -- Volcado de datos para la tabla `juego`
  --
INSERT INTO
  `juego` (
    `id`,
    `nombre`,
    `descripcion`,
    `portada`,
    `trailer`,
    `pegi`,
    `precio`
  )
VALUES
  (
    1,
    'FIFA 22',
    'FIFA 22 es un videojuego de fútbol desarrollado por EA Vancouver y EA Romania, siendo publicado por EA Sports. Está disponible para PlayStation 4, PlayStation 5, Xbox Series X/S, Xbox One, Microsoft Windows, Google Stadia y Nintendo Switch. Es la vigésimo novena entrega en la serie FIFA y fue lanzado el 1 de octubre de manera global.',
    'fifa.jpg',
    '<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/watch?v=SYsi5QuOJNE\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>',
    'pegi3.jpg',
    '59.99'
  ),
  (
    2,
    'The Elder Scrolls V: Skyrim',
    'The Elder Scrolls V: Skyrim es un videojuego de rol de acción del tipo mundo abierto desarrollado por Bethesda Game Studios y publicado por Bethesda Softworks. Skyrim es la quinta entrega de la saga de videojuegos de acción y fantasía de la serie The Elder Scrolls y es posterior a The Elder Scrolls IV: Oblivion y predecesor de The Elder Scrolls Online.',
    'skyrim.jpg',
    '<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/watch?v=JSRtYpNRoN0\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>',
    'pegi18.jpg',
    '39.99'
  ),
  (
    3,
    'Forza',
    'Forza Horizon 5 es un videojuego de carreras desarrollado por Playground Games y publicado por Xbox Game Studios. Es el quinto título de Forza Horizon y la duodécima entrega principal de la serie Forza. El juego está ambientado en una representación ficticia de México',
    'forza.jpg',
    '<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/watch?v=FYH9n37B7Yw\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>',
    'pegi3.jpg',
    '49.99'
  );
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `pedido`
  --
  CREATE TABLE `pedido` (
    `id` int(11) NOT NULL,
    `usuarioId` int(11) NOT NULL,
    `gameKey` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
    `fechaPedido` datetime NOT NULL DEFAULT current_timestamp(),
    `tiempoAlquiler` int(2) NOT NULL,
    `comprado` tinyint(1) DEFAULT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `plataforma`
  --
  CREATE TABLE `plataforma` (
    `id` int(11) NOT NULL,
    `nombre` varchar(45) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
    `logo` varchar(50) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
  -- Volcado de datos para la tabla `plataforma`
  --
INSERT INTO
  `plataforma` (`id`, `nombre`, `logo`)
VALUES
  (1, 'Playstation', 'ps.jpg'),
  (2, 'Pc', 'pc.jpg'),
  (3, 'Xbox', 'xbox.jpg');
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `plataforma_juego`
  --
  CREATE TABLE `plataforma_juego` (
    `plataformaId` int(11) NOT NULL,
    `juegoId` int(11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
  -- Volcado de datos para la tabla `plataforma_juego`
  --
INSERT INTO
  `plataforma_juego` (`plataformaId`, `juegoId`)
VALUES
  (2, 2),
  (1, 1),
  (2, 1),
  (3, 3),
  (3, 1);
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `resenia`
  --
  CREATE TABLE `resenia` (
    `id` int(11) NOT NULL,
    `valoracion` tinyint(1) NOT NULL,
    `mensaje` text NOT NULL,
    `fecha` datetime NOT NULL DEFAULT current_timestamp(),
    `juegoId` int(11) NOT NULL,
    `usuarioId` int(11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `usuario`
  --
  CREATE TABLE `usuario` (
    `id` int(11) NOT NULL,
    `nombre` varchar(40) COLLATE utf8mb4_spanish_ci NOT NULL,
    `apellidos` varchar(40) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
    `email` varchar(40) COLLATE utf8mb4_spanish_ci NOT NULL,
    `identificador` varchar(40) COLLATE utf8mb4_spanish_ci NOT NULL,
    `contrasenna` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
    `codigoCookie` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
    `administrador` tinyint(1) DEFAULT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;
--
  -- Volcado de datos para la tabla `usuario`
  --
INSERT INTO
  `usuario` (
    `id`,
    `nombre`,
    `apellidos`,
    `email`,
    `identificador`,
    `contrasenna`,
    `codigoCookie`,
    `administrador`
  )
VALUES
  (
    1,
    'jlopez',
    'José',
    'López',
    'j@j.com',
    'j',
    '',
    NULL
  ),
  (
    2,
    'i',
    'Iván',
    'Rodríguez',
    'i@i.com',
    'i',
    '',
    1
  );
-- --------------------------------------------------------
  --
  -- Estructura de tabla para la tabla `wishlist`
  --
  CREATE TABLE `wishlist` (
    `usuarioId` int(11) NOT NULL,
    `juegoId` int(11) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;
--
  -- Índices para tablas volcadas
  --
  --
  -- Indices de la tabla `carrito`
  --
ALTER TABLE
  `carrito`
ADD
  KEY `fk_carrito_pedidoId` (`pedidoId`),
ADD
  KEY `fk_carrito_juegoId` (`juegoId`) USING BTREE;
--
  -- Indices de la tabla `genero`
  --
ALTER TABLE
  `genero`
ADD
  PRIMARY KEY (`id`);
--
  -- Indices de la tabla `genero_juego`
  --
ALTER TABLE
  `genero_juego`
ADD
  KEY `fk_genero_juego_generoId` (`generoId`),
ADD
  KEY `fk_genero_juego_juegoId` (`juegoId`);
--
  -- Indices de la tabla `juego`
  --
ALTER TABLE
  `juego`
ADD
  PRIMARY KEY (`id`);
--
  -- Indices de la tabla `pedido`
  --
ALTER TABLE
  `pedido`
ADD
  PRIMARY KEY (`id`),
ADD
  KEY `fk_pedido_usuarioId` (`usuarioId`);
--
  -- Indices de la tabla `plataforma`
  --
ALTER TABLE
  `plataforma`
ADD
  PRIMARY KEY (`id`);
--
  -- Indices de la tabla `plataforma_juego`
  --
ALTER TABLE
  `plataforma_juego`
ADD
  KEY `fk_plataforma_juego_plataformaId` (`plataformaId`),
ADD
  KEY `fk_plataforma_juego_juegoId` (`juegoId`);
--
  -- Indices de la tabla `resenia`
  --
ALTER TABLE
  `resenia`
ADD
  PRIMARY KEY (`id`),
ADD
  KEY `fk_resenia_juegoId` (`juegoId`),
ADD
  KEY `fk_resenia_usuarioId` (`usuarioId`) USING BTREE;
--
  -- Indices de la tabla `usuario`
  --
ALTER TABLE
  `usuario`
ADD
  PRIMARY KEY (`id`);
--
  -- Indices de la tabla `wishlist`
  --
ALTER TABLE
  `wishlist`
ADD
  KEY `fk_wishlist_usuarioId` (`usuarioId`),
ADD
  KEY `fk_wishlist_juegoId` (`juegoId`);
--
  -- AUTO_INCREMENT de las tablas volcadas
  --
  --
  -- AUTO_INCREMENT de la tabla `genero`
  --
ALTER TABLE
  `genero`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 11;
--
  -- AUTO_INCREMENT de la tabla `juego`
  --
ALTER TABLE
  `juego`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;
--
  -- AUTO_INCREMENT de la tabla `pedido`
  --
ALTER TABLE
  `pedido`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT;
--
  -- AUTO_INCREMENT de la tabla `plataforma`
  --
ALTER TABLE
  `plataforma`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;
--
  -- AUTO_INCREMENT de la tabla `resenia`
  --
ALTER TABLE
  `resenia`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT;
--
  -- AUTO_INCREMENT de la tabla `usuario`
  --
ALTER TABLE
  `usuario`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;
--
  -- Restricciones para tablas volcadas
  --
  --
  -- Filtros para la tabla `carrito`
  --
ALTER TABLE
  `carrito`
ADD
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`pedidoId`) REFERENCES `pedido` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`juegoId`) REFERENCES `juego` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
  -- Filtros para la tabla `genero_juego`
  --
ALTER TABLE
  `genero_juego`
ADD
  CONSTRAINT `genero_juego_ibfk_1` FOREIGN KEY (`generoId`) REFERENCES `genero` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `genero_juego_ibfk_2` FOREIGN KEY (`juegoId`) REFERENCES `juego` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
  -- Filtros para la tabla `pedido`
  --
ALTER TABLE
  `pedido`
ADD
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
  -- Filtros para la tabla `plataforma_juego`
  --
ALTER TABLE
  `plataforma_juego`
ADD
  CONSTRAINT `plataforma_juego_ibfk_1` FOREIGN KEY (`plataformaId`) REFERENCES `plataforma` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `plataforma_juego_ibfk_2` FOREIGN KEY (`juegoId`) REFERENCES `juego` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
  -- Filtros para la tabla `resenia`
  --
ALTER TABLE
  `resenia`
ADD
  CONSTRAINT `resenia_ibfk_2` FOREIGN KEY (`juegoId`) REFERENCES `juego` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `resenia_ibfk_3` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
  -- Filtros para la tabla `wishlist`
  --
ALTER TABLE
  `wishlist`
ADD
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`juegoId`) REFERENCES `juego` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `wishlist_ibfk_3` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
  /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;