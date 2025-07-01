# Backend_Adopta_Michi

API REST para la plataforma **Adopta un Michi**. Construida con Node.js + Express + TypeScript y PostgreSQL.

---
## Requisitos

- Node 18 o superior
- PostgreSQL 12 o superior

---
## Instalación

```bash
# Clona el proyecto y entra al backend
 git clone <repo-url>
 cd Backend_Adopta_Michi

# Instala dependencias
 npm install
```

---
## Variables de entorno

Crea un archivo `.env` en la raíz de esta carpeta con los siguientes valores (ajusta según tu entorno):

```dotenv
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=adopta_michi


# Puerto donde escuchará Express
PORT=4000
```

---
## Inicializar la base de datos

1. Crear la base vacía (una vez):
   ```bash
   createdb -U postgres adopta_michi
   ```
2. Cargar esquema y datos de prueba:
   ```bash
   psql -U postgres -d adopta_michi -f schemas/schema.sql
   psql -U postgres -d adopta_michi -f schemas/data_seed.sql
   ```

---
## Scripts útiles

| Comando                | Descripción                               |
|------------------------|-------------------------------------------|
| `npm run dev`          | Ejecuta el servidor en modo desarrollo (ts-node-dev) |
| `npm run build`        | Compila TypeScript a JavaScript (carpeta `dist`) |
| `npm start`            | Arranca el servidor usando los archivos compilados |

---
## Endpoints principales

| Método | Ruta                | Descripción                      |
|--------|---------------------|----------------------------------|
| GET    | `/api/cats`         | Lista todos los gatos            |
| GET    | `/api/cats/:id`     | Obtiene gato por id              |
| POST   | `/api/auth/login`   | Iniciar sesión                   |
| POST   | `/api/adoptions`    | Crear solicitud de adopción      |
| GET    | `/api/donations`    | Consulta donaciones              |

Todas las rutas están en `src/routes/` y sus controladores en `src/controllers/`.


---
## Licencia

Repositorio con fines académicos – Universidad de Medellín (Desarrollo Web 1).