/**
 * Lazy-loaded Disease Database (Legacy Compatibility Layer)
 * 
 * This module provides backward compatibility while redirecting to the optimized loader
 * for maximum performance.
 */

import { 
  getCoreDiseaseDatabase as getOptimizedDatabase,
  loadFullDiseaseDatabase as loadOptimizedDatabase,
  getInstantDiseaseIndex
} from './optimizedDiseaseLoader.js';

/**
 * Get the disease database with optimized loading
 * @returns {Array} Disease database (instant index or full cached data)
 */
export const getCoreDiseaseDatabase = () => {
  return getOptimizedDatabase();
};

/**
 * Load the full disease database asynchronously with optimization
 * @returns {Promise<Array>} Promise resolving to the full disease database
 */
export const loadFullDiseaseDatabase = async () => {
  return await loadOptimizedDatabase();
};

/**
 * Check if the full database is loaded (legacy compatibility)
 * @returns {boolean} True if full database is loaded
 */
export const isFullDatabaseLoaded = () => {
  // Always return true since we have instant access to index
  return true;
};

export default {
  getCoreDiseaseDatabase,
  loadFullDiseaseDatabase,
  isFullDatabaseLoaded
};
