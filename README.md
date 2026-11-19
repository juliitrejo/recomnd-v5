# Recomnd — Bitácora Cultural de Recomendaciones por Mood

Aplicación web interactiva desarrollada en **React + Vite (JavaScript)** y conectada a **Firebase (Cloud Firestore)** para la materia **Desarrollo Frontend II** (UADE).

## Parte 1: ¿Qué es Recomnd, qué hace y cómo surgió?

### Cómo surgió el proyecto

**Recomnd** nació como el Trabajo Práctico II de **Belén Bourg** y **Julieta Trejo** para la materia *Desarrollo Frontend II* (docente: Joaquín Cerviño). La idea surgió a partir de una necesidad cotidiana y real: cuando amigos, familiares, compañeros de cursada o redes sociales nos recomiendan una película, una serie o un libro, muchas veces olvidamos a los pocos días el título o quién nos lo sugirió.

A lo largo de **cinco versiones iterativas** (desde un primer MVP funcional en *v1.0* hasta la consolidación de su identidad editorial en *v5.0*), construimos una bitácora cultural dinámica, ágil y *serverless* con identidad visual propia, pensada tanto para computadora como para dispositivos móviles.

### Qué hace la aplicación

Recomnd funciona como un *tracker* personal para centralizar recomendaciones culturales y encontrar rápidamente qué ver o leer según el momento:

- **Registro completo de recomendaciones:** formulario con validaciones básicas que permite guardar 5 datos clave en la nube: **Título** de la obra, **Categoría** (*Película*, *Serie* o *Libro*), **Mood / Ocasión** (7 estados de ánimo: *Para reflexionar*, *Para maratonear*, *Para reírse*, *Para inspirarse*, *Para Desconectar*, *Para asustarse* y *Para llorar*), **Quién lo recomendó** y **Motivo / Por qué vale la pena**, registrando además su estado inicial (*Pendiente*) y la fecha y hora de creación en Firebase.

- **Búsqueda y filtrado por mood en tiempo real:**
  - **Barra de búsqueda instantánea:** filtra dinámicamente por título de la obra o por el nombre de la persona que hizo la recomendación.
  - **Selector horizontal de estados de ánimo:** barra de filtros rápidos (*"¿Cómo te sentís?"* fijo a la izquierda y píldoras con scroll horizontal independiente) para explorar recomendaciones según el estado de ánimo del usuario.
  - **Ordenamiento dinámico:** selector para ordenar la lista por **Recientes** o **Alfabéticamente (A - Z)**.

- **Gestión CRUD completa sincronizada con Firebase:**
  - **Consulta y persistencia en la nube:** lectura y creación de recomendaciones conectadas a **Cloud Firestore** con indicadores de carga y alertas ante errores, manteniendo toda la colección intacta al recargar la página o abrir la app desde otro dispositivo.
  - **Modificación de estado (*Pendiente* / *Vista*):** botón interactivo en cada tarjeta que alterna entre `⏳ Pendiente` y `✅ Vista`, actualizando el campo `watched` directamente en Cloud Firestore (`updateDoc`).
  - **Eliminación:** borrado permanente de tarjetas con confirmación previa sincronizado con la base de datos.

- **Diseño adaptativo y modo oscuro:**
  - **Interfaz *responsive*:** grilla adaptativa de dos columnas en escritorio y columna única en dispositivos móviles, con listado scrolleable de altura controlada (`720px`) para una lectura cómoda sin cortes visuales.
  - **Modo claro / Modo oscuro:** alternancia visual entre el tema editorial crema cálido y un tema nocturno en tonos ciruela profundo (`#140F1D`) y lavanda, persistido mediante `localStorage`.

---

## Parte 2: Arquitectura técnica, funcionamiento con Firebase y configuración

### Arquitectura general y separación de código y datos

Recomnd está construida bajo una arquitectura *serverless* en **React + Vite** escrita íntegramente en **JavaScript (`.js` y `.jsx`)**. El proyecto separa la interfaz visual de la configuración y los servicios de datos:

- **`src/App.jsx`**: componente principal que gestiona el estado local (`useState`, `useEffect`), el formulario de alta, los filtros combinados (búsqueda + mood + ordenamiento), el cambio de estado *Pendiente / Vista*, la alternancia de tema claro/oscuro y el renderizado de las tarjetas.
- **`src/index.css`**: hoja de estilos globales que define la tipografía editorial (`Fraunces` y `Plus Jakarta Sans`), las barras de desplazamiento personalizadas, el diseño *responsive* y las reglas del modo oscuro (`.dark-theme`).
- **`src/firebase/config.js`**: inicializa la aplicación de Firebase (`initializeApp`) y exporta la instancia de **Cloud Firestore** (`getFirestore`) utilizando las variables de entorno de Vite.
- **`src/services/recommendationsService.js`**: centraliza todas las operaciones CRUD contra la colección `recommendations` en Cloud Firestore (`addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`, `query`, `orderBy`, `serverTimestamp`), incluyendo `saveRecommendation`, `getRecommendations`, `updateRecommendationStatus` y `deleteRecommendation`.
- **`public/logo-recomnd.png`**: isotipo gráfico de la aplicación utilizado en el encabezado principal.

### Variables de entorno (`.env` y `.env.example`)

La conexión con Firebase se gestiona mediante variables de entorno con el prefijo `VITE_`, que Vite inyecta en tiempo de compilación a través de `import.meta.env`. Para mantener limpio el repositorio, `.env`, `node_modules` y `dist` están excluidos en `.gitignore`, mientras que `.env.example` documenta las claves necesarias sin valores reales:

```env
VITE_FIREBASE_API_KEY=valor_de_apiKey
VITE_FIREBASE_AUTH_DOMAIN=valor_de_authDomain
VITE_FIREBASE_PROJECT_ID=valor_de_projectId
VITE_FIREBASE_APP_ID=valor_de_appId
```

En entorno local estas variables se leen desde `.env` en la raíz del proyecto; en el despliegue productivo de **Vercel**, se cargan en *Settings → Environment Variables* para el entorno *Production* (utilizando tipo **Config** para variables públicas `VITE_`).

### Modelo de datos en Cloud Firestore

La base de datos en **Cloud Firestore** organiza la información en una colección principal llamada **`recommendations`**, donde cada documento representa una recomendación guardada con la siguiente estructura:

- **`title`** *(string)*: título de la película, serie o libro recomendado.
- **`category`** *(string)*: formato de la obra (`"Película"`, `"Serie"` o `"Libro"`).
- **`mood`** *(string)*: estado de ánimo u ocasión asociada (`"Para reflexionar"`, `"Para maratonear"`, `"Para reírse"`, `"Para inspirarse"`, `"Para Desconectar"`, `"Para asustarse"` o `"Para llorar"`).
- **`recommender`** *(string)*: persona, red social o fuente que recomendó el título.
- **`reason`** *(string)*: reseña breve o motivo opcional por el cual vale la pena ver o leer la obra.
- **`watched`** *(boolean)*: indica si la obra ya fue vista/leída (`true`) o sigue pendiente (`false`).
- **`createdAt`** *(timestamp)*: marca de tiempo generada por el servidor (`serverTimestamp()`) para ordenar cronológicamente las recomendaciones.

### Reglas de seguridad (`firestore.rules`)

La base de datos cuenta con reglas de validación definidas en `firestore.rules` y publicadas en Firebase Console para controlar la estructura e integridad de los documentos en `recommendations`, permitir la actualización del estado `watched` y bloquear el acceso a cualquier otra colección no declarada:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /recommendations/{recId} {
      allow read: if true;
      allow create: if request.resource.data.title is string
        && request.resource.data.title.size() > 0
        && request.resource.data.title.size() <= 150
        && request.resource.data.recommender is string
        && request.resource.data.recommender.size() > 0
        && request.resource.data.recommender.size() <= 100
        && request.resource.data.category is string
        && request.resource.data.mood is string;
      allow update: if request.resource.data.watched is bool;
      allow delete: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Instalación y ejecución local

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Instalar las dependencias con `npm install`.
3. Crear un archivo `.env` en la raíz (junto a `package.json`) tomando como base `.env.example` y completarlo con las credenciales del proyecto de Firebase.
4. Publicar el contenido de `firestore.rules` en **Firebase Console → Firestore Database → Reglas**.
5. Iniciar el servidor de desarrollo con `npm run dev` y abrir la URL local indicada por Vite.

### Comandos del proyecto

Con Node.js (v18+) instalado, el proyecto utiliza los siguientes scripts definidos en `package.json`:

| Comando | Función |
| :--- | :--- |
| `npm install` | Instala las dependencias del proyecto (`react`, `react-dom`, `vite`, `firebase`). |
| `npm run dev` | Levanta el servidor local de desarrollo con Vite (`http://localhost:5173`). |
| `npm run build` | Genera la compilación optimizada de producción en el directorio `dist/` (utilizada por Vercel). |
| `npm run preview` | Previsualiza localmente la build de producción generada en `dist/`. |

---

**Creadoras de Recomnd:** Belén Bourg y Julieta Trejo · **Docente:** Joaquín Cerviño · **Materia:** Desarrollo Frontend II (UADE).