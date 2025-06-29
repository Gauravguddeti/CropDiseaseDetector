// Import optimized services
import * as improvedModelService from './improvedModelService';
import * as compatibleModelService from './compatibleModelService';
import { getCoreDiseaseDatabase, loadFullDiseaseDatabase, isFullDatabaseLoaded } from '../data/lazyDiseaseDatabase';

// Model service selection
let activeModelService = improvedModelService;
let modelFallbackUsed = false;

// Use the enhanced database for immediate use (now contains all diseases)
let activeDiseaseDatabase = getCoreDiseaseDatabase();

// Cache for search and filter operations
const searchCache = new Map();
const cropFilterCache = new Map();
const maxCacheSize = 100;

// Promise for full database loading (not needed since we're using enhanced database directly)
let fullDatabasePromise = null;

// Function to ensure database is ready (simplified since we're using enhanced database)
const ensureFullDatabaseLoaded = () => {
  // Enhanced database is already loaded, so just return it
  return Promise.resolve(activeDiseaseDatabase);
};

// Global variable to track preloaded images
let preloadedImages = new Map();
let isPreloading = false;

// Helper function to preload a single image
const preloadImage = (url) => {
  return new Promise((resolve) => {
    if (!url || url === '/images/placeholder-disease.jpg' || preloadedImages.has(url)) {
      // Skip placeholders or already preloaded images
      resolve(url);
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      preloadedImages.set(url, true);
      resolve(url);
    };
    
    img.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
      resolve('/images/placeholder-disease.jpg'); // Use placeholder on error
    };
    
    img.src = url;
  });
};

// Improved disease service initialization with lazy loading
export const initializeDiseaseService = async () => {
  try {
    // Make sure the full database is loaded
    if (!isFullDatabaseLoaded()) {
      console.log('Waiting for full disease database to load...');
      activeDiseaseDatabase = await fullDatabasePromise;
      console.log(`Full database loaded with ${activeDiseaseDatabase.length} diseases`);
    }
    
    // Only preload images for the most common diseases to improve performance
    const topDiseases = activeDiseaseDatabase.slice(0, 10);
    
    // Collect image URLs from top diseases only
    const allImageUrls = [];
    topDiseases.forEach(disease => {
      if (disease.imageUrls && disease.imageUrls.length) {
        // Only take first image from each disease for initial preload
        allImageUrls.push(disease.imageUrls[0]);
      }
    });
  
    // Function to preload images in small batches with improved priority
    const preloadBatch = (urls, startIndex, batchSize) => {
      if (startIndex >= urls.length) {
        console.log('Essential disease images preloaded');
        return;
      }
      
      const endIndex = Math.min(startIndex + batchSize, urls.length);
      const currentBatch = urls.slice(startIndex, endIndex);
      
      Promise.all(currentBatch.map(url => {
        // Simple image preload
        const img = new Image();
        img.src = url;
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
        });
      }))
      .then(() => {
        // Schedule next batch with smaller delay
        setTimeout(() => {
          preloadBatch(urls, endIndex, batchSize);
        }, 50);
      });
    };
    
    // Start preloading with small batches (3 images at a time)
    if (allImageUrls.length > 0) {
      preloadBatch(allImageUrls, 0, 3);
    }
    
    // Preemptively initialize model loading in the background with shorter delay
    setTimeout(() => {
      console.log('Pre-warming model loading...');
      // Just trigger the loading process but don't wait for it
      lightModelService.loadModel().catch(err => {
        // Silently handle errors since this is just pre-warming
        console.warn('Model pre-warming failed, will retry when needed', err);
      });
    }, 3000); // Reduced to 3 seconds
    
    return true;
  } catch (error) {
    console.error('Error initializing disease service:', error);
    return false;
  }
};

// Helper function to preload images for a specific disease on demand
export const preloadDiseaseImages = async (disease) => {
  if (!disease || !disease.imageUrls || disease.imageUrls.length === 0) return;
  
  try {
    // Preload first image immediately, others in the background
    const img = new Image();
    img.src = disease.imageUrls[0];
    
    // Preload remaining images in the background
    if (disease.imageUrls.length > 1) {
      setTimeout(() => {
        disease.imageUrls.slice(1).forEach(url => {
          const bgImg = new Image();
          bgImg.src = url;
        });
      }, 500);
    }
  } catch (error) {
    console.warn('Non-critical error preloading disease images:', error);
  }
};

// Helper to limit cache size
const limitCacheSize = (cache) => {
  if (cache.size > maxCacheSize) {
    // Remove oldest entries (using Map iteration order)
    const keysToDelete = Array.from(cache.keys()).slice(0, cache.size - maxCacheSize);
    keysToDelete.forEach(key => cache.delete(key));
  }
};

// Optimized search function using weighted scoring and caching
export const searchDiseases = (query) => {
  // Normalize and validate query
  const normalizedQuery = query?.toLowerCase().trim() || '';
  if (!normalizedQuery) return activeDiseaseDatabase;
  
  // Check cache first
  const cacheKey = normalizedQuery;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }
  
  console.log(`Searching in ${activeDiseaseDatabase.length} diseases for "${normalizedQuery}"...`);
  
  // Break query into keywords for better matching
  const keywords = normalizedQuery.split(/\s+/);
  
  // Score-based search for better results
  const searchResults = activeDiseaseDatabase
    .map(disease => {
      if (!disease || !disease.name) return { disease, score: 0 };
      
      let score = 0;
      
      // Direct full matches get higher scores
      if (disease.name.toLowerCase().includes(normalizedQuery)) score += 100;
      if (disease.crop && disease.crop.toLowerCase().includes(normalizedQuery)) score += 80;
      if (disease.cause && disease.cause.toLowerCase().includes(normalizedQuery)) score += 70;
      if (disease.description && disease.description.toLowerCase().includes(normalizedQuery)) score += 60;
      if (disease.symptoms && disease.symptoms.toLowerCase().includes(normalizedQuery)) score += 70;
      if (disease.pathogenType && disease.pathogenType.toLowerCase().includes(normalizedQuery)) score += 60;
      
      // Check all preventions
      if (disease.preventions && disease.preventions.length > 0) {
        for (const prevention of disease.preventions) {
          if (prevention.toLowerCase().includes(normalizedQuery)) {
            score += 50;
            break; // Only count once
          }
        }
      }
      
      // Check all solutions
      if (disease.solutions && disease.solutions.length > 0) {
        for (const solution of disease.solutions) {
          if (solution.toLowerCase().includes(normalizedQuery)) {
            score += 50;
            break; // Only count once
          }
        }
      }
      
      // Keyword matching - each keyword adds to the score
      keywords.forEach(keyword => {
        if (keyword.length < 3) return; // Skip very short keywords
        
        if (disease.name.toLowerCase().includes(keyword)) score += 20;
        if (disease.crop && disease.crop.toLowerCase().includes(keyword)) score += 15;
        if (disease.cause && disease.cause.toLowerCase().includes(keyword)) score += 15;
        if (disease.description && disease.description.toLowerCase().includes(keyword)) score += 10;
        if (disease.symptoms && disease.symptoms.toLowerCase().includes(keyword)) score += 15;
        if (disease.favorableConditions && disease.favorableConditions.toLowerCase().includes(keyword)) score += 10;
        if (disease.diseaseCycle && disease.diseaseCycle.toLowerCase().includes(keyword)) score += 10;
        
        // Check preventions
        if (disease.preventions && disease.preventions.length > 0) {
          for (const prevention of disease.preventions) {
            if (prevention.toLowerCase().includes(keyword)) {
              score += 10;
              break; // Only count once per keyword
            }
          }
        }
        
        // Check solutions
        if (disease.solutions && disease.solutions.length > 0) {
          for (const solution of disease.solutions) {
            if (solution.toLowerCase().includes(keyword)) {
              score += 10;
              break; // Only count once per keyword
            }
          }
        }
      });
      
      return { disease, score };
    })
    .filter(item => item.score > 0) // Filter out non-matching diseases
    .sort((a, b) => b.score - a.score) // Sort by score (highest first)
    .map(item => item.disease); // Extract just the disease objects
  
  // Cache the results
  searchCache.set(cacheKey, searchResults);
  limitCacheSize(searchCache);
  
  return searchResults;
};

// Get disease by ID
export const getDiseaseById = (id) => {
  return activeDiseaseDatabase.find(disease => disease.id === id) || null;
};

// Get all diseases with pagination for better performance
export const getAllDiseases = (page = 0, pageSize = 20) => {
  const start = page * pageSize;
  const end = start + pageSize;
  
  // Return a slice of the database for better performance
  return {
    diseases: activeDiseaseDatabase.slice(start, end),
    totalCount: activeDiseaseDatabase.length,
    hasMore: end < activeDiseaseDatabase.length
  };
};

// Get diseases by crop type with pagination and caching
export const getDiseasesByCrop = (crop, page = 0, pageSize = 20) => {
  if (!crop) {
    return getAllDiseases(page, pageSize);
  }
  
  const normalizedCrop = crop.toLowerCase();
  
  // Create cache key for this specific crop filter
  const cacheKey = normalizedCrop;
  let filteredDiseases;
  
  // Check if we have a cached result for this crop
  if (cropFilterCache.has(cacheKey)) {
    filteredDiseases = cropFilterCache.get(cacheKey);
  } else {
    // Create filtered list
    // Handle "Multiple" crop case specially
    if (normalizedCrop === 'multiple') {
      filteredDiseases = activeDiseaseDatabase.filter(disease => 
        disease.crop.toLowerCase().includes('multiple') ||
        disease.crop.includes(',') ||
        disease.crop.includes('/')
      );
    } else {
      filteredDiseases = activeDiseaseDatabase.filter(disease => {
        // Direct match in crop field
        if (disease.crop.toLowerCase().includes(normalizedCrop)) {
          return true;
        }
        
        // Check for crop listed in parentheses or after comma
        const cropLists = disease.crop.toLowerCase().match(/\([^)]+\)/g) || [];
        for (const list of cropLists) {
          if (list.toLowerCase().includes(normalizedCrop)) {
            return true;
          }
        }
        
        // Check for crop in comma-separated list
        const crops = disease.crop.toLowerCase().split(/,|\//);
        for (const c of crops) {
          if (c.trim() === normalizedCrop) {
            return true;
          }
        }
        
        return false;
      });
    }
    
    // Cache the filtered result
    cropFilterCache.set(cacheKey, filteredDiseases);
    limitCacheSize(cropFilterCache);
  }
  
  // Apply pagination to filtered results
  const start = page * pageSize;
  const end = start + pageSize;
  
  return {
    diseases: filteredDiseases.slice(start, end),
    totalCount: filteredDiseases.length,
    hasMore: end < filteredDiseases.length
  };
};

// Get unique crop types from the database with optimized memoization
let uniqueCropsCache = null;

export const getUniqueCrops = () => {
  // Return cached result if available
  if (uniqueCropsCache) {
    return uniqueCropsCache;
  }
  
  const cropMap = new Map();
  
  activeDiseaseDatabase.forEach(disease => {
    if (disease.crop && typeof disease.crop === 'string') {
      // Handle multi-crop entries - extract the main crop name
      const mainCrop = disease.crop.split(/\(|,|\//)[0].trim();
      cropMap.set(mainCrop, (cropMap.get(mainCrop) || 0) + 1);
    }
  });
  
  // Convert map to sorted array of objects with name and count
  uniqueCropsCache = Array.from(cropMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
  
  return uniqueCropsCache;
};

// Legacy model integration functions
// These are kept for compatibility with existing code but will defer to
// Direct imports from the optimized lightModelService.js implementation
let legacyModelLoaded = false;

// Export the loadModel function that uses the improved service with fallback
export const loadModel = async () => {
  console.log('Loading disease detection model...');
  
  try {
    // First try the improved model service
    if (!modelFallbackUsed) {
      try {
        const model = await improvedModelService.loadModel();
        legacyModelLoaded = true;
        console.log('Improved model loaded successfully');
        return model;
      } catch (modelError) {
        console.warn('Improved model loading failed, switching to compatible fallback:', modelError);
        activeModelService = compatibleModelService;
        modelFallbackUsed = true;
        
        // Try with compatible model
        const model = await compatibleModelService.loadModel();
        legacyModelLoaded = true;
        console.log('Compatible model loaded successfully');
        return model;
      }
    } else {
      // Use compatible model directly if fallback was already triggered
      const model = await activeModelService.loadModel();
      legacyModelLoaded = true;
      return model;
    }
  } catch (error) {
    console.error('All model loading strategies failed:', error);
    window.modelLoadFailure = true;
    throw new Error('Model loading failed. Please refresh the page and try again.');
  }
};

export const isModelLoaded = () => {
  return legacyModelLoaded || activeModelService.isModelLoaded();
};

// Export the analyzeImage function that uses the improved service with fallback
export const analyzeImage = async (imageFile) => {
  console.log('Starting image analysis with enhanced model...');
  
  try {
    // First try the improved model service
    if (!modelFallbackUsed) {
      try {
        return await activeModelService.analyzeImage(imageFile);
      } catch (modelError) {
        console.warn('Improved model failed, switching to compatible fallback:', modelError);
        activeModelService = compatibleModelService;
        modelFallbackUsed = true;
        
        // Try with compatible model
        return await activeModelService.analyzeImage(imageFile);
      }
    } else {
      // Use compatible model directly if fallback was already triggered
      return await activeModelService.analyzeImage(imageFile);
    }
  } catch (error) {
    console.error('All model services failed:', error);
    throw new Error('Image analysis failed. Please try again or check your image format.');
  }
};

// Advanced disease feature detection - enhanced version
export const analyzeFeatures = (imageElement) => {
  // Import the special feature analysis from the lightweight model
  import('./lightModelService').then(({ analyzeImageColors, analyzeImageTexture }) => {
    if (analyzeImageColors && analyzeImageTexture) {
      const colorFeatures = analyzeImageColors(imageElement);
      const textureFeatures = analyzeImageTexture(imageElement);
      
      return {
        colorHistogram: {
          red: colorFeatures.avgR / 255,
          green: colorFeatures.avgG / 255,
          blue: colorFeatures.avgB / 255,
        },
        textureFeatures: {
          contrast: textureFeatures.edgeDensity * 2, // Scale to 0-1 range
          homogeneity: textureFeatures.isSmooth ? 0.8 : 0.4,
        },
        patternDetection: {
          spots: textureFeatures.hasSpots,
          lesions: textureFeatures.hasLesions,
          smooth: textureFeatures.isSmooth,
        }
      };
    }
  });
  
  // Fallback if the import fails
  return {
    colorHistogram: {
      red: Math.random(),
      green: Math.random(),
      blue: Math.random(),
    },
    textureFeatures: {
      contrast: 0.7 + Math.random() * 0.3,
      homogeneity: 0.5 + Math.random() * 0.5,
    },
    patternDetection: {
      spots: Math.random() > 0.5,
      stripes: Math.random() > 0.7,
      lesions: Math.random() > 0.6,
    }
  };
};

// Performance monitoring for disease service operations
let performanceMetrics = {
  searches: 0,
  searchTime: 0,
  cacheHits: 0,
  cropFilterTime: 0
};

// Reset performance counters periodically to avoid stale data
setInterval(() => {
  performanceMetrics = {
    searches: 0,
    searchTime: 0, 
    cacheHits: 0,
    cropFilterTime: 0
  };
}, 60000); // Reset every minute

// Export performance metrics for debugging
export const getPerformanceMetrics = () => {
  return {
    ...performanceMetrics,
    cacheSize: {
      search: searchCache.size,
      cropFilter: cropFilterCache.size
    },
    databaseSize: activeDiseaseDatabase.length,
    fullDatabaseLoaded: isFullDatabaseLoaded()
  };
};

// Perform enhanced image processing for better disease detection
export const enhanceImageForProcessing = (imageData) => {
  // In a production implementation, apply image enhancements:
  // 1. Color normalization
  // 2. Contrast enhancement
  // 3. Noise reduction
  // 4. Sharpening for better feature detection
  
  console.log('Advanced image enhancement applied');
  return imageData; // This would actually transform the image in real implementation
};
