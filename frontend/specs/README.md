# Especificación del Contrato de Datos y Casos Límite (frontend/specs/README.md)

Este documento especifica el **contrato de datos completo**, el mapeo de endpoints de la API backend, los tipos TypeScript asociados, las restricciones de parámetros y el comportamiento esperado de la interfaz de usuario para **casos límite (*edge cases*)** en las 3 nuevas funcionalidades del Financial Dashboard.

---

## 📌 Funcionalidad 1 — Filtro de Rango de Fechas (Dashboard Principal)

### 1. Contrato de Datos y Endpoints Consumidos
* **Endpoints Consumidos:**
  - `GET /api/metrics/facets` — Consulta de la metainformación y rangos válidos del dataset.
  - `GET /api/metrics?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` — Consulta de movimientos filtrados.
  - `GET /api/metrics/summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` — Resumen agrupado.
* **Tipos TypeScript:**
  - Petición / Parámetros: `DateRangeFilter` ([`param-types.ts`](./param-types.ts))
  - Respuesta de Facetas: `FacetsResponse` ([`api-types.ts`](./api-types.ts))
* **Valores Válidos y Restricciones:**
  - `start_date`: Cadena opcional en formato ISO `YYYY-MM-DD`. Debe ser menor o igual a `end_date`.
  - `end_date`: Cadena opcional en formato ISO `YYYY-MM-DD`. Debe ser mayor o igual a `start_date`.
  - Cuando ambos campos están vacíos/indefinidos, la API retorna todos los registros históricos.

### 2. Casos Límite (*Edge Cases*) y Comportamiento UI
* **Caso Edge 1.1 — Selección de Filtro Parcial (Solo `start_date` o solo `end_date`):**
  - *Escenario:* El usuario selecciona una fecha de inicio en el input pero deja la fecha de fin vacía.
  - *Comportamiento UI:* La aplicación emite `GET /api/metrics?start_date=2024-06-01` omitiendo el parámetro `end_date`. El servidor y las gráficas muestran todos los datos desde el `2024-06-01` hasta la fecha máxima disponible en el dataset (`max_date`). No se produce ningún error en la UI.
* **Caso Edge 1.2 — Fechas Seleccionadas Fuera del Rango Válido de Facetas:**
  - *Escenario:* El usuario ingresa manualmente una fecha anterior a `min_date` (ej. `2020-01-01`) o posterior a `max_date`.
  - *Comportamiento UI:* El componente `FacetsRangeBadge` muestra una advertencia sutil si las fechas exceden el rango del dataset. La API responderá con la lista de movimientos coincidentes (o un arreglo vacío `[]` si no hay registros), y las gráficas renderizarán un estado sin datos sin fallar.

---

## ⚠️ Funcionalidad 2 — Tabla de Alertas de Anomalías (Dashboard Principal)

### 1. Contrato de Datos y Endpoints Consumidos
* **Endpoints Consumidos:**
  - `GET /api/metrics/alerts?threshold=<ratio>&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
* **Tipos TypeScript:**
  - Petición / Parámetros: `AlertsParams` ([`param-types.ts`](./param-types.ts))
  - Respuesta: `AlertsResponse` (`AlertEntry[]`) ([`api-types.ts`](./api-types.ts))
* **Valores Válidos y Restricciones:**
  - `threshold`: Número opcional en el rango decimal `0.01` a `1.00`. Por defecto es `0.3` (+30% de incremento).
  - `group_by`: Opcional `'day' | 'week' | 'month'`. Por defecto `'month'`.

### 2. Casos Límite (*Edge Cases*) y Comportamiento UI
* **Caso Edge 2.1 — Respuesta Vacía sin Anomalías de Gasto (`alerts = []`):**
  - *Escenario:* La API responde con `[]` porque no existen períodos en los que el gasto supere el umbral configurado (ej. umbral alto de `0.80`).
  - *Comportamiento UI:* La tabla **NUNCA** desaparece silenciosamente ni se oculta del DOM. Renderiza explícitamente el componente de estado vacío `<EmptyAlertsState threshold={0.80} />` con el mensaje: *"No se detectaron anomalías de gasto para el umbral actual del 80% en el período seleccionado."*
* **Caso Edge 2.2 — Ingreso de Umbral Fuera de Rango o Inválido (ej. `-0.5` o `2.5`):**
  - *Escenario:* El usuario escribe un valor negativo o superior a 1.0 en `ThresholdConfigInput`.
  - *Comportamiento UI:* El input valida y restringe el valor al rango válido `[0.01, 1.00]` antes de lanzar la solicitud HTTP. Si la API retornara un error `HTTPException 400`, la tabla captura la falla y renderiza un mensaje de error con un botón para reintentar la carga (`onRetry`).

---

## 🏢 Funcionalidad 3 — Vista Comparativa B2B vs B2C

### 1. Contrato de Datos y Endpoints Consumidos
* **Endpoints Consumidos:**
  - `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B` (Top B2B)
  - `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C` (Top B2C)
  - `GET /api/metrics/facets` (Metadatos de categorías)
* **Tipos TypeScript:**
  - Petición / Parámetros: `TopCategoriesParams` ([`param-types.ts`](./param-types.ts))
  - Respuesta: `TopCategoriesResponse` (`CategoryEntry[]`) ([`api-types.ts`](./api-types.ts))
* **Valores Válidos y Restricciones:**
  - `operation_type`: Estrictamente `'income'` para la vista de ingresos.
  - `limit`: Entero entre 1 y 20. Por defecto `5`.
  - `business_type`: `'B2B'` o `'B2C'`.

### 2. Casos Límite (*Edge Cases*) y Comportamiento UI
* **Caso Edge 3.1 — Una Línea de Negocio no Registra Ingresos en el Período (`categories = []`):**
  - *Escenario:* Para el rango de fechas seleccionado, el segmento `B2C` no registró ninguna venta, retornando `[]`.
  - *Comportamiento UI:* El panel izquierdo (B2B) renderiza su tabla de 5 categorías normalmente. El panel derecho (B2C) renderiza una fila o tarjeta de estado vacío indicando: *"No se registraron ingresos para la línea de negocio B2C en el período seleccionado."* El gráfico `ComparisonChart` asigna `$0` al total B2C sin romperse.
* **Caso Edge 3.2 — Lista de Categorías con Menos de 5 Elementos Retornados:**
  - *Escenario:* La API devuelve únicamente 2 categorías registradas para B2B en lugar de 5.
  - *Comportamiento UI:* La tabla `CategoryTopList` renderiza exactamente las 2 categorías retornadas (posiciones 1 y 2), recalculando los porcentajes relativos sobre la suma de los montos disponibles. No se muestran filas vacías ni valores `undefined`/`NaN`.
