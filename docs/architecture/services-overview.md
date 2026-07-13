# Arquitectura: Mapa de Servicios

## Descripción general

Esta guía muestra cómo los **servicios** (`src/services/`) se consumen desde los **hooks** y cómo los **hooks** se usan en las **páginas** y **componentes**. El patrón es unidireccional: Componentes → Hooks → Servicios → Supabase.

---

## Estructura de Capas de la Aplicación

La aplicación está organizada en 4 capas principales por donde viajan los datos en una sola dirección:

### 1. Pantallas (Páginas)
Son las interfaces que ve el usuario final. No contienen lógica de negocio compleja, solo organizan los componentes visuales e invocan a los Hooks para obtener datos y enviar acciones.
- **Login**: Inicia sesión (Credenciales / Huella).
- **Home (Dashboard)**: Muestra estadísticas generales y gráficas de movimientos.
- **Inventario**: Lista los productos y abre los modales para agregar, editar o eliminar.
- **Ajustes**: Permite ver tu perfil, cambiar tu foto de avatar, cerrar sesión o crear nuevos usuarios.

### 2. Capa de Lógica (Hooks)
Son funciones personalizadas que contienen las reglas de negocio de cada pantalla. Gestionan el estado (si está cargando, si hay un error) y preparan la información para las pantallas.
- Ejemplos: `useInventory` para manejar la lista filtrada de productos, `useLoginForm` para el formulario de acceso, `useCreateUser` para el registro, etc.

### 3. Capa de Conectores (Servicios)
Son clases o módulos que no guardan estado. Su única tarea es comunicarse con el backend (enviar peticiones a Supabase, subir imágenes al Storage, pedir permisos para notificaciones, etc.).
- Ejemplos: `productService` (CRUD de inventario), `authService` (inicio y cierre de sesión), `biometricService` (huella digital).

### 4. Capa de Servidor (Backend)
Es la infraestructura donde se guardan y procesan los datos.
- **Supabase BD**: Guarda las tablas de productos, movimientos, usuarios y tokens.
- **Supabase Storage**: Almacena las imágenes de los productos y avatares.
- **Edge Functions**: Funciones ligeras en la nube que reaccionan a los cambios (ej: enviar notificaciones si el stock es crítico).
- **Firebase (FCM)**: Plataforma de Google que empuja las notificaciones directamente a los teléfonos.

---

## Mapa por servicio

### `authService.ts`
| Exportación | Usado en |
|-------------|---------|
| `loginWithCredentials()` | `useLoginForm`, `biometricService` |
| `logoutUser()` | `useSettings` |
| `isAuthenticated()` | `AppRoutes` |
| `getLocalUserSession()` | `useSettings`, `pushNotificationService`, `DashboardHeader` |
| `setLocalUserSession()` | `authService` internamente |
| `updateLocalUserSession()` | `useSettings` |
| `clearLocalUserSession()` | `authMiddleware`, `logoutUser` |
| `UserSession` (tipo) | `biometricService`, `useLoginForm` |

---

### `biometricService.ts`
| Exportación | Usado en |
|-------------|---------|
| `enrollBiometric()` | `useLoginForm` |
| `loginWithBiometric()` | `BiometricAuth.tsx` |
| `unenrollBiometric()` | (disponible para Settings, no implementado aún en UI) |
| `hasStoredBiometricCredentials()` | `BiometricAuth.tsx` |

---

### `productService.ts`
| Exportación | Usado en |
|-------------|---------|
| `productService.fetchProducts()` | `useInventory` |
| `productService.createProduct()` | `useAddProduct` |
| `productService.updateProduct()` | `useEditProduct` |
| `productService.updateProductStock()` | `useInventory` |
| `productService.uploadProductImage()` | `useAddProduct`, `useEditProduct` |
| `productService.deleteProduct()` | `useInventory` |
| `productService.deleteImageFromStorage()` | `useEditProduct` |

---

### `movementService.ts`
| Exportación | Usado en |
|-------------|---------|
| `movementService.fetchWeeklyMovements()` | `Home.tsx` directamente |

---

### `pushNotificationService.ts`
| Exportación | Usado en |
|-------------|---------|
| `pushNotificationService.register()` | `App.tsx` o `main.tsx` (al inicio de la app) |
| `pushNotificationService.associateTokenWithUser()` | `useLoginForm` |
| `pushNotificationService.disassociateToken()` | `authService.logoutUser()` |
| `pushNotificationService.saveTokenToSupabase()` | Interno (listener de registro) |

---

### `avatarService.ts`
| Exportación | Usado en |
|-------------|---------|
| `uploadAvatar()` | `useSettings` |

---

### `authMiddleware.ts`
| Exportación | Usado en |
|-------------|---------|
| `useAuthMiddleware()` | `AppRoutes.tsx` (una sola vez en el árbol) |

---

## Mapa por hook

| Hook | Página/Componente | Servicios usados |
|------|------------------|-----------------|
| `useLoginForm` | `Login.tsx` → `LoginForm.tsx` | `authService`, `biometricService`, `pushNotificationService` |
| `useInventory` | `Inventory.tsx` | `productService` |
| `useAddProduct` | `AddProductModal.tsx` | `productService` |
| `useEditProduct` | `EditProductModal.tsx` | `productService` |
| `useProductOptions` | `Inventory.tsx` → `ProductCard.tsx` | (solo UI: IonActionSheet, IonAlert) |
| `useSettings` | `Settings.tsx` | `authService`, `avatarService`, `supabaseClient` |
| `useCreateUser` | `CreateUserModal.tsx` | `supabaseClient` (RPC directo) |
| `useAvatarEditor` | `UserProfile.tsx` | `cropImage` (util) |

---

## Patrón Optimistic Update

Los hooks que realizan operaciones de escritura siguen este patrón para garantizar una UX instantánea:

```
1. Guardar estado anterior
2. Actualizar estado local INMEDIATAMENTE (optimistic)
3. Llamar al servicio (Supabase)
4a. Si éxito → hacer refetch silencioso en background
4b. Si error → REVERTIR al estado anterior + mostrar error al usuario
```

Hooks que implementan optimistic updates:
- `useInventory`: `updateStock()`, `addProduct()`, `editProduct()`, `deleteProduct()`
- `useSettings`: `handleAvatarChange()`

---

## Convención de nomenclatura

| Patrón | Ejemplo | Significado |
|--------|---------|-------------|
| `use[Feature]` | `useInventory` | Hook de estado completo de una feature |
| `use[Action][Entity]` | `useAddProduct` | Hook enfocado en una acción específica |
| `[entity]Service` | `productService` | Objeto servicio con métodos agrupados |
| `[verb][Entity]` | `uploadAvatar` | Función de servicio de acción única |
