# 📦 Ionic Inventory Manager — Documentación

Bienvenido a la documentación técnica del proyecto. Este directorio cubre cada feature del sistema, la arquitectura de la base de datos, los servicios compartidos y los componentes reutilizables.

---

## 🗂 Índice

### Features

| # | Feature | Archivo |
|---|---------|---------|
| 1 | [Autenticación (Login con credenciales)](/docs/features/01-authentication.md) | `Login.tsx`, `authService.ts`, `useLoginForm.ts` |
| 2 | [Autenticación Biométrica](/docs/features/02-biometric-auth.md) | `biometricService.ts`, `BiometricAuth.tsx` |
| 3 | [Dashboard / Home](/docs/features/03-dashboard.md) | `Home.tsx`, componentes `dashboard/` |
| 4 | [Inventario de Productos (CRUD)](/docs/features/04-inventory.md) | `Inventory.tsx`, `productService.ts`, `useInventory.ts` |
| 5 | [Movimientos de Stock](/docs/features/05-stock-movements.md) | `movementService.ts`, trigger SQL, `WeeklyMovementChart.tsx` |
| 6 | [Notificaciones Push](/docs/features/06-push-notifications.md) | `pushNotificationService.ts`, Edge Function Deno |
| 7 | [Configuración (Settings)](/docs/features/07-settings.md) | `Settings.tsx`, `useSettings.ts` |
| 8 | [Gestión de Usuarios (Admin)](/docs/features/08-user-management.md) | `useCreateUser.ts`, `CreateUserModal.tsx` |
| 9 | [Avatar / Foto de Perfil](/docs/features/09-avatar.md) | `avatarService.ts`, `useAvatarEditor.ts`, `cropImage.ts` |

### Arquitectura

| Documento | Descripción |
|-----------|-------------|
| [Routing y Middleware](/docs/architecture/routing.md) | Rutas protegidas, redirección y escucha de sesión |
| [Esquema de Base de Datos](/docs/architecture/database-schema.md) | Tablas, RLS, triggers y buckets de Supabase |
| [Mapa de Servicios](/docs/architecture/services-overview.md) | Cómo los servicios se conectan con hooks y páginas |

### Componentes

| Documento | Descripción |
|-----------|-------------|
| [Componentes Comunes](/docs/components/common-components.md) | FormInput, FormSelect, Spinner, NavBar, BottomNavBar |

---

## 🏗 Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + Ionic Framework |
| Estilos | Vanilla CSS con design tokens personalizados |
| Mobile | Capacitor (Android/iOS) |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Serverless | Supabase Edge Functions (Deno) |
| Notificaciones | Firebase Cloud Messaging (FCM) |
| Build | Vite |
| Testing | Cypress (E2E) |

---

## 📁 Estructura del Proyecto

```
ionic-inventory-manager/
├── src/
│   ├── pages/          → Páginas principales (Login, Home, Inventory, Settings)
│   ├── components/     → Componentes agrupados por feature
│   │   ├── common/     → FormInput, FormSelect, Spinner
│   │   ├── dashboard/  → MetricCard, WeeklyMovementChart, etc.
│   │   ├── inventory/  → ProductCard, AddProductModal, etc.
│   │   ├── login/      → LoginForm, BiometricAuth, LoginHeader
│   │   ├── navigation/ → NavBar, BottomNavBar
│   │   └── settings/   → UserProfile, CreateUserModal, etc.
│   ├── hooks/          → Custom hooks por feature
│   ├── services/       → Lógica de negocio y acceso a datos
│   ├── utils/          → Funciones utilitarias puras
│   ├── data/           → Constantes y configuraciones estáticas
│   └── theme/          → Tokens de diseño CSS
├── supabase/
│   └── functions/
│       └── send-stock-alert/  → Edge Function para alertas push
├── docs/               → ← Estás aquí
└── supabase_schema.sql → DDL completo de la base de datos
```

---

## 🔐 Roles de Usuario

El sistema maneja dos roles definidos en la tabla `roles` de Supabase:

| Rol | Descripción |
|-----|-------------|
| `Administrador` | Acceso completo, puede crear usuarios |
| `User` | Acceso estándar al inventario y dashboard |

---

## 🔗 Convenciones de Código

- **Hooks**: Un hook por feature (`useInventory`, `useSettings`, etc.) que encapsula todo el estado y lógica.
- **Servicios**: Acceso a Supabase siempre a través de `src/services/`, nunca directo desde componentes.
- **Optimistic Updates**: Las operaciones de escritura actualizan el estado local inmediatamente y revierten si la operación en Supabase falla.
- **Skeletons**: Cada sección con carga asíncrona tiene su propio componente skeleton (`MetricSkeleton`, `ProductSkeleton`).
