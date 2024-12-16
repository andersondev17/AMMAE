# AMMAE E-commerce 

## Tecnologías Utilizadas

### Backend
- **Node.js & Express**: Framework backend para crear una API RESTful robusta
- **MongoDB**: Base de datos NoSQL para almacenamiento flexible de datos
- **Mongoose**: ODM para modelado de datos y validaciones

### Frontend
- **React**: Biblioteca para construir interfaces de usuario
- **Next.js 14**: Framework React para renderizado del lado del servidor y optimización
- **Tailwind CSS**: Framework de utilidades CSS para diseño moderno
- **Shadcn/ui**: Componentes de UI reutilizables y personalizables
- **React Hook Form**: Manejo de formularios con validación
- **Zod**: Validación de esquemas TypeScript-first
- **Axios**: Cliente HTTP para comunicación con la API

## Justificación de MongoDB como Base de Datos NoSQL

MongoDB fue seleccionado por las siguientes razones:

1. **Esquema Flexible**:
   - Permite manejar productos con diferentes atributos y categorías
   - Facilita la evolución del modelo de datos sin migraciones complejas
   - Soporta documentos anidados para relaciones como productos-categorías

2. **Escalabilidad**:
   - Sharding nativo para distribución horizontal de datos
   - Replicación integrada para alta disponibilidad
   - Manejo eficiente de grandes volúmenes de datos

3. **Rendimiento**:
   - Consultas ricas y flexibles con agregaciones
   - Índices para optimización de búsquedas
   - Excelente rendimiento en operaciones de lectura

4. **Integración**:
   - Compatibilidad nativa con JavaScript/Node.js
   - Driver oficial robusto y bien mantenido
   - Gran ecosistema de herramientas y recursos

## Estructura del Proyecto

```
proyectoMongo/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB y variables de entorno
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Middlewares de autenticación y manejo de errores
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── repositories/   # Capa de acceso a datos
│   │   ├── routes/         # Definición de rutas API
│   │   └── utils/          # Utilidades y helpers
│   ├── .env               # Variables de entorno
│   └── app.js
│   └── package.json
│
└── frontend/
    ├── app/           # Páginas y rutas de Next.js
    ├── components/    # Componentes React reutilizables
    ├── hooks/         # Custom hooks
    ├── lib/           # Utilidades y configuraciones
    ├── services/      # Servicios de API
    └── types/         # Definiciones de TypeScript
    ├── public/           # Archivos estáticos
    └── package.json
```

## Cómo Ejecutar la Aplicación

### Requisitos Previos
- Node.js v18 o superior
- MongoDB 6.0 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el Repositorio**
```bash
git clone https://github.com/andersondev17/AMMAE
cd fashionline
```

2. **Configurar Backend**
```bash
cd backend
cp .env.example .env
npm install
```

3. **Configurar Frontend**
```bash
cd frontend
cp .env.example .env
npm install
```

4. **Configurar Variables de Entorno**
Editar el archivo `.env` en ambas carpetas con las credenciales necesarias:

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/tiendaBD
JWT_SECRET=tu_secreto_jwt
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Frontend `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

5. **Iniciar la Aplicación**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Patrones de Diseño Implementados

1. **Factory Method**:
   - Creación de modelos Mongoose
   - Generación de respuestas API estandarizadas
```bash
class ProductoFactory {
    createSchema() {
        // Define el esquema base con validaciones
        return new mongoose.Schema({...});
    }

    createModel() {
        const ProductoSchema = this.createSchema();
        // Añade middleware y métodos
        // Retorna el modelo compilado
        return mongoose.model('Producto', ProductoSchema);
    }
}
```

2. **Repository Pattern**:
   - Abstracción de la capa de datos
   - Separación de lógica de negocio y acceso a datos
Repositorio (productoRepository): Maneja el acceso a datos
Controlador (productoController.js): Lógica de negocio
Componente React (ProductManagement.tsx): Lógica de presentación

3. **Singleton**:
   - Conexión a base de datos
   - Configuración de la aplicación

```bash
const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar:', error);
        process.exit(1);
    }
};
```

4. **MVC**:
   - Modelos(productos.js) : Define la estructura de datos y validaciones usando ProductoFactory
   - Vistas componentes de react como (ProductManagement.tsx): Maneja la interfaz de usuario en React
   - Controladores (productoController.js): Maneja la lógica de negocio y las respuestas HTTP
   
```bash
{
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    }
}
```
```bash
export const ProductFormSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    // ...
});
```
```bash
getAllProductos = asyncHandler(async (req, res, next) => {
    const { productos, total, pagination } = await this.repository.getAllProductos(req.query);
    res.status(200).json({
        success: true,
        count: productos.length,
        pagination,
        data: productos
    });
});
```
    
## Características Principales

1. **Gestión de Productos**:
   - CRUD completo de productos
   - Búsqueda y filtrado
   - Gestión de stock y alertas

2. **Panel Administrativo**:
   - Dashboard con métricas clave
   - Gestión de inventario

3. **Seguridad**:
    - Validación de datos con zod
