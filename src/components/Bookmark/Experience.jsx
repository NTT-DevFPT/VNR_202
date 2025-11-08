// src/components/Bookmark/Experience.jsx
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Bookmark } from "./Bookmark";

export const Experience = () => {
  return (
    <>
      <Float rotation-x={-Math.PI / 12} floatIntensity={1} speed={0.5}>
        <Bookmark position={[0, 0.15, 0]} />
      </Float>
      <OrbitControls />
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
      
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
