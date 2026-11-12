# GuitarsLA Backend

> API REST académica para administrar el catálogo de guitarras de GuitarsLA, desarrollada con Node.js, Express, TypeScript, Sequelize y PostgreSQL.

## Índice

1. [Visión general](#visión-general)
	- [Qué hace este proyecto](#qué-hace-este-proyecto)
	- [Capturas de pantalla](#capturas-de-pantalla)
2. [Ficha técnica](#ficha-técnica)
	- [Lenguajes y versiones](#lenguajes-y-versiones)
	- [Librerías y dependencias](#librerías-y-dependencias)
	- [Herramientas de desarrollo](#herramientas-de-desarrollo)
3. [Entorno de desarrollo](#entorno-de-desarrollo)
4. [Arquitectura](#arquitectura)
	- [Organización del proyecto](#organización-del-proyecto)
	- [Rutas de la API](#rutas-de-la-api)
	- [Modelo de datos](#modelo-de-datos)

---

## Visión general

GuitarsLA Backend es el servidor de la aplicación de guitarras. Expone una API REST con Express, persiste la información en PostgreSQL y utiliza Sequelize para definir el modelo y consultar la base de datos.

### Qué hace este proyecto

- Registra guitarras y devuelve el registro creado.
- Consulta y devuelve el catálogo ordenado por identificador.
- Valida en el servidor que los campos de texto no estén vacíos y que el precio sea un número mayor que cero.
- Conecta con PostgreSQL mediante la variable de entorno `DATABASE_URL`.

### Capturas de pantalla

Las capturas muestran las solicitudes GET y POST probadas en Postman y los registros guardados en PostgreSQL, consultados desde TablePlus.

**Consulta del catálogo con GET:**

![Solicitud GET al endpoint de guitarras con respuesta 200 OK en Postman](./src/assets/Metodo_GETALL.png)

**Registro de una guitarra con POST:**

![Solicitud POST al endpoint de guitarras con respuesta 201 Created en Postman](./src/assets/Metodo_POST.png)

**Registros en PostgreSQL vistos con TablePlus:**

![Tabla guitars con registros consultada desde TablePlus](./src/assets/TablePlus_Prueba.png)

---

## Ficha técnica

### Lenguajes y versiones

| Tecnología | Versión o configuración |
| --- | --- |
| TypeScript | `^5.2.2` en `package.json` |
| JavaScript | Generado por TypeScript con objetivo ES2020 |
| SQL | PostgreSQL; la versión del servidor no está fijada en el proyecto |
| Node.js | Entorno de ejecución; la versión no está fijada en `package.json` |

### Librerías y dependencias

| Dependencia | Versión declarada | Uso |
| --- | --- | --- |
| `express` | `^4.18.2` | Servidor HTTP y definición de rutas. |
| `sequelize` | `^6.37.8` | ORM para consultar y persistir datos. |
| `sequelize-typescript` | `^2.1.6` | Modelos Sequelize definidos con decoradores TypeScript. |
| `pg` | `^8.23.1` | Driver de PostgreSQL. |
| `pg-hstore` | `^2.3.4` | Serialización utilizada por Sequelize para PostgreSQL. |
| `express-validator` | `^7.3.2` | Validación de los datos recibidos por el POST. |
| `dotenv` | `^18.0.9` | Carga de variables desde `.env`. |
| `typescript` | `^5.2.2` | Compilador y sistema de tipos. |
| `ts-node` | `^10.9.1` | Ejecución de TypeScript durante el desarrollo. |
| `nodemon` | `^3.0.1` | Reinicio del servidor cuando cambian los archivos. |
| `@types/express` | `^4.17.20` | Tipos de Express para TypeScript. |

### Herramientas de desarrollo

| Herramienta | Uso |
| --- | --- |
| Postman | Enviar solicitudes GET y POST para probar la API. |
| TablePlus | Consultar la base de datos PostgreSQL y revisar los registros. |
| npm | Instalar dependencias y ejecutar los scripts del proyecto. |

---

## Entorno de desarrollo

Se requiere Node.js, npm y una instancia de PostgreSQL accesible desde el backend. Configura `DATABASE_URL` en un archivo `.env` dentro de `Backend`. `PORT` es opcional; si no se define, el servidor escucha en el puerto `4002`.

```env
DATABASE_URL=postgres://usuario:contrasena@localhost:5432/nombre_base
PORT=4002
```

Para instalar las dependencias e iniciar el servidor desde esta carpeta:

```bash
npm install
npm run dev
```

La API estará disponible en `http://localhost:4002`. Al iniciar, el backend autentica la conexión y ejecuta `db.sync()` para sincronizar el modelo con la tabla.

En desarrollo, el frontend usa un proxy de Vite para reenviar las peticiones `/api` al backend. Express no configura middleware CORS explícito.

---

## Arquitectura

El backend separa la conexión a la base de datos, el modelo, la lógica de las solicitudes y el registro de rutas:

```text
Cliente (Postman o frontend)
			 |
			 v
Express -> Router -> Handler -> Modelo Sequelize -> PostgreSQL
```

### Organización del proyecto

```text
src/
├── config/
│   └── db.ts
├── handlers/
│   └── guitar.ts
├── models/
│   └── Guitar.model.ts
├── index.ts
├── router.ts
└── server.ts
```

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `src/config/db.ts` | Configura Sequelize con `DATABASE_URL` y registra los modelos. |
| `src/models/Guitar.model.ts` | Define el modelo `Guitar` y la tabla `guitars`. |
| `src/handlers/guitar.ts` | Consulta el catálogo y valida y crea guitarras. |
| `src/router.ts` | Asocia los métodos HTTP con sus handlers. |
| `src/server.ts` | Configura Express, el parseo JSON y el prefijo `/api`. |
| `src/index.ts` | Carga la configuración, conecta con la base y levanta el servidor. |

### Rutas de la API

| Método | Ruta | Descripción | Respuesta esperada |
| --- | --- | --- | --- |
| `GET` | `/api/guitar` | Devuelve todas las guitarras, ordenadas por `id`. | `200 OK` con un arreglo JSON. |
| `POST` | `/api/guitar` | Valida y guarda una guitarra. | `201 Created` con el registro creado; `400 Bad Request` si falla la validación. |

Ejemplo de cuerpo JSON para `POST /api/guitar`:

```json
{
  "name": "Guitarra de ejemplo",
  "image": "guitarra_13",
  "description": "Guitarra eléctrica de seis cuerdas",
  "price": 799.99
}
```

El router también contiene respuestas provisionales para `PUT /api/` y `DELETE /api/`; todavía no implementan operaciones de actualización o eliminación de guitarras.

### Modelo de datos

El modelo `Guitar` se sincroniza con la tabla `guitars` y contiene los siguientes campos:

| Campo | Tipo Sequelize | Descripción |
| --- | --- | --- |
| `id` | Identificador del modelo | Clave primaria autogenerada por Sequelize. |
| `name` | `CHAR(100)` | Nombre de la guitarra. |
| `image` | `STRING` | Nombre o referencia de la imagen. |
| `description` | `TEXT` | Descripción de la guitarra. |
| `price` | `FLOAT(6,2)` | Precio; debe ser mayor que cero al crear el registro. |

---

## Evidencia de ejecución

![Backend conectado a PostgreSQL y API escuchando en el puerto 4002](./src/assets/No_Error_Back.png)
