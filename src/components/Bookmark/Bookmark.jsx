// src/components/Bookmark/Bookmark.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { easing } from "maath";
import { currentBookAtom, BOOK_LIBRARY } from "../../state/library";
import { bookmarkFaceAtom } from "./UI";
import { MeshStandardMaterial, SRGBColorSpace, DoubleSide } from "three";
import { loadTextureWithFallback, preloadTextureWithFallback } from "../../utils/textureCache";

export const Bookmark = (props) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const [bookIndex] = useAtom(currentBookAtom);
  const [face, setFace] = useAtom(bookmarkFaceAtom); // 0 = front, 1 = back
  const [textures, setTextures] = useState({ front: null, back: null });
  const [isHovered, setIsHovered] = useState(false);
  const { gl } = useThree();

  const current = useMemo(() => BOOK_LIBRARY[bookIndex] || BOOK_LIBRARY[0], [bookIndex]);
  const bookmark = useMemo(() => current.bookmark || { front: "bookmark3", back: "bookmark2", folder: null }, [current]);
  const { front, back, folder } = bookmark;

  // Load textures sử dụng texture cache để tối ưu performance
  useEffect(() => {
    let cancelled = false;

    const loadTextures = async () => {
      if (folder) {
        // Load từ folder với cache và fallback
        const frontPath = `textures/${folder}/${front}`;
        const backPath = `textures/${folder}/${back}`;

        try {
          const frontTexture = await loadTextureWithFallback(frontPath, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
          if (!cancelled) {
            setTextures(prev => ({ ...prev, front: frontTexture }));
          }
        } catch (error) {
          if (!cancelled) {
            console.warn(`Failed to load bookmark front texture: ${frontPath}`);
          }
        }

        try {
          const backTexture = await loadTextureWithFallback(backPath, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
          if (!cancelled) {
            setTextures(prev => ({ ...prev, back: backTexture }));
          }
        } catch (error) {
          if (!cancelled) {
            console.warn(`Failed to load bookmark back texture: ${backPath}`);
          }
        }
      } else {
        // Load từ root (fallback)
        try {
          const frontTexture = await loadTextureWithFallback(`textures/${front}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
          if (!cancelled) {
            setTextures(prev => ({ ...prev, front: frontTexture }));
          }
        } catch (error) {
          // Ignore
        }

        try {
          const backTexture = await loadTextureWithFallback(`textures/${back}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
          if (!cancelled) {
            setTextures(prev => ({ ...prev, back: backTexture }));
          }
        } catch (error) {
          // Ignore
        }
      }
    };

    loadTextures();

    return () => {
      cancelled = true;
      // Không reset textures để giữ cache
    };
  }, [front, back, folder]);

  // Preload bookmark textures của notebook tiếp theo
  useEffect(() => {
    const nextBookIndex = (bookIndex + 1) % BOOK_LIBRARY.length;
    const nextBook = BOOK_LIBRARY[nextBookIndex];
    const nextBookmark = nextBook?.bookmark;
    
    if (nextBookmark?.folder) {
      // Preload trong background với delay
      setTimeout(() => {
        if (nextBookmark.front) {
          preloadTextureWithFallback(`textures/${nextBookmark.folder}/${nextBookmark.front}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
        }
        if (nextBookmark.back) {
          preloadTextureWithFallback(`textures/${nextBookmark.folder}/${nextBookmark.back}`, {
            colorSpace: SRGBColorSpace,
            flipY: true
          });
        }
      }, 500);
    }
  }, [bookIndex]);

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
