import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from './ErrorBoundary';
import { EffectComposer, N8AO } from '@react-three/postprocessing';

// ──────────────────────────────────────────────────────────────
// PBR Ceramic — Whiter and brighter
// ──────────────────────────────────────────────────────────────
const CERAMIC_MAT = {
  color: '#F7F7F5',
  // A touch off zero: a perfectly smooth body mirrors the environment so sharply
  // that the balls read as chrome. This keeps a tight, glossy highlight.
  roughness: 0.12,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  ior: 1.76,
  specularIntensity: 1.0,
  specularColor: '#FFFFFF',
  sheen: 0.3,
  sheenRoughness: 0.2,
  sheenColor: '#FFFFFF',
};

// ──────────────────────────────────────────────────────────────
// Shiny White Bowl (LatheGeometry)
// ──────────────────────────────────────────────────────────────
function ShinyWhiteBowl({ radius, height, wallThickness = 0.1, position = [0, 0, 0] }) {
  const outerR = radius;
  const innerR = radius - wallThickness;
  const h = height;
  const cr = Math.min(0.25, h * 0.4);

  const points = useMemo(() => {
    const pts = [];
    const N = 30;
    // Flat inner bottom → rounded corner → wall up
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      if (t < 0.65) {
        pts.push(new THREE.Vector2(t * innerR / 0.65, 0));
      } else {
        const ct = (t - 0.65) / 0.35;
        const a = (Math.PI / 2) * ct;
        pts.push(new THREE.Vector2(innerR - cr + Math.sin(a) * cr, (1 - Math.cos(a)) * cr));
      }
    }
    pts.push(new THREE.Vector2(innerR, cr));
    pts.push(new THREE.Vector2(innerR, h));
    // Rim
    pts.push(new THREE.Vector2(innerR, h + 0.04));
    pts.push(new THREE.Vector2(outerR, h + 0.04));
    pts.push(new THREE.Vector2(outerR, h));
    // Outside wall down
    pts.push(new THREE.Vector2(outerR, 0.1));
    pts.push(new THREE.Vector2(outerR * 0.95, 0));
    // Bottom outside
    pts.push(new THREE.Vector2(0, -wallThickness * 0.2));
    pts.push(new THREE.Vector2(0, 0));
    return pts;
  }, [outerR, innerR, h, cr, wallThickness]);

  return (
    <mesh position={position} receiveShadow>
      <latheGeometry args={[points, 40]} />
      <meshPhysicalMaterial
        color="#FAFAFA"
        roughness={0.08}
        metalness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        envMapIntensity={1.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ──────────────────────────────────────────────────────────────
// One bowl's worth of balls with self-contained physics
// ──────────────────────────────────────────────────────────────
function BowlBalls({ bowlCenter, bowlInnerR, ballCount, minR, maxR, meshRef, startIdx, allBalls }) {
  // This component just initializes ball data into the shared allBalls array
  // Physics is handled centrally in PhysicsScene
  return null;
}

/**
 * Studio environment, baked once through PMREMGenerator.
 *
 * Two approaches were tried and rejected before this one, both recorded here so
 * they are not attempted again:
 *   - drei <Environment preset="..."> streams an .hdr from a CDN that 404s.
 *   - drei <Environment> with <Lightformer> children mounts a portal scene and
 *     stopped the hero rendering altogether.
 *
 * So the light rig is built here as a plain THREE.Scene of emissive planes and
 * baked to a cubemap directly. Same result as lightformers — real reflections
 * and image-based lighting — with no portal and no network request. three's own
 * RoomEnvironment was the previous source; it works but is a flat grey box, so
 * ceramic lit by it has nothing bright to catch and reads as matte fill.
 */
function makeStudioScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A0E16');

  const panel = (color, intensity, pos, rot, scale) => {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(scale[0], scale[1], 1);
    scene.add(mesh);
    return mesh;
  };

  // Overhead softbox: the primary highlight sitting on top of every ball.
  panel('#FFFFFF', 6.0, [0, 9, 0], [-Math.PI / 2, 0, 0], [18, 18]);
  // Tall strip lights either side. On a sphere these resolve into the long
  // vertical specular streaks that read as glaze rather than paint.
  panel('#EAF2FF', 4.0, [-8, 4, 3], [0, Math.PI / 2, 0], [7, 12]);
  panel('#FFF0DE', 3.0, [8, 4, -2], [0, -Math.PI / 2, 0], [7, 10]);
  // Cool rim behind, to separate the media from the floor.
  panel('#CFE0FF', 2.2, [0, 5, -11], [0, 0, 0], [18, 8]);
  // Warm bounce off the floor.
  panel('#FFE4C6', 1.1, [0, -2, 2], [Math.PI / 2, 0, 0], [16, 16]);
  return scene;
}

function StudioEnv({ intensity = 1.0 }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    // PMREM needs half-float render targets; some drivers refuse them and an
    // exception here would take the canvas down, so degrade to direct lights.
    let pmrem, target, studio;
    try {
      pmrem = new THREE.PMREMGenerator(gl);
      studio = makeStudioScene();
      target = pmrem.fromScene(studio, 0.03);
      scene.environment = target.texture;
      scene.environmentIntensity = intensity;
    } catch (err) {
      console.warn('[hero-3d] environment map unavailable, using direct lights only', err);
    }

    return () => {
      scene.environment = null;
      try {
        target?.dispose();
        pmrem?.dispose();
        studio?.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) o.material.dispose();
        });
      } catch { /* nothing useful to do on teardown */ }
    };
  }, [gl, scene, intensity]);

  return null;
}

/**
 * The browser drops the WebGL context under memory pressure or on GPU driver
 * resets. Without this the canvas silently paints nothing but the clear colour.
 * Calling preventDefault on the loss event lets the browser restore it.
 */
function ReadySignal({ onReady, onFirstFrame }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onReady?.();
      onFirstFrame?.();
    }
  });
  return null;
}

/**
 * EffectComposer reads renderer.getContext().getContextAttributes().alpha when it
 * builds its passes. If it mounts before the WebGL context exists that call
 * returns null and throws "Cannot read properties of null (reading 'alpha')",
 * which previously took the whole canvas down. Mounting it only after the first
 * painted frame guarantees the context is live; the boundary is belt-and-braces
 * so an effect failure degrades to a scene without AO rather than a blank hero.
 */
function AmbientOcclusion({ enabled }) {
  if (!enabled) return null;
  return (
    <ErrorBoundary label="hero-ao" fallback={null}>
      {/* enableNormalPass is deliberately omitted: the library documents it as
          SSGI-only, and N8AO resolves depth itself. Adding the pass costs a
          full-screen render and is a needless failure surface. */}
      <EffectComposer multisampling={0}>
        <N8AO
          aoRadius={0.85}
          distanceFalloff={0.7}
          intensity={3.2}
          aoSamples={32}
          denoiseSamples={8}
          denoiseRadius={12}
          color="#0A0E18"
          quality="high"
        />
      </EffectComposer>
    </ErrorBoundary>
  );
}

function ContextGuard({ onLost }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (e) => {
      e.preventDefault();
      console.warn('[hero-3d] WebGL context lost — waiting for restore');
      onLost?.(true);
    };
    const handleRestored = () => {
      console.info('[hero-3d] WebGL context restored');
      onLost?.(false);
      invalidate();
    };

    canvas.addEventListener('webglcontextlost', handleLost, false);
    canvas.addEventListener('webglcontextrestored', handleRestored, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl, invalidate, onLost]);

  return null;
}

// ──────────────────────────────────────────────────────────────
// Camera rig — flatter angle, looking down at bowls
// ──────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 11, 7.5);
    camera.lookAt(0, 0, 0.5);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ──────────────────────────────────────────────────────────────
// Concrete Floor
// ──────────────────────────────────────────────────────────────
function ConcreteFloor() {
  // NOTE: useTexture suspends. It must be called unconditionally and must never
  // be wrapped in try/catch - doing so breaks the rules of hooks and throws
  // React error #310 ("rendered more hooks than during the previous render").
  const texture = useTexture(import.meta.env.BASE_URL + 'concrete.png');
  // ensure texture repeats nicely
  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.9} 
        metalness={0.1} 
        color="#EDE6E6" 
      />
    </mesh>
  );
}

// ──────────────────────────────────────────────────────────────
// Invisible pick plane
// ──────────────────────────────────────────────────────────────
function HitPlane({ onDown, onUp }) {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 4, 0, 0]} onPointerDown={onDown} onPointerUp={onUp} visible={false}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// ──────────────────────────────────────────────────────────────
// 4-Bowl Configuration (Perfect straight line, even spacing, centered)
// ──────────────────────────────────────────────────────────────
const BOWLS = [
  { id: 'xl',    cx: -6.75, cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.45, count: 14,  label: 'XL' },
  { id: 'large', cx: -2.25, cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.35, count: 30,  label: 'Large' },
  { id: 'med',   cx: 2.25,  cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.22, count: 65,  label: 'Medium' },
  { id: 'small', cx: 6.75,  cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.14, count: 160, label: 'Small/Micro' },
];

const TOTAL_BALLS = BOWLS.reduce((s, b) => s + b.count, 0); // 202

// ──────────────────────────────────────────────────────────────
// Main Physics Scene
// ──────────────────────────────────────────────────────────────
function PhysicsScene({ isExploding }) {
  const { pointer, raycaster, camera, gl } = useThree();
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const GRAVITY = -20;
  const RESTITUTION = 0.28;
  const FRICTION = 0.991;
  const DRAG_SPRING = 14;
  const MOUSE_PUSH = 3;
  const MASS_SCALE = 6.0;

  // Build all balls for all 5 bowls
  const { balls, bowlAssignments } = useMemo(() => {
    const allBalls = [];
    const assignments = [];
    let idx = 0;

    BOWLS.forEach((bowl, bIdx) => {
      for (let i = 0; i < bowl.count; i++) {
        // Distribute balls in a loose spiral column above their bowl so they fall in beautifully
        const angle = i * 2.39996;
        const rad = Math.sqrt(i) * 0.15;
        // Use uniform ball size per bowl
        const r = bowl.ballR;
        const vol = (4 / 3) * Math.PI * r * r * r;
        const dist = Math.random() * (bowl.bowlR - r - 0.2);

        allBalls.push({
          radius: r,
          mass: vol * MASS_SCALE,
          px: bowl.cx + Math.cos(angle) * dist,
          py: bowl.bowlH + 0.5 + Math.random() * 5,
          pz: bowl.cz + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.5),
          vz: (Math.random() - 0.5) * 0.3,
          rx: Math.random() * Math.PI * 2,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI * 2,
          bowlIdx: bIdx,
        });
        assignments.push(bIdx);
        idx++;
      }
    });

    return { balls: allBalls, bowlAssignments: assignments };
  }, []);

  // Drag state
  const dragIdx = useRef(-1);
  const isDragging = useRef(false);
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const intersectPt = useMemo(() => new THREE.Vector3(), []);

  // Scroll = lift ball
  useEffect(() => {
    const onWheel = (e) => {
      if (isDragging.current && dragIdx.current >= 0) {
        const b = balls[dragIdx.current];
        b.py += e.deltaY * -0.008;
        b.py = Math.max(b.radius, Math.min(8, b.py));
        e.preventDefault();
      }
    };
    const canvas = gl.domElement;
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [gl, balls]);

  // Explosion
  const prevExploding = useRef(false);
  useEffect(() => {
    if (isExploding && !prevExploding.current) {
      balls.forEach(b => {
        b.vy += 4 + Math.random() * 8;
        b.vx += (Math.random() - 0.5) * 6;
        b.vz += (Math.random() - 0.5) * 6;
      });
    }
    prevExploding.current = isExploding;
  }, [isExploding, balls]);

  // Pick
  const handlePointerDown = useCallback((e) => {
    raycaster.setFromCamera(pointer, camera);
    const ray = raycaster.ray;
    let closest = -1;
    let closestDist = Infinity;
    const hitPt = new THREE.Vector3();
    const tmpSphere = new THREE.Sphere();

    for (let i = 0; i < TOTAL_BALLS; i++) {
      const b = balls[i];
      tmpSphere.center.set(b.px, b.py, b.pz);
      tmpSphere.radius = b.radius * 1.4;
      const hit = ray.intersectSphere(tmpSphere, hitPt);
      if (hit) {
        const d = ray.origin.distanceTo(hitPt);
        if (d < closestDist) { closestDist = d; closest = i; }
      }
    }

    if (closest >= 0) {
      dragIdx.current = closest;
      isDragging.current = true;
      const b = balls[closest];
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      dragPlane.setFromNormalAndCoplanarPoint(camDir, new THREE.Vector3(b.px, b.py, b.pz));
      e.stopPropagation();
    }
  }, [balls, camera, pointer, raycaster, dragPlane]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    dragIdx.current = -1;
  }, []);

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerUp]);

  // ── PHYSICS LOOP ──
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.022);

    raycaster.setFromCamera(pointer, camera);
    if (isDragging.current && dragIdx.current >= 0) {
      const b = balls[dragIdx.current];
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      dragPlane.setFromNormalAndCoplanarPoint(camDir, new THREE.Vector3(b.px, b.py, b.pz));
    }
    raycaster.ray.intersectPlane(dragPlane, intersectPt);

    // Forces
    for (let i = 0; i < TOTAL_BALLS; i++) {
      const b = balls[i];
      b.vy += GRAVITY * dt;

      if (isDragging.current && dragIdx.current === i) {
        b.vx = (intersectPt.x - b.px) * DRAG_SPRING;
        b.vy = (intersectPt.y - b.py) * DRAG_SPRING;
        b.vz = (intersectPt.z - b.pz) * DRAG_SPRING;
      } else {
        const dx = b.px - intersectPt.x;
        const dy = b.py - intersectPt.y;
        const dz = b.pz - intersectPt.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.8 && dist > 0.01) {
          const str = ((1.8 - dist) / 1.8) * MOUSE_PUSH;
          b.vx += (dx / dist) * str * dt;
          b.vy += (dy / dist) * str * dt;
          b.vz += (dz / dist) * str * dt;
        }
      }
    }

    // Ball-to-ball collisions (only within same bowl for perf, unless dragged out)
    for (let i = 0; i < TOTAL_BALLS; i++) {
      for (let j = i + 1; j < TOTAL_BALLS; j++) {
        const a = balls[i], bb = balls[j];
        const dx = a.px - bb.px, dy = a.py - bb.py, dz = a.pz - bb.pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        const minDist = a.radius + bb.radius;
        if (distSq < minDist * minDist && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist, ny = dy / dist, nz = dz / dist;
          const overlap = minDist - dist;
          const totalMass = a.mass + bb.mass;
          const rA = bb.mass / totalMass, rB = a.mass / totalMass;
          if (dragIdx.current !== i) { a.px += nx * overlap * rA * 0.85; a.py += ny * overlap * rA * 0.85; a.pz += nz * overlap * rA * 0.85; }
          if (dragIdx.current !== j) { bb.px -= nx * overlap * rB * 0.85; bb.py -= ny * overlap * rB * 0.85; bb.pz -= nz * overlap * rB * 0.85; }
          const dvx = a.vx - bb.vx, dvy = a.vy - bb.vy, dvz = a.vz - bb.vz;
          const dvDotN = dvx * nx + dvy * ny + dvz * nz;
          if (dvDotN < 0) {
            const imp = -(1 + RESTITUTION) * dvDotN / (1 / a.mass + 1 / bb.mass);
            if (dragIdx.current !== i) { a.vx += (imp / a.mass) * nx; a.vy += (imp / a.mass) * ny; a.vz += (imp / a.mass) * nz; }
            if (dragIdx.current !== j) { bb.vx -= (imp / bb.mass) * nx; bb.vy -= (imp / bb.mass) * ny; bb.vz -= (imp / bb.mass) * nz; }
          }
        }
      }
    }

    // Integrate + bowl boundary
    for (let i = 0; i < TOTAL_BALLS; i++) {
      const b = balls[i];
      const bowl = BOWLS[b.bowlIdx];
      const bcx = bowl.cx, bcz = bowl.cz;
      const bowlInner = bowl.bowlR - 0.12;

      b.vx *= FRICTION; b.vy *= FRICTION; b.vz *= FRICTION;
      b.px += b.vx * dt; b.py += b.vy * dt; b.pz += b.vz * dt;

      // Bowl floor
      if (b.py - b.radius < 0) {
        b.py = b.radius;
        b.vy = Math.abs(b.vy) * RESTITUTION;
        b.vx *= 0.96; b.vz *= 0.96;
        if (Math.abs(b.vy) < 0.1) b.vy = 0;
      }

      // Bowl circular wall
      const localX = b.px - bcx;
      const localZ = b.pz - bcz;
      const distXZ = Math.sqrt(localX * localX + localZ * localZ);
      const maxD = bowlInner - b.radius;
      if (distXZ > maxD && distXZ > 0.001) {
        const nx = localX / distXZ, nz = localZ / distXZ;
        b.px = bcx + nx * maxD;
        b.pz = bcz + nz * maxD;
        const vDotN = b.vx * nx + b.vz * nz;
        if (vDotN > 0) {
          b.vx -= 2 * vDotN * nx * (1 - RESTITUTION * 0.4);
          b.vz -= 2 * vDotN * nz * (1 - RESTITUTION * 0.4);
        }
        b.vx *= 0.94; b.vz *= 0.94;
      }

      // Ceiling cap
      if (b.py > 10) { b.py = 10; b.vy *= -0.2; }

      // Rolling
      b.rx += (b.vy * dt) / (b.radius || 1) * 0.35;
      b.ry += (b.vx * dt) / (b.radius || 1) * 0.35;
      b.rz += (b.vz * dt) / (b.radius || 1) * 0.25;

      dummy.position.set(b.px, b.py, b.pz);
      dummy.rotation.set(b.rx, b.ry, b.rz);
      dummy.scale.setScalar(b.radius);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <HitPlane onDown={handlePointerDown} onUp={handlePointerUp} />

      {/* 5 Shiny White Bowls */}
      {BOWLS.map((bowl) => (
        <ShinyWhiteBowl
          key={bowl.id}
          radius={bowl.bowlR}
          height={bowl.bowlH}
          wallThickness={0.1}
          position={[bowl.cx, 0, bowl.cz]}
        />
      ))}

      {/* All ceramic balls in one instanced mesh */}
      <instancedMesh ref={meshRef} args={[null, null, TOTAL_BALLS]} castShadow receiveShadow frustumCulled={false}>
        {/* 16x12 left a visibly polygonal silhouette at hero size. */}
        <sphereGeometry args={[1, 48, 32]} />
        <meshPhysicalMaterial
          color={CERAMIC_MAT.color}
          roughness={CERAMIC_MAT.roughness}
          metalness={CERAMIC_MAT.metalness}
          clearcoat={CERAMIC_MAT.clearcoat}
          clearcoatRoughness={CERAMIC_MAT.clearcoatRoughness}
          ior={CERAMIC_MAT.ior}
          specularIntensity={CERAMIC_MAT.specularIntensity}
          specularColor={CERAMIC_MAT.specularColor}
          sheen={CERAMIC_MAT.sheen}
          sheenRoughness={CERAMIC_MAT.sheenRoughness}
          sheenColor={CERAMIC_MAT.sheenColor}
          envMapIntensity={1.15}
          reflectivity={1}
        />
      </instancedMesh>

      {/* Concrete Floor from Texture */}
      <ConcreteFloor />
      {/* Contact shadows for each bowl area */}
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.7}
        scale={35}
        blur={1.8}
        far={6}
        color="#010D20"
      />
    </group>
  );
}

// ──────────────────────────────────────────────────────────────
// Exported Canvas with SSAO + Shadows
// ──────────────────────────────────────────────────────────────
/**
 * Screen-space AO is opt-in via ?ao=1.
 *
 * EffectComposer replaces the render loop. This file already records one episode
 * where post-processing "killed the whole canvas", and the hero has been blank
 * since AO was reintroduced — so the default is the render path known to work,
 * and AO is a flag rather than a guess. Load the page with ?ao=1 to turn it on:
 * if the hero renders without it and goes blank with it, the composer is the
 * cause and we stop looking elsewhere.
 */
function aoRequested() {
  try {
    return new URLSearchParams(window.location.search).get('ao') === '1';
  } catch {
    return false;
  }
}

export default function Physics3DHeroCanvas({ isExploding = false, onReady }) {
  const [painted, setPainted] = React.useState(false);
  const wantAO = React.useMemo(aoRequested, []);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab', touchAction: 'none' }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ fov: 40, near: 0.1, far: 100 }}
      >
        <CameraRig />
        <ContextGuard />
        <ReadySignal onReady={onReady} onFirstFrame={() => setPainted(true)} />

        {/* Warm studio backdrop. Solid colour rather than an HDR background so the
            scene never depends on a network fetch. */}
        <color attach="background" args={['#010D20']} />

        <StudioEnv intensity={1.25} />


        {/* Soft ambient */}
        <ambientLight intensity={0.18} />

        {/* Key directional with strong shadow */}
        <directionalLight
          position={[10, 22, 14]}
          intensity={2.1}
          color="#FFF6EC"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.00018}
          shadow-normalBias={0.03}
        >
          <orthographicCamera attach="shadow-camera" args={[-14, 14, 14, -14, 0.1, 60]} />
        </directionalLight>

        {/* Fill */}
        <directionalLight position={[-12, 10, -8]} intensity={0.45} color="#C4D4F0" />

        {/* Rim */}
        <pointLight position={[0, 14, -14]} intensity={0.7} color="#FFFFFF" />

        {/* Warm bounce */}
        <pointLight position={[4, 1, 8]} intensity={0.15} color="#EDE4F2" />

        <PhysicsScene isExploding={isExploding} />

        {/* Screen-space AO. Gated on the first painted frame -- see AmbientOcclusion. */}
        <AmbientOcclusion enabled={painted && wantAO} />

      </Canvas>

    </div>
  );
}
