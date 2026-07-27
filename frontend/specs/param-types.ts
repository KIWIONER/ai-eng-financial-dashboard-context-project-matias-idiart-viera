/**
 * Especificación de Tipos de Parámetros de Consulta (API Query Parameter Types)
 * Ubicación: frontend/specs/param-types.ts
 * 
 * Este archivo contiene los tipos e interfaces TypeScript estrictos que definen
 * la estructura de los parámetros de consulta (query params) enviados por las 3 funcionalidades.
 */

import { type BusinessType, type OperationType } from './api-types';

/**
 * Filtro de rango de fechas base compartido entre las tres funcionalidades.
 * Ambos campos son opcionales. Cuando están ausentes o vacíos, la API retorna todos los datos históricos.
 */
export interface DateRangeFilter {
  /**
   * Fecha de inicio para el filtrado en formato ISO `YYYY-MM-DD`.
   * @example '2024-01-01'
   */
  start_date?: string;

  /**
   * Fecha de fin para el filtrado en formato ISO `YYYY-MM-DD`.
   * @example '2024-12-31'
   */
  end_date?: string;
}

/**
 * Parámetros de consulta para la tabla de alertas de anomalías (`GET /api/metrics/alerts`).
 * Extiende `DateRangeFilter` para soportar filtrado opcional por período de fechas.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral de ratio de incremento para detectar anomalías sobre la media móvil de 3 períodos.
   * Valor numérico opcional entre 0.01 y 1.0 (ejemplo: 0.3 representa un incremento del +30%).
   * @default 0.3
   */
  threshold?: number;

  /**
   * Agrupación temporal para el análisis de alertas.
   * @default 'month'
   */
  group_by?: 'day' | 'week' | 'month';

  /**
   * Filtro opcional por modelo de negocio ('B2B' o 'B2C')
   */
  business_type?: BusinessType;
}

/**
 * Parámetros de consulta para la tabla comparativa de top categorías (`GET /api/metrics/categories/top`).
 * Extiende `DateRangeFilter` para soportar filtrado opcional por período de fechas.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operación financiera a consultar ('income' para ingresos u 'outcome' para egresos).
   * @default 'income'
   */
  operation_type?: OperationType;

  /**
   * Cantidad máxima de categorías a retornar en el ranking (entre 1 y 20).
   * @default 5
   */
  limit?: number;

  /**
   * Filtro por línea de negocio específica ('B2B' o 'B2C') para permitir vistas comparativas.
   */
  business_type?: BusinessType;
}
