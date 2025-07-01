-- Datos de prueba generados a partir de Adopta_michi/src/data/data.json
-- Ejecutar después de haber creado las tablas (ver schema.sql)

BEGIN;

-- --------------------------------------------------
-- Tabla users
-- --------------------------------------------------
INSERT INTO users (fullName, email, password, type, createdAt, profilePicture)
VALUES
  ('test1', 'test@unal.edu.co', 'Test1234.', 'regular', '2025-06-14T20:25:35.014Z', NULL),
  ('julian', 'julian@unal.edu.co', 'Test1234.', 'regular', '2025-06-14T20:26:39.594Z', NULL),
  ('Arley', 'dbolivard@unal.edu.co', 'Btxtah46*.', 'admin',  '2025-06-17T03:32:37.803Z', NULL),
  ('Jose Rueda', 'joruedam@unal.edu.co', 'Joseluis1318@', 'regular', '2025-06-19T00:54:31.050Z', 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg'),
  ('admin', 'admin@unal.edu.co', 'Test1234.', 'admin', '2025-06-19T02:53:10.251Z', NULL)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------
-- Tabla cats
-- --------------------------------------------------
INSERT INTO cats (nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3)
VALUES
('Sol', 1, 'Gata tímida pero cariñosa.', 'Regular', 'Sin condiciones especiales', 'en proceso',
 'https://www.infobae.com/resizer/v2/DDBXRQXN4JGVVIIMGCTTQ3AI5Y.jpg?auth=166324b211b263f52e49c4a93d1038e12421c510921caa900c654a2b10fab810&smart=true&width=1200&height=1200&quality=85',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuAgyHhme66b_WC5CrMxvdrTWjHyRY6uZmuasRxSGpaOZTeXH5lMAVKdtGRlmpqSkhyM&usqp=CAU',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzkM3jtcp06wyUtqfearhcZyKhFNRdCh3ChkGFo--iqr0tTkV1F-Oo_m60i9tX2D8axts&usqp=CAU'),
('Simba', 4, 'Curioso y explorador.', 'Critico', 'Sin condiciones especiales', 'en proceso',
 'https://cdn.skoon.com.mx/wp-content/uploads/2021/07/13115111/Gato-persa-gris-.jpg',
 'https://petepua.com/wp-content/uploads/2023/02/gato-Curl-americano.-Laperm-cat.-razas-de-gatos.-razas-de-gatos-segun-FIFE.-petepua.jpg',
 'https://cdn.wamiz.fr/cdn-cgi/image/format=auto,quality=80,width=532,height=532,fit=cover/animal/breed/pictures/666856791352f115722211.jpg'),
('Nina', 4, 'Independiente pero leal.', 'Critico', 'Heterocromía', 'disponible',
 'https://vitalcan.es/wp-content/uploads/kitty-2903812_1280.jpg',
 'https://images.ctfassets.net/denf86kkcx7r/6JC1x08Rgd6t5rYHs2Qyue/36717bfb27a29e772e38603f354355c1/gato_blanco_Photo_2.jpg?fit=fill&w=1024&q=80',
 'https://cdn0.uncomo.com/es/posts/3/8/5/americano_de_pelo_corto_53583_1_600.webp'),
('Tom', -1, 'Pequeño y travieso.', 'Regular', 'Sin condiciones especiales', 'disponible',
 'https://cdn0.expertoanimal.com/es/posts/5/2/6/razas_de_gatos_grises_azulados_23625_5_600.jpg',
 'https://media.graphassets.com/output=format:webp/0jK9PybzS76rYc1grsVm',
 NULL),
('Milo', 1, 'Cariñoso y dormilón.', 'Bueno', 'Sin condiciones especiales', 'disponible',
 'https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN',
 'https://www.infobae.com/resizer/v2/EZSTXGDBEJGQFG3SDCFVSVY2N4.jpg?auth=1c2b2008fdd5b1b9d9dd56e34456a4a889b5841e79269b20abcb72dca1793a5f&smart=true&width=350&height=197&quality=85',
 'https://mascotasonlineblog.wordpress.com/wp-content/uploads/2014/03/patyshibuya-com-br.jpg?w=300&h=225'),
('Ashe', 1, 'Lindo.', 'Regular', 'Sin condiciones especiales', 'disponible',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoef62aQjye60k_gnc2A2dugDoqLyGlrM-vvtBxHA30dftHPrg1ulnRi6sSkdeb6VQgr0&usqp=CAU',
 'https://d2yoo3qu6vrk5d.cloudfront.net/pulzo-lite/images-resized/PP3133988A-h-o.jpg',
 'https://blog.felinus.cl/wp-content/uploads/2022/12/gato-persa-2.png'),
('BRAYANA', 4, 'MUY LINDA', 'Regular', 'Sin condiciones especiales', 'disponible',
 'https://i.pinimg.com/736x/85/4d/8b/854d8b3beea5520a4665c6c473da4aba.jpg',
 'https://i.pinimg.com/originals/ff/5c/a7/ff5ca7984543424590ecd3a836ad07f7.jpg',
 'https://preview.redd.it/my-black-and-white-kittens-fur-is-turning-all-white-v0-ttustiwiejzd1.jpg?width=640&crop=smart&auto=webp&s=00d458cc3fcd52ef11b4279d48ca8a1edc23b5c1'),
('Simba', 1, 'Simba es un gato curioso y juguetón, siempre explorando cada rincón de su entorno. Le encanta la compañía y es muy cariñoso con las personas. Tiene un pelaje suave y brillante, y una mirada llena de inteligencia y ternura. Es sociable con otros animales y se adapta fácilmente a nuevos ambientes. Ideal para familias que buscan un compañero activo y afectuoso.', 'Bueno', 'Sin condiciones especiales', 'disponible', NULL, NULL, NULL),
('BILLS', 2, 'Bills fue rescatado de la calle y está en proceso de recuperación. Aún es tímido, pero con paciencia se deja acariciar. Es ideal para alguien con experiencia en gatos que le dé tiempo y amor.', 'Bueno', 'Rescatado de la Calle', 'disponible', NULL, NULL, NULL);

-- --------------------------------------------------
-- Tabla adoption_requests
-- --------------------------------------------------
INSERT INTO adoption_requests (catId, name, phone, email, message, status)
VALUES
  (1, 'jose', '3113524969', 'joruedam@unal.edu.co', '', 'pendiente'),
  (1, 'Pepe', '4653411', 'jorozcova@unal.edu.co', '', 'rechazada'),
  (2, 'jose', '3113524969', 'joruedam@unal.edu.co', '', 'pendiente')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------
-- Tabla donations
-- --------------------------------------------------
INSERT INTO donations (email, monto, nombre, tarjeta, fecha_tarjeta, cvv)
VALUES
  ('admin@unal.edu.co', 20000, 'Julian', '4111111111111111', '12/50', '123'),
  ('admin@unal.edu.co', 20000, 'Julian', '4111111111111111', '12/29', '123'),
  ('admin@unal.edu.co', 20000, 'Julian', '4111111111111111', '12/85', '123'),
  ('admin@unal.edu.co', 10000, 'Julian', '4111111111111111', '12/25', '123'),
  ('julian@unal.edu.co', 30000, 'Julian', '4111111111111111', '12/85', '123'),
  ('joruedam@unal.edu.co', 10000, 'j', '4111111111111111', '12/25', '123'),
  ('joruedam@unal.edu.co', 20000, 'j', '4111111111111111', '03/26', '124')
ON CONFLICT DO NOTHING;

COMMIT; 