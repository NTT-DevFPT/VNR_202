// src/components/Bookmark/Bookmark.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { easing } from "maath";
import { currentBookAtom, BOOK_LIBRARY } from "../../state/library";
import { bookmarkFaceAtom } from "./UI";
import { MeshStandardMaterial, SRGBColorSpace, TextureLoader, DoubleSide } from "three";

export const Bookmark = (props) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const [bookIndex] = useAtom(currentBookAtom);
  const [face, setFace] = useAtom(bookmarkFaceAtom); // 0 = front, 1 = back
  const [textures, setTextures] = useState({ front: null, back: null });
  const [isHovered, setIsHovered] = useState(false);
  const { gl } = useThree();

  const current = BOOK_LIBRARY[bookIndex] || BOOK_LIBRARY[0];
  const bookmark = current.bookmark || { front: "bookmark3", back: "bookmark2", folder: null };
  const { front, back, folder } = bookmark;

  // Load textures sử dụng TextureLoader thay vì useTexture để tránh hooks issues
  useEffect(() => {
    const loader = new TextureLoader();
    let cancelled = false;

    const loadTextures = () => {
      if (folder) {
        // Thử load PNG từ folder trước (file thực tế là PNG)
        loader.load(
          `textures/${folder}/${front}.png`,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = SRGBColorSpace;
            texture.flipY = true; // Flip Y để hiển thị đúng orientation
            setTextures(prev => ({ ...prev, front: texture }));
          },
          undefined,
          () => {
            // PNG failed, try JPG
            if (cancelled) return;
            loader.load(
              `textures/${folder}/${front}.jpg`,
              (texture) => {
                if (cancelled) return;
                texture.colorSpace = SRGBColorSpace;
                texture.flipY = true; // Flip Y để hiển thị đúng orientation
                setTextures(prev => ({ ...prev, front: texture }));
              }
            );
          }
        );

        loader.load(
          `textures/${folder}/${back}.png`,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = SRGBColorSpace;
            texture.flipY = true; // Flip Y để hiển thị đúng orientation
            setTextures(prev => ({ ...prev, back: texture }));
          },
          undefined,
          () => {
            // PNG failed, try JPG
            if (cancelled) return;
            loader.load(
              `textures/${folder}/${back}.jpg`,
              (texture) => {
                if (cancelled) return;
                texture.colorSpace = SRGBColorSpace;
                texture.flipY = true; // Flip Y để hiển thị đúng orientation
                setTextures(prev => ({ ...prev, back: texture }));
              }
            );
          }
        );
      } else {
        // Load từ root
        loader.load(
          `textures/${front}.jpg`,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = SRGBColorSpace;
            texture.flipY = true; // Flip Y để hiển thị đúng orientation
            setTextures(prev => ({ ...prev, front: texture }));
          }
        );

        loader.load(
          `textures/${back}.jpg`,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = SRGBColorSpace;
            texture.flipY = true; // Flip Y để hiển thị đúng orientation
            setTextures(prev => ({ ...prev, back: texture }));
          }
        );
      }
    };

    loadTextures();

    return () => {
      cancelled = true;
      setTextures({ front: null, back: null });
    };
  }, [front, back, folder]);

  // Animation để lật bookmark giữa front và back
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Lật 180 độ quanh trục Y để chuyển giữa front và back
      const targetRotationY = face === 1 ? Math.PI : 0;
      const currentY = groupRef.current.rotation.y;
      // Tính toán góc quay ngắn nhất (đi qua 0 hoặc Math.PI)
      let diff = targetRotationY - currentY;
      // Normalize góc về [-PI, PI]
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      // Smooth rotation
      groupRef.current.rotation.y += diff * Math.min(delta * 3, 1);
    }
  });

  // Tạo materials - hiển thị đúng front và back texture
  const materials = useMemo(() => {
    const edgeColor = "#dddddd";
    const mats = [
      new MeshStandardMaterial({ color: edgeColor }), // Right
      new MeshStandardMaterial({ color: edgeColor }), // Left
      new MeshStandardMaterial({ color: edgeColor }), // Top
      new MeshStandardMaterial({ color: edgeColor }), // Bottom
    ];

    // Material-4: front face (hướng về +Z) - dùng front texture
    if (textures.front) {
      const frontMaterial = new MeshStandardMaterial({ 
        map: textures.front,
        side: DoubleSide
      });
      mats.push(frontMaterial);
    } else {
      mats.push(new MeshStandardMaterial({ 
        color: "#ffd700", 
        metalness: 0.3, 
        roughness: 0.7,
        side: DoubleSide
      }));
    }

    // Material-5: back face (hướng về -Z) - dùng back texture
    if (textures.back) {
      const backMaterial = new MeshStandardMaterial({ 
        map: textures.back,
        side: DoubleSide
      });
      mats.push(backMaterial);
    } else if (textures.front) {
      // Fallback: nếu không có back texture, dùng front texture
      const backMaterial = new MeshStandardMaterial({ 
        map: textures.front,
        side: DoubleSide
      });
      mats.push(backMaterial);
    } else {
      mats.push(new MeshStandardMaterial({ 
        color: "#ffd700", 
        metalness: 0.3, 
        roughness: 0.7,
        side: DoubleSide
      }));
    }

    return mats;
  }, [textures]);

  // Click handler để toggle giữa front và back
  const handleClick = (e) => {
    e.stopPropagation();
    setFace(face === 0 ? 1 : 0);
  };

  // Hiển thị bookmark ở landscape orientation (ngang)
  // Bookmark có thể xoay 360 độ với OrbitControls và lật front/back khi click
  return (
    <group 
      {...props} 
      ref={groupRef}
      onClick={handleClick}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        gl.domElement.style.cursor = 'auto';
      }}
    >
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow 
        material={materials}
        scale={isHovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
      >
        <boxGeometry args={[0.6, 1.8, 0.005]} />
      </mesh>
    </group>
  );
};
