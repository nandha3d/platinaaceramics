/**
 * REFERENCE ONLY — reconstructed from the live bundle at animazon.in/ceramica
 * (assets/index-B--aQ42u.js, app chunk starting line 5317).
 *
 * This is the hero the user described as "the properly working 3d hero section".
 * It is de-minified, not guessed: every numeric constant, colour, prop name and
 * branch below is transcribed from the shipped code. Identifiers that the
 * minifier renamed (Canvas, useThree, useFrame, useTexture, Environment,
 * ContactShadows, EffectComposer, N8AO, ToneMapping) were resolved from their
 * prop signatures and are noted where there was any ambiguity.
 *
 * Deliberate departures from the bundle, both cosmetic:
 *   - the lathe profile useMemo is hoisted out of the JSX argument list (the
 *     shipped code calls the hook inline inside `args={[useMemo(...)]}`);
 *   - dead expression `Math.sqrt(i) * 0.15` in the ball seeding loop is dropped.
 *
 * NOT wired into the build. Nothing imports this file.
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useTexture } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';

/* -------------------------------------------------------------------------- */
/* Materials                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The ceramic look. Note this is a *clearcoat* material, not a plain standard
 * material — the glaze reads as a separate specular layer over a near-smooth
 * body, which is what stops the balls looking flat.
 */
const CERAMIC = {
  color: '#FFFFFF',
  roughness: 0.05,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  ior: 1.76,
  specularIntensity: 1,
  specularColor: '#FFFFFF',
  sheen: 0.3,
  sheenRoughness: 0.2,
  sheenColor: '#FFFFFF',
};

/* -------------------------------------------------------------------------- */
/* Bowl — a lathed profile, not a boolean-subtracted primitive                  */
/* -------------------------------------------------------------------------- */

function Bowl({ radius, height, wallThickness = 0.1, position = [0, 0, 0] }) {
  const outer = radius;
  const inner = radius - wallThickness;
  const fillet = Math.min(0.25, height * 0.4);

  const profile = useMemo(() => {
    const pts = [];
    // Inner floor, then a quarter-round fillet up into the wall.
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      if (t < 0.65) {
        pts.push(new THREE.Vector2((t * inner) / 0.65, 0));
      } else {
        const a = (Math.PI / 2) * ((t - 0.65) / 0.35);
        pts.push(
          new THREE.Vector2(
            inner - fillet + Math.sin(a) * fillet,
            (1 - Math.cos(a)) * fillet
          )
        );
      }
    }
    pts.push(new THREE.Vector2(inner, fillet));
    pts.push(new THREE.Vector2(inner, height));
    pts.push(new THREE.Vector2(inner, height + 0.04)); // rim, inner lip
    pts.push(new THREE.Vector2(outer, height + 0.04)); // rim, outer lip
    pts.push(new THREE.Vector2(outer, height));
    pts.push(new THREE.Vector2(outer, 0.1));
    pts.push(new THREE.Vector2(outer * 0.95, 0));
    pts.push(new THREE.Vector2(0, -wallThickness * 0.2)); // underside
    pts.push(new THREE.Vector2(0, 0));
    return pts;
  }, [outer, inner, height, fillet, wallThickness]);

  return (
    <mesh position={position} receiveShadow>
      <latheGeometry args={[profile, 64]} />
      <meshPhysicalMaterial
        color="#FAFAFA"
        roughness={0.08}
        metalness={0.02}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Camera, floor, pick plane                                                   */
/* -------------------------------------------------------------------------- */

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 11, 7.5);
    camera.lookAt(0, 0, 0.5);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Floor() {
  // Absolute path including the deploy subfolder — this is baked, so the same
  // build cannot be served from the domain root without editing it.
  const map = useTexture('/ceramica/concrete.png');
  useEffect(() => {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);
    map.needsUpdate = true;
  }, [map]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={map} roughness={0.9} metalness={0.1} color="#F0F0F0" />
    </mesh>
  );
}

/** Invisible catcher so a pointerdown anywhere in the canvas starts a drag. */
function PickPlane({ onDown, onUp }) {
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 4, 0, 0]}
      onPointerDown={onDown}
      onPointerUp={onUp}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Ball field — hand-rolled physics, one instancedMesh for all 269 balls        */
/* -------------------------------------------------------------------------- */

const BOWLS = [
  { id: 'xl',    cx: -6.75, cz: 0, bowlR: 2.1, bowlH: 1, ballR: 0.45, count: 14,  label: 'XL' },
  { id: 'large', cx: -2.25, cz: 0, bowlR: 2.1, bowlH: 1, ballR: 0.35, count: 30,  label: 'Large' },
  { id: 'med',   cx:  2.25, cz: 0, bowlR: 2.1, bowlH: 1, ballR: 0.22, count: 65,  label: 'Medium' },
  { id: 'small', cx:  6.75, cz: 0, bowlR: 2.1, bowlH: 1, ballR: 0.14, count: 160, label: 'Small/Micro' },
];
const TOTAL = BOWLS.reduce((n, b) => n + b.count, 0); // 269

const RESTITUTION = 0.28;
const DAMPING = 0.991;
const GRAVITY = -20;
const GOLDEN_ANGLE = 2.39996;

function BallField({ isExploding }) {
  const { pointer, raycaster, camera, gl } = useThree();
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const balls = useMemo(() => {
    const out = [];
    BOWLS.forEach((bowl, bowlIdx) => {
      for (let i = 0; i < bowl.count; i++) {
        const theta = i * GOLDEN_ANGLE;
        const r = bowl.ballR;
        const volume = (4 / 3) * Math.PI * r * r * r;
        const dist = Math.random() * (bowl.bowlR - r - 0.2);
        out.push({
          radius: r,
          mass: volume * 6,
          px: bowl.cx + Math.cos(theta) * dist,
          py: bowl.bowlH + 0.5 + Math.random() * 5, // rain in from above
          pz: bowl.cz + Math.sin(theta) * dist,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.5),
          vz: (Math.random() - 0.5) * 0.3,
          rx: Math.random() * Math.PI * 2,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI * 2,
          bowlIdx,
        });
      }
    });
    return out;
  }, []);

  const dragIdx = useRef(-1);
  const dragging = useRef(false);
  const dragPlane = useMemo(() => new THREE.Plane(), []);
  const dragPoint = useMemo(() => new THREE.Vector3(), []);

  // Scroll wheel raises the held ball instead of scrolling the page.
  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e) => {
      if (!dragging.current || dragIdx.current < 0) return;
      const b = balls[dragIdx.current];
      b.py += e.deltaY * -0.008;
      b.py = Math.max(b.radius, Math.min(8, b.py));
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [gl, balls]);

  // Rising edge of isExploding kicks every ball upward and outward.
  const wasExploding = useRef(false);
  useEffect(() => {
    if (isExploding && !wasExploding.current) {
      balls.forEach((b) => {
        b.vy += 4 + Math.random() * 8;
        b.vx += (Math.random() - 0.5) * 6;
        b.vz += (Math.random() - 0.5) * 6;
      });
    }
    wasExploding.current = isExploding;
  }, [isExploding, balls]);

  const onDown = useCallback(
    (e) => {
      raycaster.setFromCamera(pointer, camera);
      const ray = raycaster.ray;
      const hit = new THREE.Vector3();
      const sphere = new THREE.Sphere();
      let best = -1;
      let bestDist = Infinity;

      for (let i = 0; i < TOTAL; i++) {
        const b = balls[i];
        sphere.center.set(b.px, b.py, b.pz);
        sphere.radius = b.radius * 1.4; // forgiving pick radius
        if (ray.intersectSphere(sphere, hit)) {
          const d = ray.origin.distanceTo(hit);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
      }

      if (best >= 0) {
        dragIdx.current = best;
        dragging.current = true;
        const b = balls[best];
        const n = new THREE.Vector3();
        camera.getWorldDirection(n);
        dragPlane.setFromNormalAndCoplanarPoint(n, new THREE.Vector3(b.px, b.py, b.pz));
        e.stopPropagation();
      }
    },
    [balls, camera, pointer, raycaster, dragPlane]
  );

  const onUp = useCallback(() => {
    dragging.current = false;
    dragIdx.current = -1;
  }, []);

  // Releasing outside the canvas must still drop the ball.
  useEffect(() => {
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [onUp]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.022); // never integrate a stall

    raycaster.setFromCamera(pointer, camera);
    if (dragging.current && dragIdx.current >= 0) {
      const b = balls[dragIdx.current];
      const n = new THREE.Vector3();
      camera.getWorldDirection(n);
      dragPlane.setFromNormalAndCoplanarPoint(n, new THREE.Vector3(b.px, b.py, b.pz));
    }
    raycaster.ray.intersectPlane(dragPlane, dragPoint);

    // Gravity, plus the cursor either hauling the held ball or nudging others.
    for (let i = 0; i < TOTAL; i++) {
      const b = balls[i];
      b.vy += GRAVITY * dt;

      if (dragging.current && dragIdx.current === i) {
        b.vx = (dragPoint.x - b.px) * 14;
        b.vy = (dragPoint.y - b.py) * 14;
        b.vz = (dragPoint.z - b.pz) * 14;
      } else {
        const dx = b.px - dragPoint.x;
        const dy = b.py - dragPoint.y;
        const dz = b.pz - dragPoint.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1.8 && d > 0.01) {
          const f = ((1.8 - d) / 1.8) * 3;
          b.vx += (dx / d) * f * dt;
          b.vy += (dy / d) * f * dt;
          b.vz += (dz / d) * f * dt;
        }
      }
    }

    // Pairwise sphere collisions. O(n²) — 269 balls is ~36k pairs per frame,
    // which is affordable precisely because it is plain arrays, no engine.
    for (let i = 0; i < TOTAL; i++) {
      for (let j = i + 1; j < TOTAL; j++) {
        const a = balls[i];
        const b = balls[j];
        const dx = a.px - b.px;
        const dy = a.py - b.py;
        const dz = a.pz - b.pz;
        const d2 = dx * dx + dy * dy + dz * dz;
        const rSum = a.radius + b.radius;
        if (d2 >= rSum * rSum || d2 <= 1e-4) continue;

        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const nz = dz / d;
        const overlap = rSum - d;
        const mTotal = a.mass + b.mass;
        const wA = b.mass / mTotal;
        const wB = a.mass / mTotal;

        // Positional de-penetration, weighted by the other body's mass. The
        // held ball is never pushed — the cursor owns it.
        if (dragIdx.current !== i) {
          a.px += nx * overlap * wA * 0.85;
          a.py += ny * overlap * wA * 0.85;
          a.pz += nz * overlap * wA * 0.85;
        }
        if (dragIdx.current !== j) {
          b.px -= nx * overlap * wB * 0.85;
          b.py -= ny * overlap * wB * 0.85;
          b.pz -= nz * overlap * wB * 0.85;
        }

        const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny + (a.vz - b.vz) * nz;
        if (vn < 0) {
          // -(1 + e) * vn / (1/mA + 1/mB), with e = RESTITUTION.
          const jImp = (-(1 + RESTITUTION) * vn) / (1 / a.mass + 1 / b.mass);
          if (dragIdx.current !== i) {
            a.vx += (jImp / a.mass) * nx;
            a.vy += (jImp / a.mass) * ny;
            a.vz += (jImp / a.mass) * nz;
          }
          if (dragIdx.current !== j) {
            b.vx -= (jImp / b.mass) * nx;
            b.vy -= (jImp / b.mass) * ny;
            b.vz -= (jImp / b.mass) * nz;
          }
        }
      }
    }

    // Integrate, then contain: floor, bowl wall, ceiling.
    for (let i = 0; i < TOTAL; i++) {
      const b = balls[i];
      const bowl = BOWLS[b.bowlIdx];

      b.vx *= DAMPING;
      b.vy *= DAMPING;
      b.vz *= DAMPING;
      b.px += b.vx * dt;
      b.py += b.vy * dt;
      b.pz += b.vz * dt;

      if (b.py - b.radius < 0) {
        b.py = b.radius;
        b.vy = Math.abs(b.vy) * RESTITUTION;
        b.vx *= 0.96;
        b.vz *= 0.96;
        if (Math.abs(b.vy) < 0.1) b.vy = 0; // let it actually settle
      }

      const rx = b.px - bowl.cx;
      const rz = b.pz - bowl.cz;
      const radial = Math.sqrt(rx * rx + rz * rz);
      const limit = bowl.bowlR - 0.12 - b.radius;
      if (radial > limit && radial > 0.001) {
        const ux = rx / radial;
        const uz = rz / radial;
        b.px = bowl.cx + ux * limit;
        b.pz = bowl.cz + uz * limit;
        const vRadial = b.vx * ux + b.vz * uz;
        if (vRadial > 0) {
          b.vx -= 2 * vRadial * ux * (1 - RESTITUTION * 0.4);
          b.vz -= 2 * vRadial * uz * (1 - RESTITUTION * 0.4);
        }
        b.vx *= 0.94;
        b.vz *= 0.94;
      }

      if (b.py > 10) {
        b.py = 10;
        b.vy *= -0.2;
      }

      // Fake rolling: spin proportional to travel over radius.
      b.rx += ((b.vy * dt) / (b.radius || 1)) * 0.35;
      b.ry += ((b.vx * dt) / (b.radius || 1)) * 0.35;
      b.rz += ((b.vz * dt) / (b.radius || 1)) * 0.25;

      dummy.position.set(b.px, b.py, b.pz);
      dummy.rotation.set(b.rx, b.ry, b.rz);
      dummy.scale.setScalar(b.radius); // unit sphere scaled per instance
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <PickPlane onDown={onDown} onUp={onUp} />

      {BOWLS.map((b) => (
        <Bowl
          key={b.id}
          radius={b.bowlR}
          height={b.bowlH}
          wallThickness={0.1}
          position={[b.cx, 0, b.cz]}
        />
      ))}

      <instancedMesh
        ref={meshRef}
        args={[null, null, TOTAL]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...CERAMIC} envMapIntensity={1.8} reflectivity={1} />
      </instancedMesh>

      <Floor />

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.7}
        scale={35}
        blur={1.8}
        far={6}
        color="#1E1A14"
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Canvas                                                                      */
/* -------------------------------------------------------------------------- */

export function CeramicaHeroCanvas({ isExploding }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ fov: 40, near: 0.1, far: 100 }}
      >
        <CameraRig />

        {/*
          The lighting that makes it look real. Note there is NO <Suspense>
          around this in the shipped code: <Environment preset> loads its HDRI
          over the network, so if that fetch fails the whole subtree never
          commits and the canvas paints background only.
        */}
        <Environment
          preset="apartment"
          background
          backgroundBlurriness={0.05}
          backgroundIntensity={0.35}
          environmentIntensity={1.5}
        />

        <ambientLight intensity={0.25} />

        <directionalLight
          position={[10, 22, 14]}
          intensity={3}
          color="#FFF8EE"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0003}
          shadow-normalBias={0.03}
        >
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 50]} />
        </directionalLight>

        <directionalLight position={[-12, 10, -8]} intensity={0.45} color="#D0D8EC" />
        <pointLight position={[0, 14, -14]} intensity={0.7} color="#FFFFFF" />
        <pointLight position={[4, 1, 8]} intensity={0.15} color="#F5EDE0" />

        <BallField isExploding={isExploding} />

        <EffectComposer>
          {/* `aoTones` is passed in the shipped build but the N8AO wrapper does
              not destructure it, so it is inert. Kept for fidelity. */}
          <N8AO aoRadius={1.2} intensity={2.5} aoTones={0.5} halfRes />
          <ToneMapping mode={4} />
        </EffectComposer>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '14px',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.35)',
          fontWeight: 600,
          pointerEvents: 'none',
          display: 'flex',
          gap: '10px',
        }}
      >
        <span>🖱️ Click &amp; drag</span>
        <span>⚙️ Scroll = lift</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section wrapper, as the live site mounts it                                 */
/* -------------------------------------------------------------------------- */

export function CeramicaHeroSection({ isExploding }) {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100vw',
        height: 'calc(100vh - 80px)',
        minHeight: '680px',
        // Break out of the centred container to go edge to edge.
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        background: '#0D0D0D',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <CeramicaHeroCanvas isExploding={isExploding} />
      </div>
    </section>
  );
}

export default CeramicaHeroCanvas;
