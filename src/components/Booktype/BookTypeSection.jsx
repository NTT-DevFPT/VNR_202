import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Center,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { motion } from "framer-motion-3d";

// ✅ Component tải GLTF model
function GLTFModel({ url, scale = 1 }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} scale={scale} />;
}

// ✅ Nút điều hướng
function ArrowButton({ onClick, direction = "right" }) {
  const isRight = direction === "right";
  return (
    <button
      onClick={onClick}
      aria-label={isRight ? "Next product" : "Previous product"}
      className="absolute top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-900 shadow-md rounded-full size-12 grid place-items-center transition"
      style={{ [isRight ? "right" : "left"]: "0.75rem" }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isRight ? "" : "rotate-180"}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}

const BookTypeSection = forwardRef(function BookTypeSection(
  {
    models = [
      {
        url: "models/Notebook1.glb",
        name: "Sản phẩm 1",
        description: "Mô tả 1",
        scale: 5,
      },
      {
        url: "models/Notebook2.glb",
        name: "Sản phẩm 2",
        description: "Mô tả 2",
        scale: 0.007,
      },
      {
        url: "models/Notebook3.glb",
        name: "Sản phẩm 3",
        description: "Mô tả 3",
        scale: 0.006,
      },
    ],
    className = "",
    style,
    canvasHeight = "100%",
    background = "linear-gradient(180deg, #f8fafc 0%, #ffffff 60%)",
  },
  ref
) {
  const [index, setIndex] = useState(0);
  const count = models.length;
  const containerRef = useRef(null);

  // 👉 Điều khiển từ bên ngoài
  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  useImperativeHandle(ref, () => ({ next, prev }));

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background, ...style }}
    >
      {/* 🧾 Thông tin sản phẩm */}
      <div className="absolute left-4 top-4 z-20 p-3 rounded-md bg-white/80 shadow-sm backdrop-blur-sm max-w-[60%]">
        <div className="text-sm uppercase tracking-wide text-sky-700 font-semibold">
          {models[index]?.name || "Sản phẩm"}
        </div>
        {models[index]?.description && (
          <div className="text-gray-700 text-sm mt-1">
            {models[index].description}
          </div>
        )}
      </div>

      {/* 🔘 Nút điều hướng */}
      <ArrowButton onClick={prev} direction="left" />
      <ArrowButton onClick={next} direction="right" />

      <div style={{ width: "100%", height: canvasHeight }}>
        <Canvas shadows camera={{ position: [0, 1.5, 4.5], fov: 32 }}>
          {/* 💡 Ánh sáng */}
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            intensity={1.2}
            position={[2, 5, 5]}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* ☁️ Bóng đổ */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.45}
            scale={10}
            blur={2.5}
          />

          <Environment preset="city" />

          {/* 🌀 Hiệu ứng chuyển sản phẩm */}
          <Suspense fallback={null}>
  {models.map((m, i) => {
    // Tính offset vòng tròn (carousel loop)
    // Nếu index = 2, i = 0 => offset = -2 (model đầu về bên trái)
    // Nếu index = 2, i = 2 => offset = 0 (model cuối ở giữa)
    let offset = i - index;
    // Nếu offset > count/2, đưa về vòng sau
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const isActive = i === index;

    const targetX = offset * 2.5;
    const targetZ = Math.abs(offset) * -2;

    // Chỉ sản phẩm số 1 bị xoay Y 180 độ
    const rotateY = i === 0 ? Math.PI : offset * 0.4;

    return (
      <group key={m.url}>
        <motion.group
          initial={false}
          animate={{
            x: targetX,
            z: targetZ,
            y: 0,
            rotateY,
            rotateX: Math.PI / 3,
            scale: isActive ? 1 : 0.8,
            opacity: isActive ? 1 : 0.6,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
          }}
        >
          <Center>
            <GLTFModel url={m.url} scale={m.scale ?? 1} />
          </Center>
        </motion.group>
      </group>
    );
  })}
</Suspense>
          {/* 👁️ Điều khiển camera */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Canvas>
      </div>
    </section>
  );
});

export default BookTypeSection;