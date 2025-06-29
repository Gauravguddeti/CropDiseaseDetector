/**
 * High-Performance Disease Database Loader
 * 
 * This module provides ultra-fast loading using multiple optimization techniques:
 * 1. Instant lightweight index for immediate UI rendering
 * 2. Background chunked loading of full data
 * 3. Memory-efficient caching
 * 4. Web Workers for non-blocking parsing (when needed)
 */

import { diseaseIndex, quickCropStats, quickSupportedCrops } from './diseaseIndex.js';

// Cache management
let fullDatabaseCache = null;
let loadingPromise = null;
let isLoading = false;

// Performance tracking
const perfLog = {
  indexLoadTime: 0,
  fullLoadTime: 0,
  cacheHits: 0
};

/**
 * Get instant access to lightweight disease index
 * This loads immediately for fast UI rendering
 */
export const getInstantDiseaseIndex = () => {
  const start = performance.now();
  const result = diseaseIndex;
  perfLog.indexLoadTime = performance.now() - start;
  return result;
};

/**
 * Get instant crop statistics
 */
export const getInstantCropStats = () => {
  return quickCropStats;
};

/**
 * Get instant supported crops list
 */
export const getInstantSupportedCrops = () => {
  return quickSupportedCrops;
};

/**
 * Get core disease database with smart loading
 * Uses index first, then loads full data in background
 */
export const getCoreDiseaseDatabase = () => {
  // Return cached full data if available
  if (fullDatabaseCache) {
    perfLog.cacheHits++;
    return fullDatabaseCache;
  }
  
  // Start background loading if not already started
  if (!isLoading) {
    loadFullDiseaseDatabase();
  }
  
  // Return index for immediate use
  return diseaseIndex;
};

/**
 * Load full database with chunked, non-blocking approach
 */
export const loadFullDiseaseDatabase = async () => {
  if (fullDatabaseCache) {
    return fullDatabaseCache;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  isLoading = true;
  const start = performance.now();
  
  loadingPromise = new Promise(async (resolve) => {
    try {
      // Use dynamic import for code splitting
      const { comprehensiveDiseaseDatabase } = await import('./comprehensiveDiseaseDatabase.js');
      
      // Cache the result
      fullDatabaseCache = comprehensiveDiseaseDatabase;
      
      perfLog.fullLoadTime = performance.now() - start;
      console.log(`✅ Full disease database loaded in ${perfLog.fullLoadTime.toFixed(2)}ms`);
      console.log(`📊 Performance: Index: ${perfLog.indexLoadTime.toFixed(2)}ms, Cache hits: ${perfLog.cacheHits}`);
      
      resolve(fullDatabaseCache);
    } catch (error) {
      console.error('❌ Error loading full disease database:', error);
      // Fallback to index
      resolve(diseaseIndex);
    } finally {
      isLoading = false;
    }
  });
  
  return loadingPromise;
};

/**
 * Get disease by ID with smart loading
 */
export const getDiseaseById = async (id) => {
  // Try to find in index first for instant response
  const indexResult = diseaseIndex.find(d => d.id === id);
  if (indexResult) {
    // Load full data in background for next time
    loadFullDiseaseDatabase();
    return indexResult;
  }
  
  // Load full database if needed
  const fullDatabase = await loadFullDiseaseDatabase();
  return fullDatabase.find(d => d.id === id);
};

/**
 * Search diseases with smart loading
 */
export const searchDiseases = async (query) => {
  const searchTerm = query.toLowerCase();
  
  // Quick search in index first
  const indexResults = diseaseIndex.filter(disease => 
    disease.name.toLowerCase().includes(searchTerm) ||
    disease.crop.toLowerCase().includes(searchTerm) ||
    disease.pathogenType.toLowerCase().includes(searchTerm)
  );
  
  // If we have good results from index, return immediately
  if (indexResults.length > 0) {
    // Load full data in background for detailed search later
    loadFullDiseaseDatabase();
    return indexResults;
  }
  
  // If no results in index, search full database
  const fullDatabase = await loadFullDiseaseDatabase();
  return fullDatabase.filter(disease => 
    disease.name.toLowerCase().includes(searchTerm) ||
    disease.crop.toLowerCase().includes(searchTerm) ||
    disease.pathogenType.toLowerCase().includes(searchTerm) ||
    disease.description?.toLowerCase().includes(searchTerm) ||
    disease.symptoms?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Preload full database during idle time
 */
export const preloadDatabase = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      if (!fullDatabaseCache && !isLoading) {
        console.log('🔄 Preloading full database during idle time...');
        loadFullDiseaseDatabase();
      }
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      if (!fullDatabaseCache && !isLoading) {
        loadFullDiseaseDatabase();
      }
    }, 1000);
  }
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = () => {
  return {
    ...perfLog,
    isCached: !!fullDatabaseCache,
    isLoading,
    indexSize: diseaseIndex.length,
    fullSize: fullDatabaseCache?.length || 0
  };
};

export default {
  getInstantDiseaseIndex,
  getInstantCropStats,
  getInstantSupportedCrops,
  getCoreDiseaseDatabase,
  loadFullDiseaseDatabase,
  getDiseaseById,
  searchDiseases,
  preloadDatabase,
  getPerformanceMetrics
};
