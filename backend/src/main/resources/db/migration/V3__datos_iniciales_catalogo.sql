INSERT INTO habitaciones (nombre, esencia, descripcion, precio, tamano, capacidad, cama, vista, ideal_para) VALUES
('Suite Océano', 'La suite insignia, frente al Pacífico',
 'En el último piso, con el horizonte entero para ti. La terraza privada amueblada invita a desayunar sobre el mar; adentro, la bañera de hidromasaje en mármol y el vestidor independiente completan un espacio pensado para no tener que pedir nada.',
 890.00, 65, 2, 'King size', 'Mar, frontal', 'Aniversarios, lunas de miel y quienes celebran algo grande.'),
('Deluxe Costera', 'Balcón propio y brisa de mar',
 'La habitación favorita de quienes viajan en pareja. El balcón privado mira al mar de costado —perfecto para el café de la mañana—, la ducha de lluvia ocupa medio baño y el escritorio junto a la ventana convierte cualquier pendiente en un trámite con vista.',
 640.00, 45, 2, 'Queen size', 'Mar, lateral', 'Escapadas de fin de semana y viajes en pareja.'),
('Bungalow Privado', 'Una casa junto a la playa, solo para ustedes',
 'Independiente del edificio principal y a treinta pasos de la arena. Piscina propia rodeada de palmeras, cocina completa por si la sobremesa se alarga, sala de estar y dos baños: el espacio se organiza en torno a estar juntos sin estar encima.',
 1350.00, 85, 4, 'King + 2 twin', 'Jardín y playa', 'Familias y grupos de amigos que quieren privacidad total.'),
('Superior Jardín', 'Silencio, madera y verde por la ventana',
 'La puerta de entrada a Puerba Ría. Acogedora, bañada de luz natural y con los jardines como único paisaje sonoro. Todo lo esencial está resuelto —escritorio, minibar, caja fuerte— para que el presupuesto rinda sin renunciar al descanso.',
 420.00, 35, 2, 'Matrimonial', 'Jardín interior', 'Viajeros de paso y estancias de trabajo.');

INSERT INTO habitacion_amenidades (habitacion_id, amenidad, posicion)
SELECT h.id, a.amenidad, a.posicion
FROM habitaciones h
JOIN (VALUES
    ('Suite Océano', 'Terraza privada amueblada', 0),
    ('Suite Océano', 'Bañera de hidromasaje en mármol', 1),
    ('Suite Océano', 'Vestidor independiente', 2),
    ('Suite Océano', 'Minibar premium sin costo el primer día', 3),
    ('Suite Océano', 'Cafetera de espresso', 4),
    ('Suite Océano', 'Servicio de mayordomo', 5),
    ('Deluxe Costera', 'Balcón privado con mesa para dos', 0),
    ('Deluxe Costera', 'Ducha de lluvia efecto spa', 1),
    ('Deluxe Costera', 'Escritorio con vista', 2),
    ('Deluxe Costera', 'Minibar surtido', 3),
    ('Deluxe Costera', 'Albornoz y zapatillas', 4),
    ('Deluxe Costera', 'Blackout total para dormir de más', 5),
    ('Bungalow Privado', 'Piscina privada entre palmeras', 0),
    ('Bungalow Privado', 'Acceso directo a la playa', 1),
    ('Bungalow Privado', 'Cocina completa equipada', 2),
    ('Bungalow Privado', 'Sala de estar independiente', 3),
    ('Bungalow Privado', 'Dos baños completos', 4),
    ('Bungalow Privado', 'Estacionamiento privado', 5),
    ('Superior Jardín', 'Vista a los jardines interiores', 0),
    ('Superior Jardín', 'Escritorio de trabajo', 1),
    ('Superior Jardín', 'Smart TV 55"', 2),
    ('Superior Jardín', 'Minibar', 3),
    ('Superior Jardín', 'Caja fuerte digital', 4),
    ('Superior Jardín', 'Aire acondicionado individual', 5)
) AS a (habitacion, amenidad, posicion) ON a.habitacion = h.nombre;

INSERT INTO habitacion_condiciones (habitacion_id, condicion, posicion)
SELECT h.id, c.condicion, c.posicion
FROM habitaciones h
JOIN (VALUES
    ('Suite Océano', 'Desayuno incluido', 0),
    ('Suite Océano', 'Cancelación gratuita hasta 48 h antes', 1),
    ('Suite Océano', 'Late check-out sujeto a disponibilidad', 2),
    ('Deluxe Costera', 'Desayuno incluido', 0),
    ('Deluxe Costera', 'Cancelación gratuita hasta 48 h antes', 1),
    ('Bungalow Privado', 'Desayuno incluido para 4', 0),
    ('Bungalow Privado', 'Cancelación gratuita hasta 72 h antes', 1),
    ('Bungalow Privado', 'Admite mascotas pequeñas', 2),
    ('Superior Jardín', 'Desayuno incluido', 0),
    ('Superior Jardín', 'Cancelación gratuita hasta 24 h antes', 1)
) AS c (habitacion, condicion, posicion) ON c.habitacion = h.nombre;

INSERT INTO habitacion_fotos (habitacion_id, src, alt, posicion)
SELECT h.id, f.src, f.alt, f.posicion
FROM habitaciones h
JOIN (VALUES
    ('Suite Océano', 'assets/suite-oceano.jpg', 'Dormitorio de la Suite Océano con ventanal hacia el Pacífico', 0),
    ('Suite Océano', 'assets/rooms/suite-oceano-panoramica.jpg', 'El Pacífico visto desde la terraza de la suite', 1),
    ('Suite Océano', 'assets/rooms/suite-oceano-detalle.jpg', 'Salón privado de la Suite Océano', 2),
    ('Suite Océano', 'assets/rooms/suite-oceano-atardecer.jpg', 'Atardecer desde las camas balinesas junto a la piscina', 3),
    ('Deluxe Costera', 'assets/deluxe-costera.jpg', 'Habitación Deluxe Costera con vista lateral al mar', 0),
    ('Deluxe Costera', 'assets/rooms/deluxe-costera-cama.jpg', 'Cama queen de la Deluxe Costera al caer la tarde', 1),
    ('Deluxe Costera', 'assets/rooms/deluxe-costera-noche.jpg', 'Ambiente nocturno de la Deluxe Costera', 2),
    ('Bungalow Privado', 'assets/bungalow-privado.jpg', 'Bungalow Privado rodeado de vegetación', 0),
    ('Bungalow Privado', 'assets/rooms/bungalow-alberca.jpg', 'Piscina del bungalow entre palmeras y terrazas de madera', 1),
    ('Bungalow Privado', 'assets/hotel-pool.jpg', 'Zona de piscinas de Puerba Ría al mediodía', 2),
    ('Superior Jardín', 'assets/superior-jardin.jpg', 'Habitación Superior Jardín con luz de la mañana', 0),
    ('Superior Jardín', 'assets/rooms/superior-jardin-luz.jpg', 'Detalle en madera de la Superior Jardín frente al jardín interior', 1),
    ('Superior Jardín', 'assets/rooms/superior-jardin-terraza.jpg', 'Solárium del hotel con los cerros de la costa al fondo', 2)
) AS f (habitacion, src, alt, posicion) ON f.habitacion = h.nombre;

INSERT INTO tratamientos_spa (icono, nombre, descripcion, duracion, precio) VALUES
('pi-heart', 'Masaje Balinés',
 'Amasamientos profundos, presión en puntos energéticos y estiramientos pasivos con aceites tibios para liberar tensiones crónicas.', '75 min', 320.00),
('pi-star', 'Facial Luminosidad',
 'Tratamiento personalizado con activos marinos y ácido hialurónico. Revitaliza, ilumina y unifica el tono de la piel.', '60 min', 280.00),
('pi-cloud', 'Circuito Termal',
 'Sauna finlandesa, baño turco, ducha de contrastes y piscina climatizada con jets de hidromasaje.', '90 min', 220.00),
('pi-sparkles', 'Envoltura Corporal',
 'Exfoliación con sal de Maras seguida de envoltura de algas marinas y manteca de karité. Piel sedosa y nutrida.', '60 min', 300.00),
('pi-compass', 'Reflexología Podal',
 'Masaje en puntos reflejos de los pies que equilibra el sistema nervioso. Profundamente relajante.', '45 min', 190.00),
('pi-bolt', 'Masaje Deportivo',
 'Técnica intensiva sobre grupos musculares específicos. Ideal tras el surf o para liberar contracturas profundas.', '60 min', 260.00);

INSERT INTO paquetes_spa (etiqueta, nombre, descripcion, imagen, duracion, precio) VALUES
('El más pedido', 'Escapada Renovadora',
 'Media jornada de bienestar intensivo para desconectar del mundo y reconectar contigo.',
 'assets/spa/masaje-aceites.jpg', '4 horas', 750.00),
('Experiencia premium', 'Ritual del Pacífico',
 'Un día completo de bienestar que termina frente al mar, con cena degustación incluida.',
 'assets/spa/ritual-facial.jpg', 'Día completo', 1350.00);

INSERT INTO paquete_spa_incluye (paquete_id, detalle, posicion)
SELECT p.id, i.detalle, i.posicion
FROM paquetes_spa p
JOIN (VALUES
    ('Escapada Renovadora', 'Masaje Balinés de 75 minutos', 0),
    ('Escapada Renovadora', 'Facial Luminosidad personalizado', 1),
    ('Escapada Renovadora', 'Circuito termal (2 horas)', 2),
    ('Escapada Renovadora', 'Almuerzo wellness en Mare Nostrum', 3),
    ('Escapada Renovadora', 'Kit de amenities orgánicos de regalo', 4),
    ('Ritual del Pacífico', 'Circuito termal con acceso ilimitado', 0),
    ('Ritual del Pacífico', 'Envoltura corporal de algas marinas', 1),
    ('Ritual del Pacífico', 'Masaje Balinés de 90 minutos', 2),
    ('Ritual del Pacífico', 'Sesión privada de yoga al atardecer', 3),
    ('Ritual del Pacífico', 'Cena degustación en Mare Nostrum', 4),
    ('Ritual del Pacífico', 'Zona VIP de relax con espumante', 5)
) AS i (paquete, detalle, posicion) ON i.paquete = p.nombre;
