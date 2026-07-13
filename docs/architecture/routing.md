# Arquitectura: Routing y Middleware de Autenticación

## Descripción general

El enrutamiento de la aplicación se gestiona con `react-router-dom` v5 integrado en Ionic. Las rutas privadas verifican el estado de autenticación en cada render. Un middleware de autenticación (`useAuthMiddleware`) escucha eventos de sesión de Supabase y cambios de `localStorage` para hacer logout automático cuando el token expira o se revoca.

---

## Archivos involucrados

| Archivo | Responsabilidad |
|---------|----------------|
| `src/AppRoutes.tsx` | Definición de rutas y protección de acceso |
| `src/services/authMiddleware.ts` | Hook middleware que monitorea el estado de sesión |
| `src/services/authService.ts` | `isAuthenticated()` usado como guard en las rutas |
| `src/App.tsx` | Monta el `IonApp` con `IonReactRouter` y `AppRoutes` |

---

## Rutas definidas

| Ruta | Componente | Protegida |
|------|-----------|----------|
| `/` | Redirect → `/login` | No |
| `/login` | `<Login />` | No |
| `/home` | `<Home />` | ✅ Sí |
| `/inventory` | `<Inventory />` | ✅ Sí |
| `/settings` | `<Settings />` | ✅ Sí |

---

## Protección de rutas

Las rutas protegidas usan un render prop con `isAuthenticated()` como guard:

```tsx
<Route exact path="/home" render={() => (
  isAuthenticated() ? <Home /> : <Redirect to="/login" />
)} />
```

`isAuthenticated()` retorna `true` si existe `auth_token` en `localStorage`.

---

## ¿Cómo funciona el middleware de sesión?

El middleware (`useAuthMiddleware`) vigila la sesión del usuario de forma automática escuchando dos posibles eventos:

- **Evento A: Supabase avisa que la sesión se cerró** (por ejemplo, porque el token de seguridad expiró o el usuario cerró sesión en otro dispositivo).
- **Evento B: La sesión se elimina en otra pestaña.** Si el usuario tiene abiertas dos pestañas de la app en su navegador y cierra sesión en una de ellas, el navegador elimina el token local. El middleware detecta esta eliminación al instante.

En cualquiera de los dos casos, la app **limpia los datos guardados en el dispositivo** y redirige automáticamente al usuario a la pantalla de Login, evitando que use la app sin autorización.

### Evento 1: Supabase `onAuthStateChange`

Escucha todos los eventos de autenticación de Supabase. Cuando recibe `'SIGNED_OUT'` (expiración de token, logout desde otro dispositivo, etc.):
1. Limpia la sesión local (`clearLocalUserSession()`).
2. Redirige a `/login`.

### Evento 2: StorageEvent en otras pestañas

El listener `storage` detecta cuando `auth_token` se elimina en **otra pestaña del mismo navegador**:
1. Si `e.key === 'auth_token'` y `e.newValue === null` → el token fue eliminado.
2. Limpia la sesión local y redirige a `/login`.

> Esto garantiza la sincronización de logout entre pestañas: si el usuario hace logout en una pestaña, las demás también cierran sesión automáticamente.

### Limpieza del efecto

El hook retorna una función de cleanup que:
- Desuscribe el listener de Supabase Auth.
- Elimina el listener del evento `storage` del `window`.

---

## Flujo completo de navegación

Lo que pasa paso a paso cuando un usuario se mueve por la app:

**1. El usuario abre la aplicación en el navegador.**
   - Si intenta entrar directamente a la raíz (`/`), la app lo redirige de inmediato a la pantalla de `/login`.
   - Se activan en segundo plano las alertas del middleware para vigilar la sesión (como vimos arriba).

**2. El usuario intenta ir a una pantalla protegida (ej: `/home` o `/inventory`).**
   - La app comprueba si existe un token de sesión guardado localmente.
   - **Si NO está autenticado** (no hay token) → la app detiene el acceso y lo redirige a la pantalla de Login.
   - **Si SÍ está autenticado** → la app le permite ver la pantalla solicitada.

**3. Si la sesión expira mientras el usuario está usando la app:**
   - Supabase notifica al middleware que el token ya no es válido.
   - El middleware borra la sesión guardada localmente y saca al usuario a la pantalla de Login al instante.

---

## `App.tsx`

Componente raíz que establece el contexto de Ionic y el enrutador:

```tsx
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppRoutes />
    </IonReactRouter>
  </IonApp>
);
```

`IonReactRouter` provee el contexto de `useHistory()` necesario para las redirecciones programáticas en `useAuthMiddleware` y `useLoginForm`.
