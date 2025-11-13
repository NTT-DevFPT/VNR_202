// Utility để export notebook models ra file 3D cho PowerPoint
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight, DirectionalLight } from "three";
import { BOOK_LIBRARY } from "../state/library";

/**
 * Export notebook model ra file GLB
 * @param {Object3D} notebookObject - Notebook 3D object từ Three.js
 * @param {string} filename - Tên file output
 * @returns {Promise<void>}
 */
export async function exportNotebookToGLB(notebookObject, filename = "notebook.glb") {
  return new Promise((resolve, reject) => {
    try {
      const exporter = new GLTFExporter();
      
      const options = {
        binary: true, // Export as GLB (binary)
        trs: false, // Don't export position, rotation, scale
        onlyVisible: true, // Only export visible objects
        includeCustomExtensions: false,
      };

      exporter.parse(
        notebookObject,
        (result) => {
          if (result instanceof ArrayBuffer) {
            // Save as file
            const blob = new Blob([result], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error("Export failed: Invalid result"));
          }
        },
        (error) => {
          console.error("Export error:", error);
          reject(error);
        },
        options
      );
    } catch (error) {
      console.error("Export error:", error);
      reject(error);
    }
  });
}

/**
 * Export tất cả notebooks ra file GLB
 * @param {Function} createNotebookScene - Function để tạo notebook scene cho mỗi book
 * @returns {Promise<void>}
 */
export async function exportAllNotebooks(createNotebookScene) {
  try {
    const exportPromises = BOOK_LIBRARY.map(async (book, index) => {
      try {
        // Tạo scene cho notebook này
        const notebookObject = await createNotebookScene(book, index);
        
        if (!notebookObject) {
          console.warn(`Failed to create scene for notebook ${index + 1}: ${book.title}`);
          return;
        }

        // Export ra file
        const filename = `${book.id || `notebook-${index + 1}`}_${book.title.replace(/\s+/g, "_")}.glb`;
        await exportNotebookToGLB(notebookObject, filename);
        
        console.log(`Exported: ${filename}`);
        
        // Delay giữa các exports để tránh overload
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error exporting notebook ${index + 1} (${book.title}):`, error);
      }
    });

    await Promise.all(exportPromises);
    console.log("All notebooks exported successfully!");
  } catch (error) {
    console.error("Error exporting all notebooks:", error);
    throw error;
  }
}

/**
 * Export một notebook cụ thể
 * @param {number} bookIndex - Index của notebook trong BOOK_LIBRARY
 * @param {Function} createNotebookScene - Function để tạo notebook scene
 * @returns {Promise<void>}
 */
export async function exportNotebook(bookIndex, createNotebookScene) {
  try {
    const book = BOOK_LIBRARY[bookIndex];
    if (!book) {
      throw new Error(`Book at index ${bookIndex} not found`);
    }

    const notebookObject = await createNotebookScene(book, bookIndex);
    if (!notebookObject) {
      throw new Error(`Failed to create scene for notebook: ${book.title}`);
    }

    const filename = `${book.id || `notebook-${bookIndex + 1}`}_${book.title.replace(/\s+/g, "_")}.glb`;
    await exportNotebookToGLB(notebookObject, filename);
    
    console.log(`Exported: ${filename}`);
  } catch (error) {
    console.error(`Error exporting notebook:`, error);
    throw error;
  }
}

/**
 * Download file từ URL
 * @param {string} url - URL của file
 * @param {string} filename - Tên file
 */
export function downloadFile(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


