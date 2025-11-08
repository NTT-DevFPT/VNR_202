import React, { Suspense, useEffect, forwardRef, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, Html, useTexture } from "@react-three/drei";
import { Experience } from "./Experience";
import { UI } from "./UI";
import { useAtom } from "jotai";
import { BOOK_LIBRARY, currentBookAtom } from "../../state/library";
import { Book } from "./Book";

// dùng forwardRef để truyền ref từ App xuống Book
const BookSection = forwardRef((props, ref) => {
  const [bookIndex] = useAtom(currentBookAtom);
  const pages = BOOK_LIBRARY[bookIndex].pages;

  useEffect(() => {
    pages.forEach((p) => {
      useTexture.preload(`textures/${p.front}.jpg`);
      useTexture.preload(`textures/${p.back}.jpg`);
    });
    useTexture.preload(`textures/book-cover-roughness.jpg`);
    useTexture.preload(`textures/ruled-paper.jpg`);
  }, [pages]);

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
