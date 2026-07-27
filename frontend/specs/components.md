# Especificación de Componentes de Frontend (frontend/specs/components.md)

Este documento especifica la arquitectura de componentes de interfaz de usuario para las 3 nuevas funcionalidades del Financial Dashboard, definiendo sus nombres, props estrictamente tipadas (usando `api-types.ts` y `param-types.ts`), estados locales y reglas de renderizado condicional.

---

## 📅 Funcionalidad 1 — Filtro de Rango de Fechas (Dashboard Principal)

### 1. `DateRangePicker`
* **Descripción:** Control de entrada de UI con dos inputs de fecha HTML (`start_date` y `end_date`) en formato `YYYY-MM-DD`. Ambos campos son opcionales.
* **Ubicación sugerida:** `frontend/src/components/dashboard/date-range-picker.tsx`
* **Props (TypeScript):**
  ```typescript
  import { type DateRangeFilter } from '../specs/param-types';

  export interface DateRangePickerProps {
    /** Valor actual del filtro de fechas */
    value: DateRangeFilter;
    /** Callback invocado cuando el usuario modifica cualquiera de las dos fechas */
    onChange: (newRange: DateRangeFilter) => void;
    /** Fecha mínima permitida (obtenida de las facetas de la API) */
    minDate?: string;
    /** Fecha máxima permitida (obtenida de las facetas de la API) */
    maxDate?: string;
    /** Deshabilita los inputs durante estados de carga */
    disabled?: boolean;
  }
  ```
* **Comportamiento y Reglas:**
  - Si el usuario limpia un input, se envía `undefined` para ese campo.
  - Si solo un input está completo (ejemplo: solo `start_date`), se emite el objeto `{ start_date: 'YYYY-MM-DD', end_date: undefined }`.
  - Incluye un botón para "Limpiar Filtro" que resetea ambos campos a `undefined`.

### 2. `FacetsRangeBadge`
* **Descripción:** Insignia o elemento de texto que muestra el rango de fechas histórico total disponible en el dataset para orientar al usuario.
* **Ubicación sugerida:** `frontend/src/components/dashboard/facets-range-badge.tsx`
* **Props (TypeScript):**
  ```typescript
  export interface FacetsRangeBadgeProps {
    /** Fecha más antigua disponible en formato YYYY-MM-DD */
    minDate?: string;
    /** Fecha más reciente disponible en formato YYYY-MM-DD */
    maxDate?: string;
    /** Estado de carga de las facetas */
    loading?: boolean;
  }
  ```
* **Renderizado Condicional:**
  - `loading === true`: Muestra un esqueleto indicador de carga (`Skeleton`).
  - `minDate` y `maxDate` presentes: Renderiza el texto `"Rango disponible: [minDate] a [maxDate]"`.

---

## ⚠️ Funcionalidad 2 — Tabla de Alertas de Anomalías (Dashboard Principal)

### 1. `OutcomeAlertsTable`
* **Descripción:** Tabla situada bajo las gráficas principales que presenta las anomalías de gasto detectadas por la API.
* **Ubicación sugerida:** `frontend/src/components/dashboard/outcome-alerts-table.tsx`
* **Props (TypeScript):**
  ```typescript
  import { type AlertsResponse } from '../specs/api-types';

  export interface OutcomeAlertsTableProps {
    /** Arreglo de alertas devuelto por la API */
    alerts: AlertsResponse;
    /** Indica si se están cargando los datos de alertas */
    loading: boolean;
    /** Mensaje de error si la petición falla */
    error: string | null;
    /** Umbral actual configurado (usado para personalizar el estado vacío) */
    threshold: number;
    /** Callback opcional para reintentar la carga */
    onRetry?: () => void;
  }
  ```
* **Columnas de la Tabla:**
  1. **Período:** Muestra el valor de `alert.period` (ej. `2024-05`).
  2. **Outcome Registrado:** Muestra `alert.outcome_total` formateado a moneda USD (`$XX,XXX`).
  3. **Media Móvil (3 períodos):** Muestra `alert.baseline_average` formateado a moneda USD (`$XX,XXX`).
  4. **Incremento Porcentual:** Muestra `alert.increase_ratio` formateado como porcentaje destacado en color de advertencia/destructivo (`+XX.X%`).
* **Renderizado Condicional:**
  - `loading === true`: Renderiza 3 filas con esqueleto animado (`Skeleton`).
  - `error !== null`: Renderiza un contenedor de error con el mensaje de falla y el botón de reintento.
  - `alerts.length === 0`: **ESTADO VACÍO EXPLÍCITO.** Renderiza el componente `<EmptyAlertsState threshold={threshold} />`. La tabla NUNCA desaparece silenciosamente.

### 2. `ThresholdConfigInput`
* **Descripción:** Input numérico o selector que permite al usuario ajustar el umbral de ratio de incremento de anomalías.
* **Ubicación sugerida:** `frontend/src/components/dashboard/threshold-config-input.tsx`
* **Props (TypeScript):**
  ```typescript
  export interface ThresholdConfigInputProps {
    /** Valor numérico del umbral actual (entre 0.01 y 1.0) */
    value: number;
    /** Callback al cambiar el valor del umbral */
    onChange: (newThreshold: number) => void;
    /** Deshabilitado durante la carga */
    disabled?: boolean;
  }
  ```

### 3. `EmptyAlertsState`
* **Descripción:** Vista de estado vacío explícita dentro del contenedor de la tabla cuando no se detectan anomalías.
* **Ubicación sugerida:** `frontend/src/components/dashboard/empty-alerts-state.tsx`
* **Props (TypeScript):**
  ```typescript
  export interface EmptyAlertsStateProps {
    /** Umbral configurado expresado en porcentaje para el mensaje */
    threshold: number;
  }
  ```
* **Texto Renderizado:** `"No se detectaron anomalías de gasto para el umbral actual del (threshold * 100)% en el período seleccionado."`

---

## 🏢 Funcionalidad 3 — Vista Comparativa B2B vs B2C

### 1. `B2BvsB2CComparisonPage`
* **Descripción:** Página o vista contenedora dedicada a la comparativa de ingresos por línea de negocio.
* **Ubicación sugerida:** `frontend/src/pages/b2b-vs-b2c-page.tsx`
* **Props (TypeScript):** Sin props (Página contenedora).
* **Estructura Interna:**
  - Encabezado con selector de filtro de fechas `DateRangePicker`.
  - Grilla de dos columnas en paralelo: Panel B2B (izquierda) y Panel B2C (derecha), cada uno conteniendo su respectivo `CategoryTopList`.
  - Sección inferior con el gráfico consolidado `ComparisonChart`.

### 2. `CategoryTopList`
* **Descripción:** Tabla que despliega las 5 principales categorías de ingreso de una línea de negocio (B2B o B2C).
* **Ubicación sugerida:** `frontend/src/components/comparison/category-top-list.tsx`
* **Props (TypeScript):**
  ```typescript
  import { type BusinessType, type TopCategoriesResponse } from '../specs/api-types';

  export interface CategoryTopListProps {
    /** Tipo de modelo de negocio ('B2B' o 'B2C') */
    businessType: BusinessType;
    /** Lista de las 5 categorías top devueltas por la API */
    categories: TopCategoriesResponse;
    /** Estado de carga */
    loading: boolean;
    /** Estado de error */
    error: string | null;
  }
  ```
* **Columnas:**
  1. `#` (Posición 1 a 5)
  2. `Categoría` (Nombre de la categoría)
  3. `Total Ingresos ($)` (Formateado en USD)
  4. `% del Grupo` (Porcentaje relativo sobre la suma de la lista top-5)
* **Renderizado Condicional:**
  - Si `categories.length === 0`, muestra el mensaje: `"No se registraron ingresos para la línea de negocio [businessType] en el período seleccionado."`

### 3. `ComparisonChart`
* **Descripción:** Gráfico visual comparativo (Bar Chart) entre el total acumulado de ingresos B2B frente al total B2C.
* **Ubicación sugerida:** `frontend/src/components/comparison/comparison-chart.tsx`
* **Props (TypeScript):**
  ```typescript
  export interface ComparisonChartProps {
    /** Total de ingresos B2B acumulados */
    b2bTotal: number;
    /** Total de ingresos B2C acumulados */
    b2cTotal: number;
    /** Estado de carga */
    loading: boolean;
  }
  ```
