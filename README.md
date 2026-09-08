# 🎟️ EventPass API - Primer Examen Parcial Práctico

> **Materia:** Programación Backend  
> **Framework:** NestJS + TypeORM + MySQL  
> **Tiempo Estimado de Desarrollo:** 45 - 60 minutos  
> **Modalidad:** Práctica guiada con Asistente de IA + Sustentación Oral Individual  

---

## 🧭 1. Descripción del Proyecto y Dominio

**EventPass API** es un sistema backend modular para la gestión de eventos y registro de asistentes. La arquitectura sigue los principios de diseño modular de NestJS, separación de responsabilidades (SRP), validación estricta en el borde de la aplicación con DTOs y persistencia relacional asíncrona mediante TypeORM.

```
┌─────────────────┐             1 : N             ┌────────────────────┐
│     Evento      │ ────────────────────────────► │     Asistente      │
│ (Módulo Eventos)│                               │(Módulo Asistentes) │
└─────────────────┘                               └────────────────────┘
```

---

## 🏗️ 2. Mapa de Arquitectura y Flujo de Datos

```
[ Cliente HTTP / Postman ]
       │
       ▼ (Request con payload JSON)
[ ValidationPipe Global (main.ts) ] ── (¿Cumple DTO? No ➔ 400 Bad Request)
       │
       ▼
[ AsistentesController (@Post, @Get, @Patch, @Delete) ]
       │
       ▼ (Invoca método)
[ AsistentesService (Lógica de Negocio) ] ──► [ EventosService inyectado ] (Valida existencia del Evento ➔ 404 si no existe)
       │
       ▼ (Operaciones con TypeORM)
[ Repository<Asistente> ]
       │
       ▼ (SQL Queries)
[ Base de Datos MySQL ]
```

---

## 🚀 3. Instrucciones de Configuración y Levantamiento

### Paso 3.1: Instalar dependencias
```bash
npm install
```

### Paso 3.2: Configurar Variables de Entorno
Copia el archivo `.env.example` y crea tu archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

Configura tus credenciales de MySQL y el puerto asignado:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=eventos_nest_db
DB_SYNC=false
DB_LOGGING=false
```

> [!IMPORTANT]
> **Crear la Base de Datos antes de arrancar:** Crea la base de datos `eventos_nest_db` (o el nombre que definas) en tu gestor de MySQL (phpMyAdmin, DBeaver, MySQL Workbench o consola).

### Paso 3.3: Iniciar el Servidor en Modo Desarrollo
```bash
npm run start:dev
```
La API estará disponible con prefijo global en: `http://localhost:3000/api`

---

## 🎯 4. Retos Prácticos a Resolver

Dispones del tiempo de la prueba para resolver los siguientes puntos en el código:

### 🔹 Reto 1: Levantamiento y Puerto Personalizado
* Configura la aplicación para ejecutarse en el puerto **`PORT=4000`**.
* Verifica que `main.ts` y `ConfigService` lean la variable correctamente y que el prefijo global sea `/api`.

### 🔹 Reto 2: Migración de Atributo en Entidad y DTOs
* En el módulo `asistentes`, agrega el atributo **`codigoTicket`** (cadena de texto única, alfanumérica, obligatoria):
  1. Agrega `@Column({ type: 'varchar', length: 50, unique: true })` en `src/asistentes/entities/asistente.entity.ts`.
  2. Agrega las validaciones correspondientes (`@IsString`, `@IsNotEmpty`, `@MinLength(4)`) en `src/asistentes/dto/create-asistente.dto.ts`.
  3. Asegúrate de que `src/asistentes/dto/update-asistente.dto.ts` herede usando `PartialType`.

### 🔹 Reto 3: Inyección de Dependencias entre Módulos
* Para crear un asistente (`POST /api/asistentes`), es obligatorio asociarlo a un evento mediante `eventoId`.
* **Regla estricta:** `AsistentesService` **NO** debe consultar la tabla de eventos directamente con TypeORM; debe inyectar `EventosService` y llamar a `this.eventosService.findOne(eventoId)`.
* Si el evento no existe, la API debe responder automáticamente con **`404 Not Found`** generado por `EventosService`.

### 🔹 Reto 4: Consulta de Relaciones (Eager / Relations)
* Al consultar un evento por ID (`GET /api/eventos/:id`) o listar todos (`GET /api/eventos`), el resultado debe incluir el arreglo de sus asistentes asociados (`relations: { asistentes: true }`).

---

## 📋 5. Catálogo de Endpoints de la API

### Módulo Eventos (`/api/eventos`)
| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/eventos` | Crea un nuevo evento | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `GET` | `/api/eventos` | Lista todos los eventos con sus asistentes | `200 OK` |
| `GET` | `/api/eventos/:id` | Obtiene un evento por ID con sus asistentes | `200 OK`, `404 Not Found`, `400 Bad Request` |
| `PATCH` | `/api/eventos/:id` | Actualiza campos de un evento | `200 OK`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/api/eventos/:id` | Elimina un evento y sus asistentes en cascada | `200 OK`, `404 Not Found` |

### Módulo Asistentes (`/api/asistentes`)
| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/asistentes` | Registra un asistente validando su evento | `201 Created`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/api/asistentes` | Lista todos los asistentes con datos de su evento | `200 OK` |
| `GET` | `/api/asistentes/:id` | Obtiene un asistente por ID | `200 OK`, `404 Not Found` |
| `PATCH` | `/api/asistentes/:id` | Actualiza datos del asistente o reasigna evento | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/asistentes/:id` | Elimina un asistente | `200 OK`, `404 Not Found` |

---

## 🧪 6. Payloads de Prueba para Postman / Thunder Client

### 1. Crear Evento
`POST http://localhost:3000/api/eventos`
```json
{
  "titulo": "Conferencia de Arquitectura Backend 2026",
  "descripcion": "Patrones de diseño, microservicios y NestJS avanzado",
  "cupoMaximo": 150,
  "estado": "ACTIVO"
}
```

### 2. Registrar Asistente (Asociado al Evento ID: 1)
`POST http://localhost:3000/api/asistentes`
```json
{
  "nombreCompleto": "Carlos Rodríguez",
  "correo": "carlos.rodriguez@example.com",
  "telefono": "+57 310 9876543",
  "eventoId": 1
}
```

### 3. Casos de Prueba de Validación (Demostraciones en Vivo)
* **Error 400 (Propiedad no permitida):** Enviar payload con `"campoInvalido": 123` (Demuestra `forbidNonWhitelisted: true`).
* **Error 400 (Validación DTO):** Enviar `"cupoMaximo": -5` o `"correo": "no-es-correo"`.
* **Error 404 (Inyección entre servicios):** Enviar `"eventoId": 9999` al registrar asistente.
* **Error 409 (Conflicto de unicidad):** Intentar registrar un evento con el mismo `titulo`.

---

## 🎓 7. Criterios de Evaluación y Sustentación Oral

El uso de asistentes de IA está permitido durante el desarrollo. La calificación final se basa en la **demostración funcional en vivo** y en la **sustentación individual**:

| Criterio | Porcentaje | Aspectos a Evaluar |
| :--- | :--- | :--- |
| **Funcionalidad y Pruebas en Vivo** | **30%** | La API compila, conecta a MySQL, responde en el puerto configurado y pasa las pruebas en Postman sin errores 500. |
| **Arquitectura de Módulos e Inyección** | **30%** | Correcta configuración de `imports`, `exports`, inyección de servicios y desacoplamiento. |
| **Sustentación Oral Individual** | **40%** | Explicación técnica de las decisiones de código generadas, decoradores utilizados, flujo de datos y capacidad de realizar ajustes en vivo. |

---

## 📂 8. Estructura del Código Fuente

```
src/
├── app.module.ts                   # Módulo raíz (carga global de ConfigModule)
├── main.ts                         # Bootstrap de NestJS con ValidationPipe global
├── database/
│   └── database.module.ts          # Conexión asíncrona a MySQL con ConfigService
├── eventos/                        # Módulo Eventos (Padre)
│   ├── dto/
│   │   ├── create-evento.dto.ts
│   │   └── update-evento.dto.ts
│   ├── entities/
│   │   └── evento.entity.ts
│   ├── eventos.controller.ts
│   ├── eventos.service.ts
│   └── eventos.module.ts
└── asistentes/                     # Módulo Asistentes (Hijo)
    ├── dto/
    │   ├── create-asistente.dto.ts
    │   └── update-asistente.dto.ts
    ├── entities/
    │   └── asistente.entity.ts
    ├── asistentes.controller.ts
    ├── asistentes.service.ts
    └── asistentes.module.ts
```
