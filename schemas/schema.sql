-- 1) Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  fullName      VARCHAR(100) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  type          VARCHAR(20)  DEFAULT 'regular',   -- 'admin' | 'regular'
  profilePicture TEXT,
  createdAt     TIMESTAMP DEFAULT NOW()
);

-- 2) Tabla de gatos
CREATE TABLE IF NOT EXISTS cats (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  edad           VARCHAR(50),
  descripcion    TEXT,
  estado         VARCHAR(50),        -- Ej: 'Saludable'
  condicion      VARCHAR(100),       -- Ej: 'Vacunado'
  disponibilidad VARCHAR(20) NOT NULL DEFAULT 'disponible', -- 'disponible' | 'adoptado'
  imagen         TEXT,
  imagen2        TEXT,
  imagen3        TEXT,
  createdAt      TIMESTAMP DEFAULT NOW()
);

-- 3) Solicitudes de adopción
CREATE TABLE IF NOT EXISTS adoption_requests (
  id        SERIAL PRIMARY KEY,
  catId     INT REFERENCES cats(id) ON DELETE CASCADE,
  name      VARCHAR(100) NOT NULL,
  phone     VARCHAR(30),
  email     VARCHAR(120) NOT NULL,
  message   TEXT,
  status    VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente' | 'aprobada' | 'rechazada'
  createdAt TIMESTAMP DEFAULT NOW()
);

-- 4) Donaciones
CREATE TABLE IF NOT EXISTS donations (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(120) NOT NULL,
  monto         NUMERIC(10,2) NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  tarjeta       VARCHAR(25)  NOT NULL, -- se recomienda tokenizar en producción
  fecha_tarjeta VARCHAR(7)   NOT NULL, -- MM/AAAA
  cvv           VARCHAR(4)   NOT NULL,
  createdAt     TIMESTAMP DEFAULT NOW()
);