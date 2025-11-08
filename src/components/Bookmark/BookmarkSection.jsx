import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, Html } from "@react-three/drei";
import { Experience } from "./Experience";
import { UI } from "./UI";

const BookmarkSection = () => {
  return (
    <section
      id="bookmark-section"
      className="relative w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden p-4"
    >
      {/* Header cố định chiều cao để thẳng hàng với cột bên cạnh */}
      <header className="shrink-0 h-16 flex items-center justify-center ">
        <h1 className="text-2xl lg:text-3xl font-bold text-center">
          Interactive 3D Bookmark
        </h1>
      </header>

      {/* Nâng toàn bộ nội dung dưới header lên 1px bằng negative margin (nếu cần) */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden shadow-2xl rounded-none -mt-[-8px]">
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={{
            position: [1, 1, 3],
            fov: 45,
          }}
        >
          <Suspense fallback={null}>
            <Experience />
            {/* Đẩy toàn bộ overlay UI (bao gồm button) lên 1px */}
            <Html fullscreen>
              <div className="absolute inset-0 -translate-y-[16px] flex items-center justify-center pointer-events-none">
                <UI showMarquee={false} />
              </div>
            </Html>
          </Suspense>
        </Canvas>
        <Loader />
      </div>
    </section>
  );
};

export default BookmarkSection;