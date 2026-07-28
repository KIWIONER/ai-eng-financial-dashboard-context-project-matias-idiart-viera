# Implementation Plan - Especificaciones Frontend (Método de los Tres Expertos)

Este Plan de Implementación ha sido elaborado utilizando el **Método de los Tres Expertos** (*Three Experts Method*) para abordar el reto de **Desarrollo Guiado por Especificaciones (Spec-Driven Development)** de las 3 nuevas funcionalidades del Financial Dashboard en la rama `feature/frontend-specs`, según las instrucciones de [`STRATEGY.md`](./STRATEGY.md).

> ⚠️ **REGLA FUNDAMENTAL:** No se escribirá código de producción en React ni se realizarán modificaciones a componentes de la aplicación existente. Todos los entregables corresponden exclusivamente a la capa de especificaciones dentro del directorio `frontend/specs/`.

---

## 🏛️ Perspectivas de los 3 Expertos

### 1. 🏗️ Arquitecto de Software (Focus: Tipado Estricto TypeScript, Contratos API y Estructura)
> *"Nuestra prioridad es garantizar una precisión del 100% entre las interfaces de `api-types.ts` y las respuestas reales que FastAPI expone en `/docs` (`backend/app/routes.py`). Exijo composición/extensión de tipos limpia (`AlertsParams` y `TopCategoriesParams` extienden `DateRangeFilter`), prohibición total de `any` u `object`, y comentarios JSDoc explicativos en cada propiedad."*

### 2. 🛡️ Auditor de Calidad y Seguridad / QA (Focus: Edge Cases, Manejo de Estados Vacíos e Incompletos)
> *"Para que una especificación sea verdaderamente útil, debe anticipar cómo responderá la UI ante fallas o entradas incompletas. Exijo definir al menos 2 casos límite (edge cases) por funcionalidad en `README.md` (ej. fechas invertidas, umbral sin anomalías, listas de top-5 vacías o inputs con un solo campo de fecha relleno) y especificar explícitamente el renderizado condicional de estados vacíos."*

### 3. ⏱️ Tech Lead & Mantenedor de Producto (Focus: Documentación de Handover, Verificación `tsc` y Git)
> *"La especificación debe ser tan clara que cualquier desarrollador o agente de IA pueda implementarla sin hacernos preguntas. Exijo validación estricta de compilación con `npx tsc --noEmit`, cumplimiento de la estructura en `frontend/specs/` y commits atómicos en español por fase en la rama `feature/frontend-specs`."*

---

## 🤝 Consenso de los 3 Expertos: Plan Unificado de 4 Fases

---

### Fase 1: Inspección de Contratos API y Definición de Tipos TypeScript (`api-types.ts` & `param-types.ts`) ✅ (COMPLETADA)

**Objetivo:** Auditar los endpoints reales en FastAPI y construir las interfaces e tipos TypeScript con documentación JSDoc en `frontend/specs/`.

#### Entregables:
- ✅ **`frontend/specs/api-types.ts`**: Interfaces creadas (`FacetsResponse`, `AlertEntry`, `AlertsResponse`, `CategoryEntry`, `TopCategoriesResponse`).
- ✅ **`frontend/specs/param-types.ts`**: Tipos de parámetros creados (`DateRangeFilter`, `AlertsParams`, `TopCategoriesParams`).
- ✅ **Verificación:** Compilación TypeScript verificada (`tsc -b`) sin errores.
- ✅ **Entregable de Git:** 
  `git commit -m "(FASE1-SPECS): definicion de tipos typescript estrictos para api y parametros"` (Completado)

---

### Fase 2: Especificación Detallada de Componentes (`components.md`) ✅ (COMPLETADA)

**Objetivo:** Elaborar la documentación de arquitectura de componentes para las 3 funcionalidades.

#### Entregables:
- ✅ **`frontend/specs/components.md`**: Especificación de componentes creada (`DateRangePicker`, `FacetsRangeBadge`, `OutcomeAlertsTable`, `ThresholdConfigInput`, `EmptyAlertsState`, `B2BvsB2CComparisonPage`, `CategoryTopList`, `ComparisonChart`).
- ✅ **Verificación:** Compilación TypeScript verificada (`tsc -b`) sin errores.
- ✅ **Entregable de Git:** 
  `git commit -m "(FASE2-SPECS): especificacion de componentes y renderizado condicional de la ui"` (Completado)

---

### Fase 3: Documentación del Contrato de Datos, Restricciones y Casos Edge (`README.md`) ✅ (COMPLETADA)

**Objetivo:** Crear el manual de especificaciones y casos límite del contrato de datos.

#### Entregables:
- ✅ **`frontend/specs/README.md`**: Documentación del contrato de datos y 6 casos *edge* creados (2 por funcionalidad).
- ✅ **Verificación:** Compilación TypeScript verificada (`tsc -b`) sin errores.
- ✅ **Entregable de Git:** 
  `git commit -m "(FASE3-SPECS): documentacion de contratos de datos y casos edge"` (Completado)

---

### Fase 4: Verificación Integral y Consolidación de Entrega ✅ (COMPLETADA)

**Objetivo:** Confirmar que todos los criterios de evaluación de `STRATEGY.md` se cumplen al 100%.

#### Entregables:
- ✅ **Verificación TypeScript:** Compilación estricta (`tsc -b`) completada con 0 errores.
- ✅ **Árbol Completo de Entregables:**
  - `frontend/specs/api-types.ts`
  - `frontend/specs/param-types.ts`
  - `frontend/specs/components.md`
  - `frontend/specs/README.md`
- ✅ **Entregable de Git:** 
  `git commit -m "(FASE4-SPECS): verificacion final de especificaciones y compilacion typescript"` (Completado)

---

## 🔍 Plan de Verificación

- **Compilación Automatizada:**
  Ejecutar `npx tsc --noEmit` en la carpeta `frontend/` para asegurar cero errores de tipos.
- **Verificación Manual de Entregables:**
  Comprobar la presencia de los 4 archivos de especificación en `frontend/specs/` e inspeccionar `git log --oneline` en la rama `feature/frontend-specs`.
