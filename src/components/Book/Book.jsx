import { useCursor, useTexture, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState,  forwardRef  } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Raycaster,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { BOOK_LIBRARY, currentBookAtom, bookPageAtom } from "../../state/library";

// Suppress 404 errors for texture loading in console
if (typeof window !== 'undefined' && !window.__textureErrorSuppressed) {
  window.__textureErrorSuppressed = true;
  
  // Override console.error to filter texture 404 errors
  const originalError = console.error;
  console.error = function(...args) {
    const errorString = String(args[0] || '');
    // Filter out 404 errors for texture/image files
    if (
      errorString.includes('Failed to load resource') &&
      (errorString.includes('textures/') || 
       errorString.includes('.jpg') || 
       errorString.includes('.png') ||
       errorString.includes('Image'))
    ) {
      // Suppress 404 errors for textures
      return;
    }
    originalError.apply(console, args);
  };
  
  // Also suppress network errors in console
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const warnString = String(args[0] || '');
    if (
      warnString.includes('Failed to load resource') &&
      (warnString.includes('textures/') || 
       warnString.includes('.jpg') || 
       warnString.includes('.png'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

// Notebook-like page geometry
const PAGE_WIDTH = 1.4;
const PAGE_HEIGHT = 2.0;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 6; // Giảm từ 10 xuống 6 để giảm số đường kẻ màu xanh
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

const Page = ({
  number = 0,
  front,
  back,
  page = 0,
  opened = false,
  bookClosed = false,
  isCover = false,
  coverRefs,
  pagesLength = 0,
  notebookFolder,
  coverTexture,
  ...props
}) => {
  // Load texture - sử dụng TextureLoader cho cover để tránh hooks issues
  const [coverTextureLoaded, setCoverTextureLoaded] = useState(null);
  
  // Load cover texture từ notebook folder nếu là cover
  // File thực tế là PNG, nên ưu tiên PNG trước
  useEffect(() => {
    if (!isCover || !notebookFolder || !coverTexture) {
      setCoverTextureLoaded(null);
      return;
    }

    const loader = new TextureLoader();
    let cancelled = false;

    // Thử load PNG trước (file thực tế)
    loader.load(
      `textures/${notebookFolder}/${coverTexture}.png`,
      (texture) => {
        if (cancelled) return;
        texture.colorSpace = SRGBColorSpace;
        setCoverTextureLoaded(texture);
      },
      undefined,
      () => {
        // PNG failed, try JPG
        if (cancelled) return;
        loader.load(
          `textures/${notebookFolder}/${coverTexture}.jpg`,
          (texture) => {
            if (cancelled) return;
            texture.colorSpace = SRGBColorSpace;
            setCoverTextureLoaded(texture);
          },
          undefined,
          () => {
            // Both failed, set to null
            if (cancelled) return;
            setCoverTextureLoaded(null);
          }
        );
      }
    );

    return () => {
      cancelled = true;
    };
  }, [isCover, notebookFolder, coverTexture]);

  // Chọn texture nào dùng: cover texture nếu có, nếu không thì null (sẽ dùng màu trong materials)
  const textures = coverTextureLoaded && isCover
    ? { front: coverTextureLoaded, back: coverTextureLoaded }
    : null;

  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const lastClickTime = useRef(0);
  const clickDebounceDelay = 300; // 300ms debounce để tránh click nhiều lần

  const skinnedMeshRef = useRef();

  const raycasterRef = useRef(new Raycaster());
  const tmpBonePos = useRef(new Vector3());
  const tmpCoverPos = useRef(new Vector3());
  const tmpDir = useRef(new Vector3());

  // Ensure number and page have default values
  const safeNumber = number ?? 0;
  const safePage = page ?? 0;
  const baseZRef = useRef(-safeNumber * PAGE_DEPTH + safePage * PAGE_DEPTH);

  useEffect(() => {
    baseZRef.current = -safeNumber * PAGE_DEPTH + safePage * PAGE_DEPTH;
  }, [safeNumber, safePage]);

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);

    // Tạo materials: nếu là cover và có notebookTexture thì dùng texture, nếu không thì dùng màu đen
    // Nếu không phải cover thì dùng texture
    const frontMaterial = isCover && number === 0
      ? (textures && textures.front
        ? new MeshStandardMaterial({
            map: textures.front,
            emissive: emissiveColor,
            emissiveIntensity: 0,
          })
        : new MeshStandardMaterial({
            color: "#000000", // Matte black cho front cover nếu không có texture
            roughness: 0.9,
            metalness: 0.1,
            emissive: emissiveColor,
            emissiveIntensity: 0,
          }))
      : textures
      ? new MeshStandardMaterial({
          map: textures.front,
          emissive: emissiveColor,
          emissiveIntensity: 0,
        })
      : new MeshStandardMaterial({
          color: whiteColor, // Fallback: màu trắng nếu không có texture
          emissive: emissiveColor,
          emissiveIntensity: 0,
        });

    const backMaterial = isCover && number === pagesLength - 1
      ? (textures && textures.back
        ? new MeshStandardMaterial({
            map: textures.back,
            emissive: emissiveColor,
            emissiveIntensity: 0,
          })
        : new MeshStandardMaterial({
            color: "#000000", // Matte black cho back cover nếu không có texture
            roughness: 0.9,
            metalness: 0.1,
            emissive: emissiveColor,
            emissiveIntensity: 0,
          }))
      : textures
      ? new MeshStandardMaterial({
          map: textures.back,
          emissive: emissiveColor,
          emissiveIntensity: 0,
        })
      : new MeshStandardMaterial({
          color: whiteColor, // Fallback: màu trắng nếu không có texture
          emissive: emissiveColor,
          emissiveIntensity: 0,
        });

    const materials = [
      ...pageMaterials,
      frontMaterial,
      backMaterial,
    ];
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    // Đảm bảo không có wireframe hoặc edges hiển thị
    materials.forEach(mat => {
      if (mat && mat.wireframe !== undefined) {
        mat.wireframe = false;
      }
    });
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [
    // Use texture UUIDs or fallback to null for stable comparison
    textures?.front?.uuid || null,
    textures?.back?.uuid || null,
    number,
    pagesLength,
    front || '',
    back || '',
    Boolean(isCover),
    notebookFolder || '',
    coverTexture || ''
  ]);

  useEffect(() => {
    if (!isCover || !skinnedMeshRef.current || !coverRefs) return;
    if (number === 0 && coverRefs.first) {
      coverRefs.first.current = skinnedMeshRef.current;
    }
    if (number === pagesLength - 1 && coverRefs.last) {
      coverRefs.last.current = skinnedMeshRef.current;
    }
  }, [isCover, number, pagesLength, coverRefs]);

  const [, setPage] = useAtom(bookPageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return;

    const emissiveTarget = highlighted ? 0.22 : 0;
    if (skinnedMeshRef.current.material[4]) {
      skinnedMeshRef.current.material[4].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveTarget,
        0.1
      );
    }
    if (skinnedMeshRef.current.material[5]) {
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[5].emissiveIntensity,
        emissiveTarget,
        0.1
      );
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2.4 : Math.PI / 2;
    if (!bookClosed) {
      const offset = degToRad(number * 0) * -Math.sign(targetRotation);
      targetRotation += offset;
    }

    const bones = skinnedMeshRef.current.skeleton.bones;

    const spineSampleIndex = Math.max(1, Math.floor(bones.length * 0.12));
    const edgeSampleIndex = Math.min(
      bones.length - 1,
      Math.max(1, Math.floor(bones.length * 0.9))
    );
    const sampleIndices = [spineSampleIndex, edgeSampleIndex];

    baseZRef.current = -number * PAGE_DEPTH + page * PAGE_DEPTH;

    const SAFE_DISTANCE = 0.06;
    let maxPushLocalZ = 0;

    const meshWorldPos = new Vector3();
    const pushedWorldPos = new Vector3();
    const worldPush = new Vector3();

    const tryCoverCollision = (coverMesh, boneWorldPos) => {
      if (!coverMesh || coverMesh === skinnedMeshRef.current) return 0;

      coverMesh.getWorldPosition(tmpCoverPos.current);

      tmpDir.current.copy(boneWorldPos).sub(tmpCoverPos.current);
      const dist = tmpDir.current.length();
      if (dist === 0) return 0;

      if (dist < SAFE_DISTANCE) {
        const pushWorld = SAFE_DISTANCE - dist;
        tmpDir.current.normalize();
        worldPush.copy(tmpDir.current).multiplyScalar(pushWorld);

        skinnedMeshRef.current.getWorldPosition(meshWorldPos);
        pushedWorldPos.copy(meshWorldPos).add(worldPush);

        if (skinnedMeshRef.current.parent) {
          skinnedMeshRef.current.parent.worldToLocal(pushedWorldPos);
          const localDeltaZ = pushedWorldPos.z - skinnedMeshRef.current.position.z;
          return localDeltaZ;
        } else {
          return worldPush.z;
        }
      }
      return 0;
    };

    if (coverRefs) {
      for (let si = 0; si < sampleIndices.length; si++) {
        bones[sampleIndices[si]].getWorldPosition(tmpBonePos.current);

        const firstCover = coverRefs.first && coverRefs.first.current;
        const lastCover = coverRefs.last && coverRefs.last.current;

        if (firstCover) {
          const pushLocal = tryCoverCollision(firstCover, tmpBonePos.current);
          if (pushLocal > maxPushLocalZ) maxPushLocalZ = pushLocal;
        }
        if (lastCover) {
          const pushLocal = tryCoverCollision(lastCover, tmpBonePos.current);
          if (pushLocal > maxPushLocalZ) maxPushLocalZ = pushLocal;
        }
      }
    }

    const currentLocalZ = skinnedMeshRef.current.position.z;
    const targetLocalZ = baseZRef.current + maxPushLocalZ;
    skinnedMeshRef.current.position.z = MathUtils.lerp(currentLocalZ, targetLocalZ, 0.7);

    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      let rotationAngle = 0;
      let foldRotationAngle = 0;
      let foldIntensity = 0;

      if (isCover) {
        if (i === 0) {
          rotationAngle = targetRotation;
        } else {
          rotationAngle = 0;
        }
        foldRotationAngle = 0;
        foldIntensity = 0;
      } else {
        const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
        const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
        const turningIntensity =
          Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

        foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
        foldIntensity =
          i > 8
            ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
            : 0;

        if (bookClosed) {
          if (i === 0) {
            rotationAngle = targetRotation;
          } else {
            rotationAngle = 0;
          }
          foldIntensity = 0;
        } else {
          const atRestBend =
            (insideCurveStrength * insideCurveIntensity -
              outsideCurveStrength * outsideCurveIntensity) *
            targetRotation;

          const turningBend =
            turningCurveStrength * turningIntensity * targetRotation;

          if (i === 0) {
            rotationAngle = targetRotation;
          } else {
            rotationAngle = atRestBend * turningTime + turningBend;
          }
        }
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  // Thicker covers
  const coverScaleZ = isCover ? 3.0 : 1.0;

  // Your elastic band geometry/visibility (front/back, per cover)
  const bandX = PAGE_WIDTH * 0.85;
  const bandY = 0;
  const bandZFront = PAGE_DEPTH * 0.7;
  const bandZBack = -PAGE_DEPTH * 0.7;
  const bandSize = [0.15, PAGE_HEIGHT * 1.04, 0.005];
  const bandMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "#333333" }), // no roughness
    []
  );


  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        
        // Debounce để tránh click nhiều lần
        const now = Date.now();
        if (now - lastClickTime.current < clickDebounceDelay) {
          return;
        }
        lastClickTime.current = now;
        
        console.log('Page clicked:', number, 'opened:', opened, 'current page:', page);
        
        // Logic lật trang:
        // - Nếu click vào cover (number === 0) và sách đang đóng (page === 0), mở sách (lật đến trang 1)
        // - Nếu click vào back cover (number === pagesLength - 1) và sách đang mở hết (page >= pagesLength), đóng sách (lật về trang 0)
        // - Nếu click vào trang chưa mở (opened = false), lật đến trang đó (mở trang này)
        // - Nếu click vào trang đã mở (opened = true), lật tiếp sang trang tiếp theo
        
        // Logic lật trang:
        // - Click vào trang bên phải ranh giới (chưa mở) → lật mở trang đó (phải qua trái)
        // - Click vào trang bên trái ranh giới (đã mở) → lật lại trang đó (trái qua phải)
        
        if (isCover && number === 0 && page === 0) {
          // Click vào cover khi sách đang đóng → mở sách
          setPage(1);
        } else if (isCover && number === pagesLength - 1 && page >= pagesLength - 1) {
          // Click vào back cover khi sách đang mở hết → đóng sách
          setPage(0);
        } else if (!opened) {
          // Click vào trang chưa mở (bên phải ranh giới) → lật mở trang đó (phải qua trái)
          // Nếu đang ở trang đó rồi, lật tiếp sang trang tiếp theo
          if (page === number) {
            // Đang ở trang đó rồi, lật tiếp sang trang tiếp theo
            if (number < pagesLength - 1) {
              setPage(number + 1);
            }
          } else {
            // Chưa ở trang đó, lật đến trang đó
            setPage(number);
          }
        } else {
          // Click vào trang đã mở (bên trái ranh giới) → lật lại trang đó (trái qua phải)
          // Chỉ lật về trang trước 1 trang (page - 1), nhưng không nhỏ hơn 0
          // Đảm bảo chỉ lật 1 trang mỗi lần click
          if (page > 0) {
            setPage(page - 1);
          }
        }
        setHighlighted(false);
      }}
    >
      {/* Elastic band - Ẩn để tránh che mất bìa notebook */}
      {/* {isCover && number === 0 && (
        <mesh position={[bandX, bandY, bandZFront]} visible={page === 0}>
          <boxGeometry args={bandSize} />
          <primitive object={bandMaterial} attach="material" />
        </mesh>
      )}

      {isCover && number === pagesLength - 1 && (
        <mesh
          position={[bandX, bandY, bandZBack]}
          visible={page >= pagesLength - 1}
          rotation-y={Math.PI}
        >
          <boxGeometry args={bandSize} />
          <primitive object={bandMaterial} attach="material" />
        </mesh>
      )} */}

      {/* Page/Cover geometry */}
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
        scale={isCover ? [1.0, 1.0, coverScaleZ] : [1.0, 1.0, 1.0]}
      />


    </group>
  );
};

export const Book = forwardRef(({ pages, ...props }, ref) => {
  const [page] = useAtom(bookPageAtom);
  const [bookIndex] = useAtom(currentBookAtom);
  const [delayedPage, setDelayedPage] = useState(page);
  
  // Lấy notebookFolder và coverTexture từ BOOK_LIBRARY
  const currentBook = BOOK_LIBRARY[bookIndex];
  const notebookFolder = currentBook?.notebookFolder || null;
  const coverTexture = currentBook?.coverTexture || null;

  // cover refs for collision
  const firstCoverRef = useRef(null);
  const lastCoverRef = useRef(null);
  const coverRefs = { first: firstCoverRef, last: lastCoverRef };

  useEffect(() => {
    // Chỉ preload texture cho các trang không phải cover
    pages.forEach((p, index) => {
      // Bỏ qua cover (index 0 và index cuối)
      if (index !== 0 && index !== pages.length - 1) {
        try {
          useTexture.preload(`textures/${p.front}.jpg`);
          useTexture.preload(`textures/${p.back}.jpg`);
        } catch (e) {
          // Ignore texture load errors
          console.warn(`Could not preload texture: ${p.front} or ${p.back}`);
        }
      }
    });
  }, [pages]);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((cur) => {
        if (page === cur) return cur;
        timeout = setTimeout(() => goToPage(), Math.abs(page - cur) > 2 ? 50 : 150);
        if (page > cur) return cur + 1;
        if (page < cur) return cur - 1;
      });
    };
    goToPage();
    return () => clearTimeout(timeout);
  }, [page]);

  const totalThickness = pages.length * PAGE_DEPTH;
  const spineDepth = totalThickness + PAGE_DEPTH;
  const spineCenterZ = delayedPage * PAGE_DEPTH - ((pages.length - 1) / 2) * PAGE_DEPTH;
  const spineOffsetX = -0.015;
  const spineWidth = 0.03;

  const spineMaterial = useMemo(() => {
    const m = new MeshStandardMaterial({
      color: "#222222",
      metalness: 0.05,
    });
    m.polygonOffset = true;
    m.polygonOffsetFactor = 1;
    m.polygonOffsetUnits = 1;
    return m;
  }, []);

  // Spiral binding material (gold) - shared across all pages
  const spiralMaterial = useMemo(
    () => new MeshStandardMaterial({ 
      color: "#FFD700", // Gold color
      metalness: 0.8,
      roughness: 0.2,
    }),
    []
  );

  // Create spiral binding loops - Ẩn để tránh các đường kẻ màu xanh
  const spiralLoops = useMemo(() => {
    // Tạm thời ẩn spiral binding để tránh các đường kẻ màu xanh
    return [];
    // const loops = [];
    // const numLoops = 20; // Number of spiral loops
    // const loopSpacing = PAGE_HEIGHT / numLoops;
    // const loopRadius = 0.015; // Radius of each loop
    // const loopThickness = 0.002; // Thickness of the loop wire
    // 
    // for (let i = 0; i < numLoops; i++) {
    //   const y = -PAGE_HEIGHT / 2 + i * loopSpacing + loopSpacing / 2;
    //   loops.push({
    //     position: [0, y, spineCenterZ],
    //     radius: loopRadius,
    //     tube: loopThickness,
    //   });
    // }
    // return loops;
  }, [spineCenterZ]);

  // 👇 ref được gắn trực tiếp vào group gốc của cuốn sách
  return (
    <group ref={ref} {...props} rotation-y={-Math.PI / 2}>
      {/* Spiral binding on the left side */}
      {spiralLoops.map((loop, index) => (
        <mesh
          key={index}
          position={loop.position}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[loop.radius, loop.tube, 8, 16]} />
          <primitive object={spiralMaterial} attach="material" />
        </mesh>
      ))}

      {/* Spine - Ẩn để tránh che mất bìa notebook */}
      {/* <mesh position={[spineOffsetX, 0, spineCenterZ]} castShadow receiveShadow>
        <boxGeometry args={[spineWidth, PAGE_HEIGHT * 1.03, spineDepth]} />
        <primitive object={spineMaterial} attach="material" />
      </mesh> */}

      {/* Pages */}
      {pages.map((pageData, index) => (
        <Page
          key={index}
          pagesLength={pages.length}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage >= pages.length - 1}
          isCover={index === 0 || index === pages.length - 1}
          coverRefs={coverRefs}
          notebookFolder={notebookFolder}
          coverTexture={coverTexture}
          {...pageData}
        />
      ))}
    </group>
  );
});
