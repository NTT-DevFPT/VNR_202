// Texture cache utility để tối ưu hóa performance
import { TextureLoader, LoadingManager, SRGBColorSpace } from "three";

// Global texture cache
const textureCache = new Map();
const loadingPromises = new Map();

// Shared LoadingManager để track loading progress
const loadingManager = new LoadingManager();

// TextureLoader instance được tái sử dụng
const textureLoader = new TextureLoader(loadingManager);

/**
 * Load texture với cache
 * @param {string} url - URL của texture
 * @param {object} options - Options cho texture (flipY, colorSpace, etc.)
 * @returns {Promise<Texture>} Promise resolve với texture
 */
export function loadTexture(url, options = {}) {
  // Tạo cache key bao gồm cả options
  // Chuyển đổi colorSpace thành string để so sánh
  const colorSpaceStr = options.colorSpace === SRGBColorSpace ? 'srgb' : 
                        options.colorSpace ? String(options.colorSpace) : 'srgb';
  const cacheKey = `${url}?flipY=${options.flipY || false}&colorSpace=${colorSpaceStr}`;
  
  // Kiểm tra cache trước (với key và URL gốc)
  if (textureCache.has(cacheKey)) {
    return Promise.resolve(textureCache.get(cacheKey));
  }
  if (textureCache.has(url)) {
    const cachedTexture = textureCache.get(url);
    // Apply options nếu cần (tạo clone nếu options khác)
    if (options.flipY !== undefined && cachedTexture.flipY !== options.flipY) {
      // Nếu chỉ flipY khác, có thể reuse texture
      cachedTexture.flipY = options.flipY;
    }
    if (options.colorSpace !== undefined && cachedTexture.colorSpace !== options.colorSpace) {
      cachedTexture.colorSpace = options.colorSpace;
    }
    textureCache.set(cacheKey, cachedTexture);
    return Promise.resolve(cachedTexture);
  }

  // Kiểm tra xem đang load chưa
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url);
  }

  // Load texture mới
  const promise = new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        // Apply options
        if (options.flipY !== undefined) {
          texture.flipY = options.flipY;
        }
        if (options.colorSpace !== undefined) {
          texture.colorSpace = options.colorSpace;
        } else {
          texture.colorSpace = SRGBColorSpace;
        }

        // Cache texture với key
        textureCache.set(cacheKey, texture);
        // Cũng cache với URL gốc để dễ tìm
        textureCache.set(url, texture);
        loadingPromises.delete(cacheKey);
        loadingPromises.delete(url);
        resolve(texture);
      },
      undefined,
      (error) => {
        loadingPromises.delete(cacheKey);
        loadingPromises.delete(url);
        reject(error);
      }
    );
  });

  loadingPromises.set(cacheKey, promise);
  loadingPromises.set(url, promise);
  return promise;
}

/**
 * Preload texture (load nhưng không block)
 * @param {string} url - URL của texture
 * @param {object} options - Options cho texture
 */
export function preloadTexture(url, options = {}) {
  // Kiểm tra cache
  if (textureCache.has(url)) {
    return;
  }

  // Kiểm tra xem đang load chưa
  if (loadingPromises.has(url)) {
    return;
  }

  // Load trong background
  loadTexture(url, options).catch(() => {
    // Ignore errors khi preload
  });
}

/**
 * Preload multiple textures
 * @param {string[]} urls - Array of URLs
 * @param {object} options - Options cho textures
 */
export function preloadTextures(urls, options = {}) {
  urls.forEach(url => preloadTexture(url, options));
}

/**
 * Load texture với fallback (thử PNG trước, nếu fail thì JPG)
 * @param {string} basePath - Base path (không có extension)
 * @param {object} options - Options cho texture
 * @returns {Promise<Texture>}
 */
export function loadTextureWithFallback(basePath, options = {}) {
  // Thử PNG trước
  return loadTexture(`${basePath}.png`, options).catch(() => {
    // Nếu PNG fail, thử JPG
    return loadTexture(`${basePath}.jpg`, options).catch(() => {
      // Nếu cả hai đều fail, reject
      throw new Error(`Failed to load texture: ${basePath}`);
    });
  });
}

/**
 * Preload texture với fallback
 * @param {string} basePath - Base path (không có extension)
 * @param {object} options - Options cho texture
 */
export function preloadTextureWithFallback(basePath, options = {}) {
  // Kiểm tra cache với cả PNG và JPG
  if (textureCache.has(`${basePath}.png`) || textureCache.has(`${basePath}.jpg`)) {
    return;
  }

  // Preload PNG trước
  preloadTexture(`${basePath}.png`, options);
  // Preload JPG trong background (sẽ không load nếu PNG thành công)
  setTimeout(() => {
    if (!textureCache.has(`${basePath}.png`)) {
      preloadTexture(`${basePath}.jpg`, options);
    }
  }, 100);
}

/**
 * Clear texture cache (optional, để giải phóng memory nếu cần)
 */
export function clearTextureCache() {
  textureCache.forEach(texture => {
    texture.dispose();
  });
  textureCache.clear();
  loadingPromises.clear();
}

/**
 * Get cache stats (for debugging)
 */
export function getCacheStats() {
  return {
    cached: textureCache.size,
    loading: loadingPromises.size,
  };
}

export { textureCache, loadingManager };

