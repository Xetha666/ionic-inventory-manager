# Arquitectura: Esquema de Base de Datos

## Descripción general

La base de datos está alojada en **Supabase (PostgreSQL)**. El schema define 5 tablas principales, un bucket de Storage para imágenes, y un trigger automático para registrar movimientos de stock. Todas las tablas usan **Row Level Security (RLS)** para controlar el acceso.

---

## Diagrama Entidad-Relación

## Relaciones entre Tablas

Las tablas de la base de datos se conectan entre sí de la siguiente manera:

- **Usuarios y Perfiles**: Cada cuenta en la tabla de autenticación (`auth.users`) tiene un único perfil en la tabla `profiles` que guarda su nombre, foto y si tiene la huella/Face ID activa.
- **Perfiles y Roles**: A cada perfil en `profiles` se le asigna un rol (como Administrador o Usuario) a través de la tabla intermedia `profile_roles`, que conecta con la tabla `roles`.
- **Productos y Movimientos**: Cada producto en `products` puede generar múltiples registros en `product_movements` cada vez que su stock cambia (registrando las entradas y salidas de mercancía).
- **Usuarios y Tokens**: Un usuario de `auth.users` puede tener varios dispositivos registrados en `device_tokens` para recibir alertas de stock crítico en cada uno.

---

## Tablas

### `auth.users` (gestionada por Supabase Auth)
Tabla interna de Supabase que almacena la información de autenticación. No se crea manualmente en el schema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` | Identificador único del usuario |
| `email` | `text` | Email de autenticación |

---

### `profiles`

Almacena información pública del usuario, vinculada 1:1 con `auth.users`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` PK | Mismo UUID que `auth.users.id` |
| `full_name` | `text` | Nombre completo del usuario |
| `username` | `text` | Username para login sin email |
| `avatar_url` | `text` | URL pública del avatar en Storage |
| `biometrics_enabled` | `boolean` | Si la biometría está activada para este usuario |
| `biometric_token_id` | `text` | UUID token de enrolamiento biométrico |

---

### `products`

Catálogo completo de productos del inventario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `TEXT` PK | ID personalizado (UUID generado en cliente) |
| `name` | `TEXT` NOT NULL | Nombre del producto |
| `stock` | `INTEGER` NOT NULL | Cantidad en stock (default: 0) |
| `price` | `NUMERIC(10,2)` | Precio unitario en S/ |
| `category` | `TEXT` NOT NULL | Categoría del producto |
| `image_url` | `TEXT` | URL pública de la imagen en Storage (nullable) |
| `created_at` | `TIMESTAMP` | Fecha de creación (automática) |

**Políticas RLS:**
- `SELECT`: usuarios autenticados
- `INSERT`: usuarios autenticados
- `UPDATE`: usuarios autenticados
- `DELETE`: usuarios autenticados

**Nota**: El campo `status` (`En Stock`, `Crítico`, `Sin Stock`) **no se almacena en BD**. Se calcula dinámicamente en el cliente con `getStatusFromStock(stock)`.

---

### `product_movements`

Historial automático de todos los cambios de stock. Los registros son creados **únicamente por el trigger SQL**, nunca por el cliente directamente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` PK | Generado automáticamente |
| `product_id` | `TEXT` FK → `products.id` | Producto que cambió |
| `type` | `TEXT` | `'in'` (entrada) o `'out'` (salida) |
| `quantity` | `INTEGER` | Diferencia absoluta de stock |
| `prev_stock` | `INTEGER` | Stock antes del cambio |
| `new_stock` | `INTEGER` | Stock después del cambio |
| `created_at` | `TIMESTAMP` | Momento del cambio (automático) |

**Políticas RLS:**
- `SELECT`: usuarios autenticados
- `INSERT`: usuarios autenticados (pero solo el trigger lo usa)

---

### `device_tokens`

Registra los tokens FCM de dispositivos Android para recibir notificaciones push.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` PK | Generado automáticamente |
| `token` | `TEXT` UNIQUE | Token FCM del dispositivo |
| `device_model` | `TEXT` | Modelo del dispositivo |
| `user_id` | `UUID` FK → `auth.users.id` | Usuario actualmente logueado (nullable) |
| `created_at` | `TIMESTAMP` | Fecha de registro |

**Políticas RLS:**
- `INSERT`: público (permite registrar token antes del login)
- `UPDATE`: público (permite asociar/desasociar el usuario)

---

## Trigger SQL: `tr_product_stock_change`

Trigger `AFTER INSERT OR UPDATE` en la tabla `products` que registra automáticamente cada cambio de stock en `product_movements`.

```sql
CREATE OR REPLACE TRIGGER tr_product_stock_change
    AFTER INSERT OR UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_product_stock_change();
```

La función `handle_product_stock_change()` tiene permisos `SECURITY DEFINER`.

| Evento | Condición | Registro creado |
|--------|-----------|----------------|
| `INSERT` | `NEW.stock > 0` | `type='in'`, `prev_stock=0`, `new_stock=NEW.stock` |
| `UPDATE` | `OLD.stock < NEW.stock` | `type='in'`, `quantity=NEW-OLD` |
| `UPDATE` | `OLD.stock > NEW.stock` | `type='out'`, `quantity=OLD-NEW` |
| `UPDATE` | `OLD.stock = NEW.stock` | No registra nada |

---

## RPC: `get_user_email`

Función PostgreSQL que resuelve un username a su email correspondiente. Usada en el login para permitir autenticarse con username en lugar de email.

```sql
-- Firma aproximada:
FUNCTION get_user_email(username_input TEXT) RETURNS TEXT
```

---

## RPC: `create_new_user`

Función PostgreSQL con `SECURITY DEFINER` que crea un nuevo usuario completo (auth + profile + rol). Solo invocable desde el cliente con la clave anónima, pero ejecutada con privilegios de superusuario.

```sql
-- Parámetros:
FUNCTION create_new_user(
    new_email TEXT,
    new_password TEXT,
    new_full_name TEXT,
    new_username TEXT,
    new_role_name TEXT
) RETURNS VOID
```

---

## Buckets de Supabase Storage

### Bucket `products` (público)
Almacena imágenes de productos.

| Política | Acceso |
|----------|--------|
| `SELECT` | Público (cualquier usuario) |
| `INSERT` | Usuarios autenticados |
| `UPDATE` | Usuarios autenticados |
| `DELETE` | Usuarios autenticados |

Estructura de rutas: `products/{productId}/image_{timestamp}.webp`

### Bucket `avatars` (privado/público según configuración)
Almacena fotos de perfil de los usuarios.

Estructura de rutas: `avatars/{userId}/avatar.webp`

---

## `supabaseClient.ts`

Inicializa y exporta el cliente singleton de Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Variables de entorno requeridas (`.env`):
| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima pública |
