import { useState, useCallback, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { BOOK_LIBRARY } from "../../state/library";

/**
 * Component vô hình dùng để expose các hàm export notebook ra file GLB.
 * Cần được render bên trong Canvas (nằm trong <Experience>).
 */
export function ExportButton({ bookRef, bookIndex, onExportComplete }) {
  useThree(); // đảm bảo component chạy trong ngữ cảnh R3F

  const [isExporting, setIsExporting] = useState(false);
  const exportStateRef = useRef({ isExporting: false, progress: 0 });

  const resetExportState = useCallback(() => {
    setIsExporting(false);
    exportStateRef.current = { isExporting: false, progress: 0 };
  }, []);

  const exportNotebookByIndex = useCallback(
    async (index) => {
      if (!bookRef?.current) {
        console.warn(`⚠️ Không tìm thấy bookRef để export notebook ${index}`);
        return false;
      }

      if (exportStateRef.current.isExporting) {
        console.warn("⚠️ Đang export, vui lòng đợi hoàn thành");
        return false;
      }

      const book = BOOK_LIBRARY[index];
      if (!book) {
        console.error(`❌ Không tìm thấy notebook tại index ${index}`);
        return false;
      }

      const filename = `${book.id || `notebook-${index + 1}`}_${book.title.replace(/\s+/g, "_")}.glb`;

      try {
        exportStateRef.current.isExporting = true;
        exportStateRef.current.progress = 0;
        setIsExporting(true);

        const exporter = new GLTFExporter();
        const options = {
          binary: true,
          trs: false,
          onlyVisible: true,
          includeCustomExtensions: false,
          animations: [],
        };

        const notebookClone = bookRef.current.clone(true);
        notebookClone.position.set(0, 0, 0);
        notebookClone.rotation.set(0, 0, 0);
        notebookClone.scale.set(1, 1, 1);
        notebookClone.updateMatrixWorld(true);

        notebookClone.traverse((child) => {
          if (child.isMesh || child.isSkinnedMesh) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach((mat) => {
              if (mat?.map) {
                mat.map.needsUpdate = true;
              }
            });
            child.updateMatrixWorld(true);
          }
        });

        return await new Promise((resolve, reject) => {
          exporter.parse(
            notebookClone,
            (result) => {
              if (!(result instanceof ArrayBuffer)) {
                console.error("❌ Export thất bại: kết quả không hợp lệ");
                resetExportState();
                reject(new Error("Invalid result"));
                return;
              }

              exportStateRef.current.progress = 100;
              const blob = new Blob([result], { type: "model/gltf-binary" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              console.log(`✅ Exported: ${filename}`);
              if (onExportComplete) onExportComplete(filename);

              setTimeout(resetExportState, 500);
              resolve(true);
            },
            (error) => {
              console.error("❌ Export error:", error);
              resetExportState();
              reject(error);
            },
            options
          );
        });
      } catch (error) {
        console.error("❌ Export error:", error);
        resetExportState();
        return false;
      }
    },
    [bookRef, onExportComplete, resetExportState]
  );

  const exportCurrentNotebook = useCallback(() => exportNotebookByIndex(bookIndex), [bookIndex, exportNotebookByIndex]);

  const exportAllNotebooks = useCallback(async () => {
    if (exportStateRef.current.isExporting) {
      console.warn("⚠️ Đang export, vui lòng đợi");
      return;
    }

    for (let i = 0; i < BOOK_LIBRARY.length; i++) {
      const success = await exportNotebookByIndex(i);
      if (!success) {
        console.warn(`⚠️ Export notebook ${i + 1} thất bại`);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }, [exportNotebookByIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__exportNotebook = {
        exportCurrent: exportCurrentNotebook,
        exportAll: exportAllNotebooks,
        exportByIndex: exportNotebookByIndex,
        get isExporting() {
          return exportStateRef.current.isExporting;
        },
        get progress() {
          return exportStateRef.current.progress;
        },
      };
    }
  }, [exportAllNotebooks, exportCurrentNotebook, exportNotebookByIndex]);

  return null;
}
