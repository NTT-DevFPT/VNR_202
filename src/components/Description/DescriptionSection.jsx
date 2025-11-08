import React, { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  Html,
  Loader,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { useAtom } from "jotai";
import { BOOK_LIBRARY, currentBookAtom } from "../../state/library";
import { Book } from "../Book/Book";
import { Bookmark } from "../Bookmark/Bookmark";
import * as THREE from "three";

// ✅ Chặn tương tác Book trong phần Description (chỉ xem, không lật/click)
function InteractionBlocker({ size = [3.5, 3.0], position = [0, 0.03, 0] }) {
  return (
    <mesh
      position={position}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerEnter={(e) => e.stopPropagation()}
      onPointerLeave={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <planeGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

const DescriptionExperience = ({ pages, bookmark }) => (
  <>
    {/* Book nằm ngang, chặn click/lật */}
    <group position={[-1.0, 0, 0.25]} rotation={[-Math.PI / 7, 0, 0]}>
      <Float floatIntensity={0.5} speed={0.4} rotationIntensity={0.4}>
        <Book pages={pages} />
        <InteractionBlocker />
      </Float>
    </group>

    {/* Bookmark nằm ngang, đặt xa bên phải */}
    <group position={[1, 0, 0.2]} rotation={[-Math.PI / 7, 0, 0]}>
      <Float floatIntensity={0.6} speed={0.5} rotationIntensity={0.8}>
        <Bookmark />
      </Float>
    </group>

    {/* Ánh sáng và môi trường trung tính */}
    <ambientLight intensity={0.5} />
    <directionalLight
      position={[2, 5, 2]}
      intensity={0.85}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0001}
    />
    <Environment preset="city" intensity={0.25} />

    {/* Mặt sàn hứng bóng nhẹ */}
    <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial transparent opacity={0.15} />
    </mesh>

    {/* Cho phép xoay xem */}
    <OrbitControls
  enableZoom={true}      // bật/tắt zoom tùy bạn
  minPolarAngle={0}      // không giới hạn nghiêng lên
  maxPolarAngle={Math.PI} // nghiêng xuống tối đa
/>

  </>
);

export const DescriptionSection = () => {
  const [bookIndex, setBookIndex] = useAtom(currentBookAtom);
  const current = BOOK_LIBRARY[bookIndex] || BOOK_LIBRARY[0];
  const pages = current.pages;
  const bookmark = current.bookmark || {
    front: "bookmark3",
    back: "bookmark2",
  };
  const story = current.story;

  // Chuyển sách trái/phải
  const prevBook = () => {
    setBookIndex((bookIndex - 1 + BOOK_LIBRARY.length) % BOOK_LIBRARY.length);
  };
  const nextBook = () => {
    setBookIndex((bookIndex + 1) % BOOK_LIBRARY.length);
  };

  // Preload textures
  useEffect(() => {
    pages.forEach((p) => {
      useTexture.preload(`textures/${p.front}.jpg`);
      useTexture.preload(`textures/${p.back}.jpg`);
    });
    if (bookmark.front) useTexture.preload(`textures/${bookmark.front}.jpg`);
    if (bookmark.back) useTexture.preload(`textures/${bookmark.back}.jpg`);
    useTexture.preload(`textures/ruled-paper.jpg`);
  }, [pages, bookmark.front, bookmark.back]);

  const cameraPos = useMemo(
    () =>
      typeof window !== "undefined" && window.innerWidth > 1024
        ? [0.8, 1.2, 5]
        : [0.6, 1.0, 7],
    []
  );

  return (
    <section
      id="description-section"
      className="relative w-full bg-white text-gray-900 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Trái 3/5: Book + Bookmark */}
          <div className="lg:col-span-3 w-full h-[700px] rounded-xl overflow-hidden shadow-2xl
            bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <Canvas
              shadows
              style={{ width: "100%", height: "100%" }}
              camera={{ position: cameraPos, fov: 45 }}
              gl={{
                toneMapping: THREE.ACESFilmicToneMapping,
                outputEncoding: THREE.sRGBEncoding,
              }}
            >
              <Suspense fallback={null}>
                <DescriptionExperience pages={pages} bookmark={bookmark} />
                <Html fullscreen>
                  <div className="absolute inset-0 pointer-events-none" />
                </Html>
              </Suspense>
            </Canvas>
            <Loader />
          </div>

          {/* Phải 2/5: Description + Controls */}
          <aside className="lg:col-span-2 flex flex-col justify-center">
            <div className="relative mb-8 text-center">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition"
                onClick={prevBook}
              >
                ←
              </button>

              <h2 className="text-4xl font-bold inline-block px-16">
                {story?.title}
              </h2>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition"
                onClick={nextBook}
              >
                →
              </button>
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              {(story?.paragraphs || []).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
