# AMMAE E-commerce 

## Tecnologías Utilizadas

### Stack MERN:

- **MongoDB**: Base de datos NoSQL para almacenamiento flexible de datos
- **Node.js & Express**: Framework backend para crear una API RESTful robusta
- **React/Next.js**: Frontend

### Frontend
- **React**: Biblioteca para construir interfaces de usuario
- **Next.js 14**: Framework React para renderizado del lado del servidor y optimización y mejor tipado
- **Tailwind CSS**: Framework de utilidades CSS para diseño moderno
- **Shadcn/ui**: Componentes de UI reutilizables y personalizables
- **Zod**: Validación de esquemas TypeScript-first
- **Axios**: Cliente HTTP para comunicación con la API
- **Toast**: Manejo de Errores y Notificaciones

## Justificación de MongoDB como Base de Datos NoSQL

MongoDB fue seleccionado por las siguientes razones:

1. **Esquema Flexible**:
   - Permite manejar productos con diferentes atributos y categorías
   - Facilita la evolución del modelo de datos sin migraciones complejas
   - Soporta documentos anidados para relaciones como productos-categorías

2. **Escalabilidad**:
   - Manejo eficiente de grandes volúmenes de datos

3. **Rendimiento**:
   - Consultas optimizadas para lectura
   - Índices eficientes para búsquedas

4. **Integración**:
   - Compatibilidad nativa con JavaScript/Node.js
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
├── app/                      #paginas y rutas 
│   ├── admin/
│   │   └── products/
│   │       └── page.tsx      # (Panel administrativo)contenedor que maneja el       
|   |                             estado y la lógica                                
│   ├── categoria/
│   │   └── [categoria]/      #filtrados por categoria
│   │       └── page.tsx      # Vista de categorías
│   └── layout.tsx            # Layout principal
├── components/               # Componentes React reutilizables
│   ├── Layout/
│   │   ├── Navbar.tsx        # navegación principal 
│   │   ├── Footer.tsx
│   │   └── VideoHero/        # componente video promocional
│   ├── product/
│   │   ├── AddProductForm.tsx #Formulario para crear o editar productos,
│   │   ├── ProductCard.tsx   # Componentes reutilizable
│   │   └── ProductList.tsx   # hace uso del componente reutilizable productCard
│   ├── shared/               # componentes para el formulario
│   │   ├── ColorPicker.tsx
│   │   └── ImageUpload.tsx
│   └── ui/                   # Componentes shadcn/ui
├── hooks/                    # Custom hooks obtencion y manipulacion de productos 
│   ├── useProducts.ts        # estado global de productos
│   └── useDebounce.tsx
├── lib/                    # Utilidades y configuraciones
│   ├── validations/        # Esquemas Validaciones de Zod
├── services/               # Servicio encapsula consumo de API 
│   ├── productService.ts
├── types/               # tipado de TypeScript
│   ├── cart.types.ts
│   ├── index.ts
│   ├── product.types.ts
├── contexts/
│   └── cart/
└── utils/
    └── demoImages.ts
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
```

2. **Configurar Backend**
```bash
cd backend
npm install
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
```

4. **Configurar Variables de Entorno**
Editar el archivo `.env` en ambas carpetas con las credenciales necesarias:

Backend `.env`:
```
MONGODB_URI=
JWT_SECRET=
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

## Patrones de Diseño Y Arquitectura implementada
   
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
   - Separación de lógica de negocio y acceso a datos enfocado al CRUD
Repositorio (productoRepository): Maneja el acceso a datos, consultas
Controlador (productoController.js): Lógica CRUD de negocio
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
        
        // Listar las colecciones para verificar
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Colecciones en la base de datos:', collections.map(c => c.name));
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}
```
4. **Observer**:
 CartEventManager.ts  que implementa el patrón Observer
  - Singleton para asegurar una única instancia
  - Sistema de suscripción/desuscripción a eventos
  - Notificación a observadores
Ademas permite: Integración con el sistema de eventos, Validaciones de stock, Notificaciones con toast, Manejo de estados más robusto

**Para usar el sistema de eventos en cualquier componente:**
```bash 
import { cartEvents } from '@/lib/cart/CartEventManager';

// Suscribirse a eventos
useEffect(() => {
  const onItemAdded = (data: any) => {
    // Manejar evento
  };
  
  cartEvents.subscribe('itemAdded', onItemAdded);
  
  return () => {
    cartEvents.unsubscribe('itemAdded', onItemAdded);
  };
}, []);
```

**Beneficios del patrón Observer implementado:**

- Desacoplamiento entre componentes
- Notificaciones en tiempo real
- Fácil extensibilidad
- Manejo centralizado de eventos
- Consistencia en el estado

5. **MVC**:
   - Modelos(productos.js) : Define la estructura de datos y validaciones usando ProductoFactory
   - Vistas componentes de react como (ProductManagement.tsx): Maneja la interfaz de usuario en React
   - Controladores (productoController.js): Maneja la lógica de negocio y las respuestas HTTP
   
*Zod validation*
```bash
//lib/validations/product.ts
export const ProductFormSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    // ...
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
  
###  ![Endpoints de la API](https://docs.google.com/document/d/1Nr5PegF0RO9UHVlmztWF28YnupztY0MVScS2MOoXdGg/edit?tab=t.0)


1. **Obtener Todos los Productos**
*Método: GET*
*Endpoint*
```bash
http://localhost:3001/api/v1/productos

```
Funcionalidad: Devuelve todos los productos de la página web.
Parámetros de Consulta:

## Parámetros de Consulta API

| Parámetro | Tipo | Descripción | Ejemplo | Notas |
|-----------|------|-------------|---------|-------|
| `sort` | string | Ordena los resultados | `sort=precio,-nombre` | Use `-` para orden descendente |
| `page` | number | Número de página | `page=2` | Paginación basada en 1 |
| `limit` | number | Resultados por página | `limit=10` | Máximo: 100 |
| `fields` | string | Campos a incluir | `fields=nombre,precio` | Separados por comas |
| `categoria` | string | Filtro por categoría | `categoria=ofertas` | Case sensitive |
| `search` | string | Búsqueda por texto | `search=sandwich` | Busca en nombre y descripción |

2. **Read - API GET: Obtener un Producto Específico por ID**
*Método: GET*
 Esta API devuelve todos los productos de la página web.
*Endpoint*

```bash
http://localhost:3001/api/v1/productos/:id
```

3. **Create - API POST: Crear un Nuevo Producto**
*Método: POST*
Esta api crea productos
*Endpoint*
```bash
http://localhost:3001/api/v1/productos

```
4. **UPDATE - API PUT: Actualizar un Producto Existente**
*Método: POST*
Actualiza un producto existente
*Endpoint*
```bash
http://localhost:3001/api/v1/productos/:id
```
*Ejemplo de ID:* 6713e0c6ad1ad50e25a51eae
*Funcionalidad:* Actualiza un producto existente por su ID.

**Cuerpo de la Solicitud:**
```bash
{
  "nombre": "Nombre del Producto",
  "precio": 25.99,
  "categoria": "Ejemplo",
  "descripcion": "Descripción actualizada"
}
```
5. **API DELETE - Eliminar un Producto**
*Método: POST*
Borra un producto existente
*Endpoint*
```bash
http://localhost:3001/api/v1/productos/:id

```

*Ejemplo de ID:* 67151d151f206e5a65b48386
*Funcionalidad:* Borra un producto existente por su ID.
