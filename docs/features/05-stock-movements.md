# Feature 05: Movimientos de Stock

## Descripción general

El sistema registra automáticamente cada entrada y salida de stock mediante un **trigger de PostgreSQL** en Supabase. Los movimientos son consultados por el servicio de movimientos para mostrarlos en la gráfica de barras semanal del Dashboard. No existe una UI de gestión manual de movimientos; todo se registra de forma transparente al modificar el stock de un producto.

---

## Archivos involucrados

| Tipo | Archivo | Responsabilidad |
|------|---------|----------------|
| Servicio | `src/services/movementService.ts` | Consulta movimientos de los últimos 7 días |
| Utils | `src/utils/movementUtils.ts` | Agrupa movimientos por día para la gráfica |
| Componente | `src/components/dashboard/WeeklyMovementChart.tsx` | Gráfica de barras SVG con los movimientos |
| Componente | `src/components/dashboard/WeeklyMovementEmptyState.tsx` | Estado vacío (sin movimientos) |
| Componente | `src/components/dashboard/WeeklyMovementErrorState.tsx` | Estado de error |
| BD (SQL) | `supabase_schema.sql` | Tabla `product_movements` + trigger + función |

---

## Tabla `product_movements`

```sql
CREATE TABLE public.product_movements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type       TEXT NOT NULL,      -- 'in' (entrada) | 'out' (salida)
    quantity   INTEGER NOT NULL,
    prev_stock INTEGER NOT NULL,
    new_stock  INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

| Campo | Descripción |
|-------|-------------|
| `id` | UUID único del movimiento |
| `product_id` | FK al producto que cambió |
| `type` | `'in'` si el stock aumentó, `'out'` si disminuyó |
| `quantity` | Diferencia absoluta: `ABS(new_stock - prev_stock)` |
| `prev_stock` | Stock antes del cambio |
| `new_stock` | Stock después del cambio |
| `created_at` | Timestamp automático del cambio |

---

## Trigger SQL: Registro automático

El trigger `tr_product_stock_change` se dispara **automáticamente** después de cada INSERT o UPDATE en la tabla `products`.

```sql
CREATE OR REPLACE FUNCTION public.handle_product_stock_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserción: producto nuevo con stock inicial > 0
    IF (TG_OP = 'INSERT') THEN
        IF NEW.stock > 0 THEN
            INSERT INTO product_movements (product_id, type, quantity, prev_stock, new_stock)
            VALUES (NEW.id, 'in', NEW.stock, 0, NEW.stock);
        END IF;

    -- Actualización: el stock cambió
    ELSIF (TG_OP = 'UPDATE') THEN
        IF OLD.stock IS DISTINCT FROM NEW.stock THEN
            INSERT INTO product_movements (product_id, type, quantity, prev_stock, new_stock)
            VALUES (
                NEW.id,
                CASE WHEN NEW.stock > OLD.stock THEN 'in' ELSE 'out' END,
                ABS(NEW.stock - OLD.stock),
                OLD.stock,
                NEW.stock
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Reglas del trigger:**

| Operación | Condición | Tipo registrado |
|-----------|-----------|----------------|
| `INSERT` | `stock > 0` | `'in'` con `prev_stock = 0` |
| `UPDATE` | `NEW.stock > OLD.stock` | `'in'` (entrada de mercancía) |
| `UPDATE` | `NEW.stock < OLD.stock` | `'out'` (salida de mercancía) |
| `UPDATE` | `NEW.stock = OLD.stock` | No se registra |

---

## ¿Cómo llegan los datos a la gráfica?

Lo que ocurre cuando el Home carga la gráfica de movimientos semanales:

```mermaid
flowchart TD
    Inicio[Usuario abre el Home/Dashboard] --> ReqDB[Fetichea movimientos desde hace 7 días]
    
    ReqDB --> MapData[Recibe lista de ProductMovement[]]
    MapData --> GroupData[Agrupa y suma cantidades por día: Lun-Dom]
    
    GroupData --> FillEmptyDays[Rellena con 0 los días sin movimientos]
    FillEmptyDays --> DrawSVG[Dibuja barras SVG: entrada verde, salida rojo/naranja]
```

**1.** Al abrir el Home, la app pide a la base de datos todos los cambios de stock de los últimos 7 días.

**2.** La respuesta es una lista de movimientos con fecha, tipo (entrada o salida) y cantidad.

**3.** Esa lista se organiza por día de la semana, sumando todas las entradas y todas las salidas de cada día.

**4.** Con esos totales organizados se dibuja la gráfica de barras en pantalla, mostrando una barra de entradas y una de salidas por cada día.

---

## `movementService.ts`

### `fetchWeeklyMovements()`
Consulta todos los movimientos de stock desde hace 7 días (desde el inicio del día de hace 7 días) hasta ahora.

```typescript
export const movementService = {
  async fetchWeeklyMovements(): Promise<ProductMovement[]>
}
```

**Consulta SQL generada:**
```sql
SELECT * FROM product_movements
WHERE created_at >= '<fecha_hace_7_dias>'
ORDER BY created_at ASC
```

---

## `movementUtils.ts`

### `groupMovementsByDay(movements)`
Agrupa los movimientos por día de la semana y suma las cantidades de entradas y salidas.

**Input:** `ProductMovement[]`  
**Output:**
```typescript
{
  "Lun": { in: 15, out: 8 },
  "Mar": { in: 0, out: 22 },
  "Mié": { in: 45, out: 0 },
  // ...
}
```

La función garantiza que los 7 días de la semana siempre estén presentes en el resultado, incluso si no hay movimientos en ese día (con valores `0`).

---

## `WeeklyMovementChart.tsx`

Gráfica de barras SVG construida sin librerías externas. Muestra barras apiladas (o agrupadas) de entradas y salidas por día.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `movements` | `ProductMovement[]` | Datos crudos del servicio |
| `loading` | `boolean` | Muestra estado de carga |
| `error` | `string \| null` | Muestra `WeeklyMovementErrorState` |

**Estados del componente:**

| Condición | Renderizado |
|-----------|------------|
| `loading = true` | Barra de carga animada |
| `error !== null` | `WeeklyMovementErrorState` con mensaje |
| `movements.length = 0` | `WeeklyMovementEmptyState` |
| Normal | SVG con barras de entradas (verde) y salidas (rojo/naranja) |

---

## Interface `ProductMovement`

```typescript
export interface ProductMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out';
  quantity: number;
  prev_stock: number;
  new_stock: number;
  created_at: string;
}
```

---

## Relación con otras features

| Feature | Cómo genera movimientos |
|---------|------------------------|
| **Crear producto** | Si el stock inicial > 0, el trigger registra un `'in'` |
| **Ajustar stock** | El trigger compara `OLD.stock` vs `NEW.stock` y registra `'in'` u `'out'` |
| **Notificaciones Push** | Se dispara cuando `stock <= 5` (pero lee de `products`, no de `product_movements`) |
