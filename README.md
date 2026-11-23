# Proyecto Final - E-Commerce con React y Firebase

Aplicación web de comercio electrónico desarrollada con **React (Vite)**, **React Router**, **Context API**, **Firebase Authentication** y **Cloud Firestore**, con diseño responsivo basado en Flexbox.

## Funcionalidades implementadas

- **Catálogo en Firestore (`productos`)**:
  - Vista de **Inicio** con productos filtrados por `oferta: true`.
  - Vista de **Productos** con el catálogo completo.
  - Estados de carga y manejo de errores ante fallos de comunicación.
- **Sección Nosotros (`equipo`)**:
  - Lectura de integrantes desde la colección `equipo` en Firestore.
- **Panel de Administración (protegido para rol Admin)**:
  - **CRUD de Productos**: crear, listar, editar y eliminar productos, con validaciones de nombre obligatorio, precio mayor a 0, stock entero válido y bloqueo de enlaces de `imgbb.com`.
  - **CRUD de Cupones**: creación y eliminación de cupones de descuento en la colección `cupones`.
- **Carrito de Compras (`CarritoContext`)**:
  - Agregar productos desde la tarjeta (respetando el stock disponible), eliminar ítems, vaciar carrito, aplicar cupones válidos desde Firestore y calcular totales.
- **Autenticación y Rutas Protegidas (`AuthContext`)**:
  - Registro e inicio de sesión con Firebase Authentication.
  - Protección de rutas privadas (`/perfil` para usuarios autenticados y `/admin` para usuario administrador).
- **Diseño Responsivo**:
  - Maquetación con `display: flex` y `flex-wrap: wrap` adaptada a distintos tamaños de pantalla.

## Requisitos previos

- **Node.js** (versión 18 o superior recomendada) y **npm**.
- Un proyecto configurado en **Firebase** con **Authentication** (proveedor *Correo electrónico / contraseña*) y **Cloud Firestore** habilitados.

## Instalación y ejecución en entorno local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd Proyecto_Final_Burella_Lucio
