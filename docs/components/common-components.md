# Componentes Comunes y Navegación

## Descripción general

Esta sección documenta los componentes reutilizables del design system que se comparten entre múltiples features de la aplicación. Se encuentran en `src/components/common/` y `src/components/navigation/`.

---

## `FormInput`

**Ruta:** `src/components/common/FormInput.tsx`

Input estilizado reutilizable con soporte para icono a la izquierda, label y elemento opcional a la derecha (suffix).

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `label` | `string` | ✅ | Texto del label sobre el input |
| `icon` | `string` | ❌ | Ícono de Ionicons a mostrar a la izquierda |
| `suffix` | `React.ReactNode` | ❌ | Elemento alineado a la derecha (ej. botón de visibilidad) |
| `disabled` | `boolean` | ❌ | Desactiva el input y aplica opacidad |
| `...props` | `InputHTMLAttributes` | — | Cualquier prop nativa de `<input>` (`type`, `value`, `onChange`, `placeholder`, etc.) |

### Uso

```tsx
// Input básico
<FormInput
  label="Correo electrónico"
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  placeholder="usuario@ejemplo.com"
/>

// Input con ícono
<FormInput
  label="Usuario"
  icon={personOutline}
  type="text"
  value={username}
  onChange={e => setUsername(e.target.value)}
/>

// Input con suffix (botón ojo de contraseña)
<FormInput
  label="Contraseña"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={e => setPassword(e.target.value)}
  suffix={
    <button onClick={togglePassword}>
      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
    </button>
  }
/>
```

### Comportamiento visual

- Border: `outline-variant/30` → cambia a `primary` al hacer focus con ring glow.
- Icono: padding izquierdo de 10 (`pl-10`) se aplica automáticamente cuando hay `icon`.
- Estado desactivado: opacidad 60%, cursor `not-allowed`.

---

## `FormSelect`

**Ruta:** `src/components/common/FormSelect.tsx`

Select estilizado con label, consistente visualmente con `FormInput`.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `label` | `string` | ✅ | Texto del label |
| `options` | `{ value: string; label: string }[]` | ✅ | Opciones del select |
| `...props` | `SelectHTMLAttributes` | — | Props nativas de `<select>` |

### Uso

```tsx
<FormSelect
  label="Rol"
  value={role}
  onChange={e => setRole(e.target.value as 'Administrador' | 'User')}
  options={[
    { value: 'User', label: 'Usuario' },
    { value: 'Administrador', label: 'Administrador' },
  ]}
/>
```

---

## `Spinner`

**Ruta:** `src/components/common/Spinner.tsx`

Indicador de carga animado. Wrapper de `IonSpinner` o implementación CSS pura.

### Uso

```tsx
// En un botón de submit
<button disabled={loading}>
  {loading ? <Spinner /> : 'Guardar'}
</button>
```

---

## `NavBar`

**Ruta:** `src/components/navigation/NavBar.tsx`

Barra de navegación superior (top bar) con título de la sección y/o botón de acción.

### Props

Dependiendo de la implementación puede recibir `title`, `onBack`, botones de acción, etc. Consultar el archivo para props específicas.

### Uso

```tsx
<NavBar title="Inventario" />
```

---

## `BottomNavBar`

**Ruta:** `src/components/navigation/BottomNavBar.tsx`

Barra de navegación inferior fija con 4 ítems principales de la app.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `activePath` | `string` | `'/home'` | Ruta activa para resaltar el ítem correspondiente |

### Ítems de navegación

| Nombre | Ruta | Íconos |
|--------|------|--------|
| Inicio | `/home` | `homeOutline` / `home` (activo) |
| Inventario | `/inventory` | `cubeOutline` / `cube` (activo) |
| Escáner | `/scanner` | `qrCodeOutline` / `qrCode` (activo) |
| Ajustes | `/settings` | `settingsOutline` / `settings` (activo) |

> **Nota**: La ruta `/scanner` aún no tiene una página implementada.

### Comportamiento visual

- El ítem activo muestra el ícono **filled** y fondo `primary-fixed/30`.
- Ítems inactivos muestran el ícono **outline** en color `outline-variant`.
- Al hacer tap: micro-animación `scale-90` con `transition-duration: 200ms`.
- La barra tiene `backdrop-blur-lg` y `bg-white/90` para efecto glassmorphism.
- Padding inferior `pb-safe` para respetar el safe area de iOS.

### Uso

```tsx
// En una página protegida
<BottomNavBar activePath="/inventory" />
```

---

## Design Tokens CSS

Los componentes usan tokens de diseño definidos en `src/theme/`. Los tokens más comunes:

| Token | Uso |
|-------|-----|
| `text-primary` | Color primario de la marca |
| `bg-surface` | Fondo principal de las páginas |
| `bg-surface-container-lowest` | Fondo de inputs y cards |
| `text-on-surface` | Texto principal |
| `text-on-surface-variant` | Texto secundario / subtítulos |
| `border-outline-variant` | Bordes sutiles |
| `text-outline` | Íconos y texto de apoyo |
| `gap-xs`, `gap-md`, `gap-lg` | Espaciado consistente |
| `px-container-padding` | Padding horizontal estándar de páginas |
| `pb-bottom-nav-safe` | Padding inferior para no solapar con BottomNavBar |

---

## Convención de uso

Todos los formularios de la app usan `FormInput` y `FormSelect` para mantener consistencia visual. **Nunca** se usa un `<input>` o `<select>` nativo directamente en una pantalla de usuario; siempre se envuelve con estos componentes.

Los skeletons de cada feature (`MetricSkeleton`, `ProductSkeleton`, `ValorizationSkeleton`) siguen el mismo patrón: animación `animate-pulse` con bloques de color `bg-surface-container`.
