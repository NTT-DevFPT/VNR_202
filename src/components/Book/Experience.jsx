import { Environment, Float, OrbitControls, AccumulativeShadows, RandomizedLight, ContactShadows } from "@react-three/drei";

// Wrap children so we can inject <Book ...> from BookSection
export const Experience = ({ children }) => {
  
  return (
    <>
      <Float
        rotation-x={0} // Sách đứng thẳng, không xéo
        floatIntensity={0} // Tắt float để sách đứng yên
        speed={0}
        rotationIntensity={0}
      >
        {children}
      </Float>
      
      {/* Improved OrbitControls với smoother interactions - Adjusted for both notebook and bookmark */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={Math.PI / 3.5} // Cho phép nhìn từ trên xuống một chút
        maxPolarAngle={Math.PI / 1.7} // Cho phép nhìn từ dưới lên một chút
        minAzimuthAngle={-Infinity} // Cho phép quay 360 độ quanh trục Y
        maxAzimuthAngle={Infinity}
        target={[0.25, 0.35, 0]} // Center point giữa notebook và bookmark
        zoomSpeed={0.8}
        rotateSpeed={0.5}
      />
      
      {/* Enhanced Lighting Setup */}
      {/* Ambient light - tổng thể */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light - ánh sáng chính */}
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      
      {/* Fill light - ánh sáng phụ từ phía đối diện */}
      <directionalLight
        position={[-2, 3, -2]}
        intensity={0.3}
        color="#fff8e1"
      />
      
      {/* Rim light - ánh sáng viền */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.4}
        color="#e3f2fd"
      />
      
      {/* Point light - ánh sáng điểm để tạo độ sâu */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.5}
        distance={10}
        decay={2}
        color="#ffffff"
      />
      
      {/* Environment lighting - IBL (Image Based Lighting) */}
      <Environment preset="sunset" intensity={0.4} />
      
      {/* Improved shadow plane với contact shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />
      
      {/* Accumulative shadows for softer, more realistic shadows */}
      <AccumulativeShadows
        position={[0, -1.49, 0]}
        frames={60}
        alphaTest={0.85}
        scale={10}
        color="#000000"
        opacity={0.6}
      >
        <RandomizedLight
          amount={8}
          radius={5}
          position={[3, 5, 3]}
          castShadow
        />
      </AccumulativeShadows>
    </>
  );
};