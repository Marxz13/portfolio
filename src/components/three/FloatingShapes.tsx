"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// TYPES
// ============================================

interface ShapeData {
  position: THREE.Vector3;
  radius: number;
}

interface ShapeStore {
  shapes: Map<string, ShapeData>;
  register: (id: string, data: ShapeData) => void;
}

interface WanderConfig {
  noiseScale: number; // How fast the noise changes (lower = slower movement)
  wanderRange: number; // How far from center it can wander
}

interface ShapeProps {
  shapeId: string;
  position: [number, number, number];
  color: string;
  radius: number;
  shapeStore: ShapeStore;
  config: WanderConfig;
  rotationSpeed?: number;
}

// ============================================
// CONSTANTS
// ============================================

const BOUNDS = {
  x: 4.5,
  y: 3.5,
  zMin: -6,
  zMax: -2,
};

// ============================================
// NOISE FUNCTION (Perlin-like)
// ============================================

function createNoise(seed: number) {
  // Create permutation table
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) perm[i] = i;

  // Shuffle with seed
  let n = Math.abs(seed * 16807) % 2147483647 || 1;
  for (let i = 255; i > 0; i--) {
    n = (n * 16807) % 2147483647;
    const j = n % (i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  // Gradient vectors for 2D
  const gradients = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  // Smoothstep function
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  // Dot product of gradient and distance
  const grad = (hash: number, x: number, y: number) => {
    const g = gradients[hash % 8];
    return g[0] * x + g[1] * y;
  };

  return (x: number, y: number): number => {
    // Grid cell coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Relative position in cell
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // Fade curves
    const u = fade(xf);
    const v = fade(yf);

    // Hash coordinates of corners
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];

    // Blend gradients
    const x1 = THREE.MathUtils.lerp(
      grad(aa, xf, yf),
      grad(ba, xf - 1, yf),
      u
    );
    const x2 = THREE.MathUtils.lerp(
      grad(ab, xf, yf - 1),
      grad(bb, xf - 1, yf - 1),
      u
    );

    return THREE.MathUtils.lerp(x1, x2, v);
  };
}

// Hash string to number for seeding
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return hash;
}

// ============================================
// SHAPE STORE HOOK
// ============================================

function useShapeStore(): ShapeStore {
  const shapes = useRef(new Map<string, ShapeData>());

  return useMemo(
    () => ({
      shapes: shapes.current,
      register: (id: string, data: ShapeData) => {
        shapes.current.set(id, data);
      },
    }),
    []
  );
}

// ============================================
// NOISE WANDERING HOOK
// ============================================

function useNoiseWandering(
  shapeId: string,
  initialPos: THREE.Vector3,
  config: WanderConfig,
  shapeStore: ShapeStore,
  radius: number
) {
  // Create unique noise functions for this shape
  const noiseX = useMemo(() => createNoise(hashString(shapeId + "x")), [shapeId]);
  const noiseY = useMemo(() => createNoise(hashString(shapeId + "y")), [shapeId]);
  const noiseZ = useMemo(() => createNoise(hashString(shapeId + "z")), [shapeId]);

  // Unique time offsets so shapes don't sync
  const timeOffset = useMemo(() => ({
    x: (hashString(shapeId + "ox") % 1000) / 100,
    y: (hashString(shapeId + "oy") % 1000) / 100,
    z: (hashString(shapeId + "oz") % 1000) / 100,
  }), [shapeId]);

  const basePosition = useRef(initialPos.clone());
  const targetPosition = useRef(initialPos.clone());
  const smoothPosition = useRef(initialPos.clone());

  const { pointer, viewport, clock } = useThree();

  // Register shape for collision detection
  useEffect(() => {
    shapeStore.register(shapeId, {
      position: smoothPosition.current,
      radius,
    });
  }, [shapeId, shapeStore, radius]);

  const update = (delta: number) => {
    const time = clock.elapsedTime;

    // ========================================
    // 1. CALCULATE NOISE-BASED TARGET POSITION
    // ========================================
    const t = time * config.noiseScale;

    // Sample noise at different frequencies for organic movement
    const nx = noiseX(t + timeOffset.x, 0.5) * config.wanderRange;
    const ny = noiseY(t + timeOffset.y, 1.5) * config.wanderRange;
    const nz = noiseZ(t * 0.5 + timeOffset.z, 2.5) * 0.8;

    targetPosition.current.set(
      basePosition.current.x + nx,
      basePosition.current.y + ny,
      basePosition.current.z + nz
    );

    // ========================================
    // 2. COLLISION AVOIDANCE (soft push)
    // ========================================
    shapeStore.shapes.forEach((other, otherId) => {
      if (otherId === shapeId) return;

      const dist = targetPosition.current.distanceTo(other.position);
      const minDist = radius + other.radius + 0.4;

      if (dist < minDist && dist > 0.001) {
        const pushDir = targetPosition.current
          .clone()
          .sub(other.position)
          .normalize();
        const pushStrength = (minDist - dist) * 0.6;
        targetPosition.current.add(pushDir.multiplyScalar(pushStrength));
      }
    });

    // ========================================
    // 3. MOUSE REPULSION
    // ========================================
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;
    const dx = targetPosition.current.x - mouseX;
    const dy = targetPosition.current.y - mouseY;
    const mouseDist = Math.sqrt(dx * dx + dy * dy);

    const mouseRadius = 2.5;
    if (mouseDist < mouseRadius && mouseDist > 0.001) {
      const strength = ((mouseRadius - mouseDist) / mouseRadius) * 2;
      targetPosition.current.x += (dx / mouseDist) * strength;
      targetPosition.current.y += (dy / mouseDist) * strength;
    }

    // ========================================
    // 4. CLAMP TO BOUNDS
    // ========================================
    targetPosition.current.x = THREE.MathUtils.clamp(
      targetPosition.current.x,
      -BOUNDS.x,
      BOUNDS.x
    );
    targetPosition.current.y = THREE.MathUtils.clamp(
      targetPosition.current.y,
      -BOUNDS.y,
      BOUNDS.y
    );
    targetPosition.current.z = THREE.MathUtils.clamp(
      targetPosition.current.z,
      BOUNDS.zMin,
      BOUNDS.zMax
    );

    // ========================================
    // 5. SMOOTH INTERPOLATION (KEY TO SMOOTHNESS!)
    // ========================================
    // Use delta-time based lerp for frame-rate independence
    const lerpFactor = 1 - Math.pow(0.001, delta);
    smoothPosition.current.lerp(targetPosition.current, lerpFactor);

    return smoothPosition.current;
  };

  return update;
}

// ============================================
// SHAPE COMPONENTS
// ============================================

function Sphere({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.1}
        metalness={0.8}
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
}

function Torus({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * rotationSpeed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
    </mesh>
  );
}

function Octahedron({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

function Box({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

function SmallSphere({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

function SmallOctahedron({ shapeId, position, color, radius, shapeStore, config, rotationSpeed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const getPosition = useNoiseWandering(shapeId, initialPos, config, shapeStore, radius);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const pos = getPosition(delta);
      meshRef.current.position.copy(pos);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.35 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25 * rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.5]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

// ============================================
// SCENE
// ============================================

function Scene() {
  const shapeStore = useShapeStore();

  // Emerald color palette
  const primaryColor = "#047857";
  const secondaryColor = "#10b981";
  const mutedColor = "#065f46";

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color={primaryColor} />
      <pointLight position={[10, -10, 5]} intensity={0.4} color={secondaryColor} />

      {/* Large Sphere - slow, graceful */}
      <Sphere
        shapeId="sphere"
        position={[2.5, 1.5, -3]}
        color={primaryColor}
        radius={1.2}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.15, wanderRange: 2.0 }}
        rotationSpeed={0.8}
      />

      {/* Torus - medium, flowing */}
      <Torus
        shapeId="torus"
        position={[-3, -1, -4]}
        color={secondaryColor}
        radius={1.5}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.2, wanderRange: 2.5 }}
        rotationSpeed={0.6}
      />

      {/* Octahedron - faster, energetic */}
      <Octahedron
        shapeId="octahedron"
        position={[3, -1, -5]}
        color={primaryColor}
        radius={1.2}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.25, wanderRange: 2.8 }}
        rotationSpeed={0.7}
      />

      {/* Box - very slow, heavy */}
      <Box
        shapeId="box"
        position={[-2.5, 2, -3.5]}
        color={mutedColor}
        radius={1.0}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.12, wanderRange: 1.8 }}
        rotationSpeed={0.5}
      />

      {/* Small sphere - quick, playful */}
      <SmallSphere
        shapeId="smallSphere"
        position={[0.5, 2.5, -5]}
        color={secondaryColor}
        radius={0.5}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.3, wanderRange: 2.5 }}
        rotationSpeed={1.2}
      />

      {/* Small octahedron - medium */}
      <SmallOctahedron
        shapeId="smallOctahedron"
        position={[-1, -2.5, -4.5]}
        color={primaryColor}
        radius={0.6}
        shapeStore={shapeStore}
        config={{ noiseScale: 0.22, wanderRange: 2.2 }}
        rotationSpeed={1.0}
      />
    </>
  );
}

// ============================================
// MAIN EXPORT
// ============================================

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
