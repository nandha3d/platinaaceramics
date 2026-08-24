import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from './ErrorBoundary';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ──────────────────────────────────────────────────────────────
// PBR Ceramic — Whiter and brighter
// ──────────────────────────────────────────────────────────────
/**
 * Transcribed verbatim from the reference build's bundle
 * (backups/ceramica-site-live/assets/index-B--aQ42u.js).
 *
 * Several rounds were lost tuning these by eye — warmer, glossier, less sheen —
 * each change reasonable on its own and each one moving further from the render
 * that was already approved. Do not "improve" these values in isolation; if the
 * look needs to change, change the environment, which is what actually drives it.
 */
const CERAMIC_MAT = {
  color: '#FFFFFF',
  roughness: 0.05,
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
function ShinyWhiteBowl({ radius, height, wallThickness = 0.1, position = [0, 0, 0], glaze = null }) {
  const outerR = radius;
  const innerR = radius - wallThickness;
  const h = height;
  const cr = Math.min(0.25, h * 0.4);

  const points = useMemo(() => {
    const pts = [];
    // 48 profile samples. At 30 the rounded inner corner was faceted enough to
    // catch the light as a visible band once the glaze went glossy.
    const N = 48;
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

  const SEGMENTS = 128;

  /*
    LatheGeometry assigns v from the POINT INDEX (`j / (points.length - 1)`), not
    from distance along the profile. This profile spends 48 of its points on the
    small inner floor and rounded corner, then covers the whole wall, rim and
    outside in about 8 more — so most of the v range lands on a few millimetres
    of the bowl while the tall outer wall is crushed into a sliver of texture.

    That, not the repeat count, is why the glaze smeared into diagonal dashes.
    Rewriting v as cumulative arc length gives even texel density all the way
    along the profile, after which the repeat can be set honestly.
  */
  const geometry = useMemo(() => {
    const g = new THREE.LatheGeometry(points, SEGMENTS);
    const n = points.length;

    const arc = new Float32Array(n);
    let total = 0;
    for (let j = 1; j < n; j++) {
      total += points[j].distanceTo(points[j - 1]);
      arc[j] = total;
    }
    if (total > 0) {
      const uv = g.attributes.uv;
      for (let i = 0; i <= SEGMENTS; i++) {
        for (let j = 0; j < n; j++) uv.setY(i * n + j, arc[j] / total);
      }
      uv.needsUpdate = true;
    }
    g.userData.profileLength = total;
    return g;
  }, [points]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // With uniform UVs, matching the repeat to the circumference/profile ratio
  // keeps every motif square rather than stretched.
  const glazeMap = useMemo(() => {
    if (!glaze) return null;
    const circumference = 2 * Math.PI * outerR;
    const profileLen = geometry.userData.profileLength || 1;
    const around = 9;
    const t = glaze.clone();
    t.needsUpdate = true;
    t.repeat.set(around, Math.max(1, Math.round(around * (profileLen / circumference))));
    return t;
  }, [glaze, outerR, geometry]);

  useEffect(() => () => glazeMap?.dispose(), [glazeMap]);

  return (
    <mesh position={position} receiveShadow geometry={geometry}>
      <meshPhysicalMaterial
        key={glazeMap ? 'glazed' : 'plain'}
        map={glazeMap}
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

/**
 * Reads a CSS custom property off the document root and keeps it current when
 * the palette switcher changes `data-palette`.
 *
 * The 3D scene sits outside the CSS cascade, so anything in it that should
 * follow the theme has to sample the token explicitly and rebuild.
 */
function useThemeToken(name, fallback = '#900100') {
  const read = useCallback(() => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch {
      return fallback;
    }
  }, [name, fallback]);

  const [value, setValue] = useState(read);

  useEffect(() => {
    const sync = () => setValue(read());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] });
    return () => mo.disconnect();
  }, [read]);

  return value;
}

/**
 * Painted floral glaze for the bowls, drawn to a canvas so it can be tinted from
 * the live theme colour rather than shipped as a fixed image.
 *
 * Kept low in contrast on purpose: this is a glaze under a clearcoat, so it
 * should read as decoration in the surface, not as a decal sitting on top of it.
 */
function makeFlowerTexture(tint) {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, S, S);

  const petal = (cx, cy, r, rot, alpha) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = tint;
    for (let p = 0; p < 6; p++) {
      ctx.beginPath();
      ctx.rotate((Math.PI * 2) / 6);
      // Rounder than a true petal on purpose: a 2:1 ellipse survives any residual
      // stretch as a dash, which is what the earlier version degraded into.
      ctx.ellipse(r * 0.5, 0, r * 0.33, r * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = alpha * 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  /*
    Drawn as a genuinely seamless tile: every motif is also painted at the eight
    wrapped offsets, so a flower crossing an edge continues on the opposite side
    instead of being clipped. Without this the repeat showed hard seams that read
    as diagonal banding once the texture was stretched around the lathe.
  */
  const cells = 3;
  const step = S / cells;
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const offset = row % 2 ? step / 2 : 0;
      const cx = col * step + offset + step / 2;
      const cy = row * step + step / 2;
      const r = step * 0.36;
      const rot = row * 0.4 + col * 0.7;
      for (const dx of [-S, 0, S]) {
        for (const dy of [-S, 0, S]) petal(cx + dx, cy + dy, r, rot, 0.15);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
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
 * FALLBACK light rig, used only when the HDRI fails to load.
 *
 * This was the primary source for several iterations and never matched the
 * reference, because emissive planes cannot reproduce a real capture's dynamic
 * range — see SceneEnvironment below, which is now the primary path. It is kept
 * because losing the environment map entirely leaves every PBR surface lit by
 * direct lights alone, which looks far worse than an approximation.
 *
 * Also on the rejected list, recorded so they are not retried:
 *   - drei <Environment> with <Lightformer> children mounts a portal scene and
 *     stopped the hero rendering altogether.
 *   - drei <Environment preset="...">, which streams the .hdr from a CDN. The
 *     preset itself is fine — the reference build ships it — but the runtime
 *     dependency on a third-party host is not, so the same file is self-hosted
 *     under /hdri instead.
 */
function makeStudioScene() {
  const scene = new THREE.Scene();
  // Dim warm surround, standing in for an interior's walls. Cool near-black was
  // used before; it left the ceramic and the concrete reading blue-grey next to
  // the reference build, which is warm throughout.
  scene.background = new THREE.Color('#1A1613');

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

  /*
    Built to mimic an interior HDRI's DYNAMIC RANGE, not just its average level.

    A glossy sphere's highlight is a mirror image of whatever is emitting, so how
    bright a source is matters far less than how bright it is *per unit of solid
    angle*. An apartment HDRI is dim almost everywhere and carries a couple of
    small windows at 10-50x — which is why its highlights are small, hard and
    punchy while the overall exposure stays low.

    Two earlier attempts both failed by treating this as one global level: broad
    panels at 6.0 blew every surface to flat white, and scaling those same broad
    panels down by 4x fixed the exposure but flattened the gloss to a dull sheen,
    because a large dim emitter reflects as a large dim smear.

    So the sources are now split by role. The windows are small and very hot —
    they own the specular character. Everything else is broad and dim, and only
    fills. Total energy stays near the previous pass; the distribution is what
    changed.
  */
  // Windows — small, hot, warm. These are the visible highlights on the glaze.
  panel('#FFF6E8', 15.0, [-7, 5, 2], [0, Math.PI / 2, 0], [3.4, 6.5]);
  panel('#FFF1DC', 8.0, [7.5, 4.5, -1.5], [0, -Math.PI / 2, 0], [2.8, 5.5]);
  // Overhead softbox: broad, so it fills rather than defines. Kept low.
  panel('#FFF8F0', 1.5, [0, 9, 0], [-Math.PI / 2, 0, 0], [14, 14]);
  // Cool rim behind, to separate the media from the floor.
  panel('#E8F0FF', 1.3, [0, 5, -11], [0, 0, 0], [16, 7]);
  // Warm bounce off the floor.
  panel('#FFE8CC', 0.5, [0, -2, 2], [Math.PI / 2, 0, 0], [16, 16]);
  return scene;
}

/**
 * Image-based lighting from a real captured environment.
 *
 * This is the same map the reference build uses. drei's `preset="apartment"`
 * resolves to lebombo_1k.hdr — a warm late-afternoon interior — which is where
 * ceramica's warm cast and its small, hard specular hits both come from. No
 * hand-built rig of emissive planes reproduces that, because a real capture
 * carries genuine high dynamic range: dim almost everywhere, with small sources
 * orders of magnitude brighter. Two attempts to fake it failed, one too bright
 * and one too flat.
 *
 * The file is served from our own /hdri rather than drei's CDN, so the hero
 * never depends on a third-party fetch.
 *
 * Loaded imperatively, NOT through drei's <Environment>, which suspends. A
 * suspending child inside this Canvas is what previously unmounted the whole
 * hero and left a flat panel in its place. If the map fails to load, the scene
 * degrades to the panel rig below instead of losing its lighting.
 */
function SceneEnvironment({
  intensity = 1.0,
  file = 'hdri/lebombo_1k.hdr',
  background = false,
  backgroundBlurriness = 0.05,
  backgroundIntensity = 0.35,
  onStat
}) {
  const { gl, scene } = useThree();

  useEffect(() => {
    let cancelled = false;
    let pmrem = null;
    let target = null;

    const commit = (texture, label) => {
      scene.environment = texture;
      scene.environmentIntensity = intensity;
      if (background) {
        scene.background = texture;
        scene.backgroundBlurriness = backgroundBlurriness;
        scene.backgroundIntensity = backgroundIntensity;
      }
      onStat?.('env', label);
    };

    // PMREM needs half-float render targets; some drivers refuse them and an
    // exception here would take the canvas down, so degrade to direct lights.
    const applyStudioRig = (why) => {
      try {
        const studio = makeStudioScene();
        target = pmrem.fromScene(studio, 0.03);
        studio.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) o.material.dispose();
        });
        commit(target.texture, `panel rig (${why})`);
      } catch (err) {
        onStat?.('env', `FAILED ${err && err.message}`);
      }
    };

    try {
      pmrem = new THREE.PMREMGenerator(gl);
      pmrem.compileEquirectangularShader();
    } catch (err) {
      onStat?.('env', `FAILED pmrem ${err && err.message}`);
      return undefined;
    }

    const url = import.meta.env.BASE_URL + file;
    onStat?.('env', 'loading hdri…');

    new RGBELoader().load(
      url,
      (hdr) => {
        if (cancelled) { hdr.dispose(); return; }
        try {
          hdr.mapping = THREE.EquirectangularReflectionMapping;
          target = pmrem.fromEquirectangular(hdr);
          hdr.dispose();
          commit(target.texture, file.replace('hdri/', ''));
        } catch (err) {
          applyStudioRig(err && err.message);
        }
      },
      undefined,
      () => { if (!cancelled) applyStudioRig('hdri 404'); }
    );

    return () => {
      cancelled = true;
      scene.environment = null;
      if (background) scene.background = null;
      try {
        target?.dispose();
        pmrem?.dispose();
      } catch { /* nothing useful to do on teardown */ }
    };
  }, [gl, scene, intensity, file, background, backgroundBlurriness, backgroundIntensity, onStat]);

  return null;
}

/**
 * The browser drops the WebGL context under memory pressure or on GPU driver
 * resets. Without this the canvas silently paints nothing but the clear colour.
 * Calling preventDefault on the loss event lets the browser restore it.
 */
function ReadySignal({ onReady, onFirstFrame, onStat }) {
  const fired = useRef(false);
  const frames = useRef(0);
  const { gl } = useThree();

  useEffect(() => {
    try {
      const ctx = gl.getContext();
      const dbg = ctx.getExtension('WEBGL_debug_renderer_info');
      onStat?.('gpu', dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'hidden');
    } catch {
      onStat?.('gpu', 'unavailable');
    }
  }, [gl, onStat]);

  useFrame(() => {
    frames.current += 1;
    if (!fired.current) {
      fired.current = true;
      onReady?.();
      onFirstFrame?.();
    }
    // Reported periodically rather than every frame: a frozen counter is the
    // signal that the loop died, and that is invisible if it is only sampled once.
    if (frames.current % 30 === 0) onStat?.('frames', String(frames.current));
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
      {/* multisampling is left at the library default of 8, as in the reference.
          It had been forced to 0 here, which disabled MSAA entirely — the
          Canvas's own antialias flag does nothing once the composer owns the
          render, so the whole scene was rendering without any edge smoothing. */}
      <EffectComposer>
        {/* Exactly the reference's four props, and deliberately nothing else.
            The extras that were here — aoSamples 32, denoiseRadius, quality
            "high", and above all color "#1E1A14" — each looked like an
            improvement and together weakened the effect: N8AO's default
            occlusion colour is black, so tinting it warm was lightening every
            crevice. aoTones quantises the occlusion into bands, which is what
            makes the contact darkening read as strongly as it does. */}
        <N8AO aoRadius={1.2} intensity={2.5} aoTones={0.5} halfRes />
        {/*
          UNCHARTED2, matching the reference's `mode: 4` — its bundle carries the
          same AGX/NEUTRAL enum ordering as ours, so index 4 is Uncharted2 in
          both.

          ACES was used here instead, on the reasoning that the composer blanks
          renderer.toneMapping and the pass should therefore restore what the
          Canvas asked for. That reasoning is fine and the conclusion was still
          wrong: matching the approved render matters more than matching our own
          default. The two curves are not close — ACES lifts the midtones and
          desaturates, which is precisely the washed-out ceramic and the shallow
          crevices; Uncharted2's stronger toe keeps the occlusion dark and the
          whites creamy.
        */}
        <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
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
/**
 * The floor loads its texture imperatively rather than through drei's
 * useTexture.
 *
 * useTexture suspends, and nothing inside the Canvas caught that suspension, so
 * a stalled or 404'd image did not degrade the floor — it unmounted the entire
 * hero and handed control to the page-level Suspense fallback. The failure then
 * looked exactly like a working-but-empty scene. A decorative surface map must
 * never be able to do that, so the mesh renders immediately in flat grey and the
 * map is swapped in if and when it arrives.
 */
function ConcreteFloor({ onStat }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = import.meta.env.BASE_URL + 'concrete.png';
    onStat?.('floor', 'loading');

    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (cancelled) { t.dispose(); return; }
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(8, 8);
        t.colorSpace = THREE.SRGBColorSpace;
        t.needsUpdate = true;
        setTexture(t);
        onStat?.('floor', 'ok');
      },
      undefined,
      () => { if (!cancelled) onStat?.('floor', `FAILED ${url}`); }
    );

    return () => { cancelled = true; };
  }, [onStat]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      {/* Keyed so the material recompiles when the map appears; swapping a map
          from null to a texture needs a shader rebuild, not just an assignment. */}
      <meshStandardMaterial
        key={texture ? 'mapped' : 'plain'}
        map={texture || null}
        roughness={0.9}
        metalness={0.1}
        color="#F0F0F0"
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

const TOTAL_BALLS = BOWLS.reduce((s, b) => s + b.count, 0);

/**
 * Hover copy for the bowl markers.
 *
 * Size bands are taken from the catalogue's real ladder
 * (3, 6, 8, 10, 13, 16, 19, 25, 30, 38, 50, 60, 75 mm) and grouped to match the
 * four ball radii on screen. Nothing here is invented — a hero that quotes
 * specs a buyer can't find on the datasheet is worse than one that quotes none.
 */
const BOWL_INFO = {
  xl: {
    title: 'Bottom bed support',
    size: '50 – 75 mm',
    note: 'Carries the full catalyst load above the outlet collector.',
    specs: [
      ['Crush strength', '> 1500 kg'],
      ['Bulk density', '2.0 – 2.2 g/cm³'],
      ['Water absorption', '< 0.5 %'],
      ['Voidage', '38 – 40 %']
    ]
  },
  large: {
    title: 'Intermediate grading',
    size: '25 – 38 mm',
    note: 'Steps the bed down without letting fines migrate.',
    specs: [
      ['Crush strength', '> 800 kg'],
      ['Acid resistance', '≥ 99.8 %'],
      ['Max service temp', '1650 °C'],
      ['Hardness', '≥ 9.0 Mohs']
    ]
  },
  med: {
    title: 'Upper grading',
    size: '10 – 19 mm',
    note: 'Distributes feed evenly across the reactor cross-section.',
    specs: [
      ['Crush strength', '> 300 kg'],
      ['Alumina content', '17 – 99 % Al₂O₃'],
      ['Sphericity', 'Isostatically formed'],
      ['Standard', 'HG/T 3683.1-2014']
    ]
  },
  small: {
    title: 'Fine topping',
    size: '3 – 8 mm',
    note: 'Holds the catalyst down and catches particulates before the active bed.',
    specs: [
      ['Crush strength', '> 75 kg'],
      ['Fe₂O₃ content', '< 0.2 %'],
      ['Thermal shock', 'Resistant'],
      ['Batch certified', 'Every consignment']
    ]
  }
};

// ──────────────────────────────────────────────────────────────
// Shared solver
// ──────────────────────────────────────────────────────────────
const GRAVITY = -20;
const RESTITUTION = 0.28;
const FRICTION = 0.991;
const DRAG_SPRING = 14;
const MOUSE_PUSH = 3;
const MASS_SCALE = 6.0;

/**
 * Advances the whole bed by one timestep.
 *
 * Shared deliberately by the live frame loop and by the pre-settle pass that
 * runs before the first frame. An earlier plan had the settle pass carry its own
 * copy of this maths; two integrators that are supposed to agree but are edited
 * separately will not stay in agreement, and the symptom would be balls visibly
 * jumping the moment the scene starts animating.
 *
 * `drag` is { idx, point } while a ball is held, otherwise null.
 */
function stepPhysics(balls, dt, drag) {
  const n = balls.length;
  const dragIdx = drag ? drag.idx : -1;
  const mouse = drag ? drag.point : null;

  // Forces
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    b.vy += GRAVITY * dt;

    if (dragIdx === i && mouse) {
      b.vx = (mouse.x - b.px) * DRAG_SPRING;
      b.vy = (mouse.y - b.py) * DRAG_SPRING;
      b.vz = (mouse.z - b.pz) * DRAG_SPRING;
    } else if (mouse) {
      const dx = b.px - mouse.x;
      const dy = b.py - mouse.y;
      const dz = b.pz - mouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 1.8 && dist > 0.01) {
        const str = ((1.8 - dist) / 1.8) * MOUSE_PUSH;
        b.vx += (dx / dist) * str * dt;
        b.vy += (dy / dist) * str * dt;
        b.vz += (dz / dist) * str * dt;
      }
    }
  }

  // Ball-to-ball collisions
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
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
        if (dragIdx !== i) { a.px += nx * overlap * rA * 0.85; a.py += ny * overlap * rA * 0.85; a.pz += nz * overlap * rA * 0.85; }
        if (dragIdx !== j) { bb.px -= nx * overlap * rB * 0.85; bb.py -= ny * overlap * rB * 0.85; bb.pz -= nz * overlap * rB * 0.85; }
        const dvx = a.vx - bb.vx, dvy = a.vy - bb.vy, dvz = a.vz - bb.vz;
        const dvDotN = dvx * nx + dvy * ny + dvz * nz;
        if (dvDotN < 0) {
          const imp = -(1 + RESTITUTION) * dvDotN / (1 / a.mass + 1 / bb.mass);
          if (dragIdx !== i) { a.vx += (imp / a.mass) * nx; a.vy += (imp / a.mass) * ny; a.vz += (imp / a.mass) * nz; }
          if (dragIdx !== j) { bb.vx -= (imp / bb.mass) * nx; bb.vy -= (imp / bb.mass) * ny; bb.vz -= (imp / bb.mass) * nz; }
        }
      }
    }
  }

  // Integrate + containment
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    const bowl = BOWLS[b.bowlIdx];
    const bcx = bowl.cx, bcz = bowl.cz;
    const bowlInner = bowl.bowlR - 0.12;

    b.vx *= FRICTION; b.vy *= FRICTION; b.vz *= FRICTION;
    b.px += b.vx * dt; b.py += b.vy * dt; b.pz += b.vz * dt;

    if (b.py - b.radius < 0) {
      b.py = b.radius;
      b.vy = Math.abs(b.vy) * RESTITUTION;
      b.vx *= 0.96; b.vz *= 0.96;
      if (Math.abs(b.vy) < 0.1) b.vy = 0;
    }

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

    if (b.py > 10) { b.py = 10; b.vy *= -0.2; }

    b.rx += (b.vy * dt) / (b.radius || 1) * 0.35;
    b.ry += (b.vx * dt) / (b.radius || 1) * 0.35;
    b.rz += (b.vz * dt) / (b.radius || 1) * 0.25;
  }
}

/**
 * Runs the bed forward until it has come to rest, before the first frame.
 *
 * The balls are seeded in a column above their bowl, so without this the hero
 * opens on a few seconds of them raining down. That reads as the page still
 * loading, which is the opposite of what a hero should do, and it is the first
 * thing a visitor sees on the slowest connection.
 *
 * 320 steps at the frame loop's own clamp is comfortably past settling for every
 * bowl. It costs one O(n^2) pass per step over 269 balls — a few tens of
 * milliseconds once, off the critical path of the first paint.
 */
function settleBalls(balls, steps = 320) {
  for (let i = 0; i < steps; i++) stepPhysics(balls, 0.022, null);
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    b.vx = 0; b.vy = 0; b.vz = 0;
  }
  return balls;
}

/**
 * The settled bed is identical every time, so it is worth computing once per
 * browser and reusing. Bumping SETTLE_CACHE_KEY invalidates it — do that if the
 * bowl layout, ball counts or solver constants change, otherwise a stale cache
 * would restore positions that no longer fit their bowls.
 *
 * Every access is guarded: localStorage throws outright in some embedded
 * webviews and when site data is blocked, and a cosmetic optimisation must never
 * be able to take the hero down. A miss just means paying for the settle pass.
 */
const SETTLE_CACHE_KEY = 'platinaa.hero.settled.v1';

function settleBallsCached(balls) {
  let cached = null;
  try {
    const raw = window.localStorage.getItem(SETTLE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === balls.length) cached = parsed;
    }
  } catch { /* unreadable storage is a cache miss, nothing more */ }

  if (cached) {
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      const c = cached[i];
      b.px = c[0]; b.py = c[1]; b.pz = c[2];
      b.rx = c[3]; b.ry = c[4]; b.rz = c[5];
      b.vx = 0; b.vy = 0; b.vz = 0;
    }
    return balls;
  }

  settleBalls(balls);

  try {
    // Rounded to millimetres: full float precision triples the payload for a
    // difference no one can see.
    const r = (v) => Math.round(v * 1000) / 1000;
    window.localStorage.setItem(
      SETTLE_CACHE_KEY,
      JSON.stringify(balls.map((b) => [r(b.px), r(b.py), r(b.pz), r(b.rx), r(b.ry), r(b.rz)]))
    );
  } catch { /* storage full or blocked; the scene is already correct */ }

  return balls;
}

// ──────────────────────────────────────────────────────────────
// Main Physics Scene
// ──────────────────────────────────────────────────────────────
/**
 * Pulsing marker above a bowl; hovering it reveals what that grade is for.
 *
 * drei's <Html> keeps the marker anchored to a world position while letting the
 * card itself be ordinary DOM, so it inherits the site's theme tokens instead of
 * needing colours baked into the scene.
 */
function BowlMarker({ bowl }) {
  const info = BOWL_INFO[bowl.id];
  if (!info) return null;

  // Open away from the centre of the row, so the outermost bowls' panels never
  // run off the edge of the viewport.
  const side = bowl.cx > 0 ? 'left' : 'right';

  return (
    <Html
      position={[bowl.cx, bowl.bowlH + 1.15, bowl.cz]}
      center
      distanceFactor={11}
      zIndexRange={[8, 0]}
    >
      <div
        className={`hero-hotspot hero-hotspot--${side}`}
        tabIndex={0}
        role="button"
        aria-label={`${info.title}, ${info.size}`}
      >
        <span className="hero-hotspot-dot" aria-hidden="true">
          <span className="hero-hotspot-ring" />
          <span className="hero-hotspot-ring hero-hotspot-ring--2" />
        </span>

        {/* Leader line, then the panel — both animate in on hover so the callout
            reads as being drawn rather than just appearing. */}
        <span className="hero-leader" aria-hidden="true" />

        <div className="hero-callout" role="tooltip">
          <span className="hero-callout-scan" aria-hidden="true" />
          <span className="hero-callout-corner hero-callout-corner--tl" aria-hidden="true" />
          <span className="hero-callout-corner hero-callout-corner--tr" aria-hidden="true" />
          <span className="hero-callout-corner hero-callout-corner--bl" aria-hidden="true" />
          <span className="hero-callout-corner hero-callout-corner--br" aria-hidden="true" />

          <div className="hero-callout-head">
            <span className="hero-callout-size">{info.size}</span>
            <span className="hero-callout-tag">GRADE</span>
          </div>
          <div className="hero-callout-title">{info.title}</div>

          <dl className="hero-callout-specs">
            {info.specs.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </React.Fragment>
            ))}
          </dl>

          <div className="hero-callout-note">{info.note}</div>
        </div>
      </div>
    </Html>
  );
}

function PhysicsScene({ isExploding, onStat }) {
  const { pointer, raycaster, camera, gl } = useThree();
  const meshRef = useRef();

  // Bowl glaze, rebuilt whenever the palette changes.
  const tint = useThemeToken('--brand-red');
  const glaze = useMemo(() => makeFlowerTexture(tint), [tint]);
  useEffect(() => () => glaze.dispose(), [glaze]);

  // Proves the scene subtree actually mounted. "The canvas is alive" and "the
  // contents are alive" are different facts, and conflating them is what made
  // this bug so hard to pin down: the top-level frame signal kept firing while
  // everything below this point was suspended out of the tree.
  useEffect(() => {
    onStat?.('scene', `mounted, ${TOTAL_BALLS} balls`);
    return () => onStat?.('scene', 'UNMOUNTED');
  }, [onStat]);
  const dummy = useMemo(() => new THREE.Object3D(), []);


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

    // Open on a bed that has already come to rest, rather than on several
    // seconds of balls raining into the bowls — that reads as the page still
    // loading. See settleBalls.
    settleBallsCached(allBalls);

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

    stepPhysics(
      balls,
      dt,
      isDragging.current && dragIdx.current >= 0
        ? { idx: dragIdx.current, point: intersectPt }
        : { idx: -1, point: intersectPt }
    );

    // Push the solved state into the instance matrices.
    for (let i = 0; i < TOTAL_BALLS; i++) {
      const b = balls[i];
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

      {/* Bowls, plus a marker above each one */}
      {BOWLS.map((bowl) => (
        <React.Fragment key={bowl.id}>
          <ShinyWhiteBowl
            radius={bowl.bowlR}
            height={bowl.bowlH}
            wallThickness={0.1}
            position={[bowl.cx, 0, bowl.cz]}
            glaze={glaze}
          />
          <BowlMarker bowl={bowl} />
        </React.Fragment>
      ))}

      {/* All ceramic balls in one instanced mesh */}
      <instancedMesh ref={meshRef} args={[null, null, TOTAL_BALLS]} castShadow receiveShadow frustumCulled={false}>
        {/* 16x12 left a visibly polygonal silhouette at hero size. */}
        <sphereGeometry args={[1, 32, 32]} />
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
          envMapIntensity={1.8}
          reflectivity={1}
        />
      </instancedMesh>

      {/* Concrete Floor from Texture */}
      <ConcreteFloor onStat={onStat} />
      {/* Contact shadows for each bowl area */}
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

// ──────────────────────────────────────────────────────────────
// Exported Canvas with SSAO + Shadows
// ──────────────────────────────────────────────────────────────
/**
 * Screen-space AO is on by default and can be switched off with ?ao=0.
 *
 * It was opt-in for a while, on the theory that the composer was what had left
 * the hero blank. That theory is now contradicted: the reference build on
 * animazon.in/ceramica ships the same N8AO pass — its bundle carries the N8AO
 * shader source — and renders correctly, so the composer is not inherently the
 * culprit. AO contributes most of the contact darkening that makes a bed of
 * white spheres read as solid rather than pasted on, so it is worth having on.
 * The query flag stays as a one-reload way to isolate it if the hero ever goes
 * dark again; the surrounding ErrorBoundary already degrades to a scene without
 * AO rather than taking the canvas down.
 */
function aoEnabled() {
  try {
    return new URLSearchParams(window.location.search).get('ao') !== '0';
  } catch {
    return true;
  }
}

export default function Physics3DHeroCanvas({ isExploding = false, onReady, onStat }) {
  const [painted, setPainted] = React.useState(false);
  const wantAO = React.useMemo(aoEnabled, []);

  useEffect(() => { onStat?.('chunk', 'loaded'); }, [onStat]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab', touchAction: 'none' }}>
      {/* gl and camera match the reference build exactly. In particular there is
          no dpr clamp and no toneMapping override: R3F already defaults to ACES
          filmic at exposure 1, and the clamp was quietly rendering the hero at
          lower resolution than the reference on high-DPI screens. */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 40, near: 0.1, far: 100 }}
      >
        <CameraRig />
        <ContextGuard />
        <ReadySignal onReady={onReady} onFirstFrame={() => setPainted(true)} onStat={onStat} />

        {/* The blurred HDRI is the backdrop, as in the reference. A flat navy
            fill was used while the map came from a CDN; now that it is
            self-hosted there is no reason to keep the substitute, and the warm
            surround is a large part of why the reference reads as a real room. */}
        <SceneEnvironment intensity={1.5} background onStat={onStat} />


        {/* Soft ambient */}
        <ambientLight intensity={0.25} />

        {/* Key directional with strong shadow */}
        <directionalLight
          position={[10, 22, 14]}
          intensity={3}
          color="#FFF8EE"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.00018}
          shadow-normalBias={0.03}
        >
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 50]} />
        </directionalLight>

        {/* Fill */}
        <directionalLight position={[-12, 10, -8]} intensity={0.45} color="#D0D8EC" />

        {/* Rim */}
        <pointLight position={[0, 14, -14]} intensity={0.7} color="#FFFFFF" />

        {/* Warm bounce */}
        <pointLight position={[4, 1, 8]} intensity={0.15} color="#F5EDE0" />

        {/*
          Suspense boundary INSIDE the Canvas. Without one, any child that
          suspends throws past the Canvas to the page-level fallback, which
          unmounts the renderer and replaces the hero with a flat panel — the
          exact symptom this scene had. Keeping the boundary here means a
          suspending child can only ever blank itself.
        */}
        <React.Suspense fallback={null}>
          <PhysicsScene isExploding={isExploding} onStat={onStat} />
        </React.Suspense>

        {/* Screen-space AO. Gated on the first painted frame -- see AmbientOcclusion. */}
        <AmbientOcclusion enabled={painted && wantAO} />

      </Canvas>

    </div>
  );
}
