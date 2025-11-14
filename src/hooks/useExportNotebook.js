// Hook để export notebook model ra file 3D
import { useRef, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { BOOK_LIBRARY } from "../state/library";

/**
 * Hook để export notebook model
 * @param {React.RefObject} bookRef - Ref của Book component
 * @returns {Object} Export functions
 */
export function useExportNotebook(bookRef) {
  const { scene } = useThree();
  const isExporting = useRef(false);

  /**
   * Export notebook hiện tại ra file GLB
   */
  const exportCurrentNotebook = useCallback(async (bookIndex) => {
    if (isExporting.current) {
      console.warn("Export already in progress");
      return;
    }

    if (!bookRef?.current) {
      console.error("Book ref not available");
      return;
    }

    try {
      isExporting.current = true;
      const book = BOOK_LIBRARY[bookIndex];
      const filename = `${book.id || `notebook-${bookIndex + 1}`}_${book.title.replace(/\s+/g, "_")}.glb`;

      const exporter = new GLTFExporter();
      const options = {
        binary: true,
        trs: false,
        onlyVisible: true,
        includeCustomExtensions: false,
      };

      // Clone notebook object để export
      const notebookClone = bookRef.current.clone();
      
      // Reset position và rotation để export ở trạng thái chuẩn
      notebookClone.position.set(0, 0, 0);
      notebookClone.rotation.set(0, 0, 0);
      notebookClone.scale.set(1, 1, 1);

      exporter.parse(
        notebookClone,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: "model/gltf-binary" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log(`Exported: ${filename}`);
          } else {
            console.error("Export failed: Invalid result");
          }
          isExporting.current = false;
        },
        (error) => {
          console.error("Export error:", error);
          isExporting.current = false;
        },
        options
      );
    } catch (error) {
      console.error("Export error:", error);
      isExporting.current = false;
    }
  }, [bookRef]);

  /**
   * Export tất cả notebooks
   */
  const exportAllNotebooks = useCallback(async () => {
    if (isExporting.current) {
      console.warn("Export already in progress");
      return;
    }

    if (!bookRef?.current) {
      console.error("Book ref not available");
      return;
    }

    try {
      isExporting.current = true;
      const exporter = new GLTFExporter();
      const options = {
        binary: true,
        trs: false,
        onlyVisible: true,
        includeCustomExtensions: false,
      };

      // Export từng notebook
      for (let i = 0; i < BOOK_LIBRARY.length; i++) {
        const book = BOOK_LIBRARY[i];
        const filename = `${book.id || `notebook-${i + 1}`}_${book.title.replace(/\s+/g, "_")}.glb`;

        try {
          // Clone notebook object
          const notebookClone = bookRef.current.clone();
          notebookClone.position.set(0, 0, 0);
          notebookClone.rotation.set(0, 0, 0);
          notebookClone.scale.set(1, 1, 1);

          await new Promise((resolve, reject) => {
            exporter.parse(
              notebookClone,
              (result) => {
                if (result instanceof ArrayBuffer) {
                  const blob = new Blob([result], { type: "model/gltf-binary" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = filename;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  console.log(`Exported: ${filename}`);
                  resolve();
                } else {
                  reject(new Error("Invalid result"));
                }
              },
              (error) => {
                console.error(`Error exporting notebook ${i + 1}:`, error);
                reject(error);
              },
              options
            );
          });

          // Delay giữa các exports
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error exporting notebook ${i + 1} (${book.title}):`, error);
        }
      }

      console.log("All notebooks exported successfully!");
      isExporting.current = false;
    } catch (error) {
      console.error("Error exporting all notebooks:", error);
      isExporting.current = false;
    }
  }, [bookRef]);

  return {
    exportCurrentNotebook,
    exportAllNotebooks,
    isExporting: isExporting.current,
  };
}



