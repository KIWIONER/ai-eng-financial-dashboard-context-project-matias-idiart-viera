/**
 * Especificación de Tipos de Respuesta de la API (API Response Types)
 * Ubicación: frontend/specs/api-types.ts
 * 
 * Este archivo contiene las interfaces TypeScript estrictas que mapean exactamente 1:1
 * con las estructuras JSON devueltas por los endpoints de la API de FastAPI.
 */

/**
 * Tipos literales de dominio coincidentes con la API
 */
export type OperationType = 'income' | 'outcome';
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others';
export type BusinessType = 'B2B' | 'B2C';

/**
 * Respuesta devuelta por el endpoint `GET /api/metrics/facets`
 * Provee la metainformación de rango de fechas e información de categorías del dataset.
 */
export interface FacetsResponse {
  /** Lista de tipos de operación disponibles en el conjunto de datos ('income', 'outcome') */
  operation_types: OperationType[];
  /** Lista de modelos de negocio soportados ('B2B', 'B2C') */
  business_types: BusinessType[];
  /** Lista completa de categorías financieras registradas */
  categories: Category[];
  /** Fecha más antigua registrada en el dataset en formato ISO (YYYY-MM-DD) */
  min_date: string;
  /** Fecha más reciente registrada en el dataset en formato ISO (YYYY-MM-DD) */
  max_date: string;
}

/**
 * Estructura de una alerta individual de anomalía devuelta por `GET /api/metrics/alerts`
 */
export interface AlertEntry {
  /** Identificador del período donde ocurrió la anomalía (ej. '2024-05', '2024-W20' o '2024-05-15') */
  period: string;
  /** Monto total acumulado de egresos/gastos en el período determinado */
  outcome_total: number;
  /** Promedio histórico móvil de egresos calculado sobre los 3 períodos anteriores */
  baseline_average: number;
  /** Ratio de incremento del egreso respecto a la media móvil (ej. 0.35 representa un +35% de incremento) */
  increase_ratio: number;
}

/**
 * Respuesta completa devuelta por el endpoint `GET /api/metrics/alerts?threshold=<ratio>`
 * Representa una lista de alertas registradas que superan el umbral configurado.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Estructura de un elemento del ranking de categorías devuelto por `GET /api/metrics/categories/top`
 */
export interface CategoryEntry {
  /** Nombre de la categoría registrada */
  category: Category;
  /** Tipo de operación a la que pertenece la categoría ('income' u 'outcome') */
  operation_type: OperationType;
  /** Monto total acumulado para esta categoría en el período filtrado */
  total_amount: number;
}

/**
 * Respuesta completa devuelta por el endpoint `GET /api/metrics/categories/top`
 * Representa el ranking de categorías ordenado de mayor a menor monto.
 */
export type TopCategoriesResponse = CategoryEntry[];
