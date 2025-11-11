import React, { Suspense, useEffect, forwardRef, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, Html, useTexture } from "@react-three/drei";
import { Experience } from "./Experience";
import { UI } from "./UI";
import { useAtom } from "jotai";
import { BOOK_LIBRARY, currentBookAtom } from "../../state/library";
import { Book } from "./Book";
import { preloadTextureWithFallback } from "../../utils/textureCache";
import { SRGBColorSpace } from "three";

// dùng forwardRef để truyền ref từ App xuống Book
const BookSection = forwardRef((props, ref) => {
  const [bookIndex] = useAtom(currentBookAtom);
  const currentBook = useMemo(() => BOOK_LIBRARY[bookIndex], [bookIndex]);
  const pages = useMemo(() => currentBook.pages, [currentBook]);

  // Preload cover texture ngay khi bookIndex thay đổi
  useEffect(() => {
    if (currentBook?.notebookFolder && currentBook?.coverTexture) {
      const texturePath = `textures/${currentBook.notebookFolder}/${currentBook.coverTexture}`;
      preloadTextureWithFallback(texturePath, { colorSpace: SRGBColorSpace });
    }

    // Preload bookmark textures
    if (currentBook?.bookmark?.folder) {
      const bookmark = currentBook.bookmark;
      if (bookmark.front) {
        preloadTextureWithFallback(`textures/${bookmark.folder}/${bookmark.front}`, {
          colorSpace: SRGBColorSpace,
          flipY: true
        });
      }
      if (bookmark.back) {
        preloadTextureWithFallback(`textures/${bookmark.folder}/${bookmark.back}`, {
          colorSpace: SRGBColorSpace,
          flipY: true
        });
      }
    }
  }, [currentBook]);

  // Preload page textures
  useEffect(() => {
    pages.forEach((p) => {
      try {
        useTexture.preload(`textures/${p.front}.jpg`);
        useTexture.preload(`textures/${p.back}.jpg`);
      } catch (e) {
        // Ignore
      }
    });
    try {
      useTexture.preload(`textures/book-cover-roughness.jpg`);
      useTexture.preload(`textures/ruled-paper.jpg`);
    } catch (e) {
      // Ignore
    }
  }, [pages]);

  // Preload textures của notebook tiếp theo trong background
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const nextBookIndex = (bookIndex + 1) % BOOK_LIBRARY.length;
      const nextBook = BOOK_LIBRARY[nextBookIndex];
      
      if (nextBook?.notebookFolder && nextBook?.coverTexture) {
        preloadTextureWithFallback(`textures/${nextBook.notebookFolder}/${nextBook.coverTexture}`, {
          colorSpace: SRGBColorSpace
        });
      }

      if (nextBook?.bookmark?.folder) {
        const bookmark = nextBook.bookmark;
        if (bookmark.front) {
          preloadTextureWithFallback(`textures/${bookmark.folder}/${bookmark.front}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
        }
        if (bookmark.back) {
          preloadTextureWithFallback(`textures/${bookmark.folder}/${bookmark.back}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
        }
      }
    }, 1000); // Delay 1s để không block current loading

    return () => clearTimeout(timeoutId);
  }, [bookIndex]);

  return (
    <section
      id="book-section"
      className="relative w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden p-4"
    >
      <header className="shrink-0 h-16 flex items-center justify-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-center">
          Interactive 3D Book Section
        </h1>
      </header>

      <div className="relative w-full flex-1 min-h-0 overflow-hidden shadow-2xl rounded-none">
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={{
            position: [
              -0.5,
              1,
              typeof window !== "undefined" && window.innerWidth > 800 ? 4 : 9,
            ],
            fov: 45,
          }}
        >
          <Suspense fallback={null}>
            <Experience>
              {/* ref gắn trực tiếp vào Book */}
              <Book ref={ref} position={[0, 0.25, 0]} pages={pages} />
            </Experience>

            <Html fullscreen>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <UI showMarquee={false} bookRef={ref} />
              </div>
            </Html>
          </Suspense>
        </Canvas>
        <Loader />
      </div>
    </section>
  );
});

export default BookSection;
