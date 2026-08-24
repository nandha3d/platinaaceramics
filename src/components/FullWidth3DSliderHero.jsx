import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

// three.js + the physics canvas are ~430 kB gzipped. Loading them lazily lets the
// hero copy paint first, which is what Google measures for LCP.
const Physics3DHeroCanvas = lazy(() => import('./Physics3DHeroCanvas'));

const BACKDROP =
  'radial-gradient(ellipse at 62% 55%, var(--clay-700) 0%, var(--clay-800) 55%, var(--clay-900) 100%)';

// Shown while the 3D chunk is still downloading.
function HeroBackdrop() {
  return <div style={{ width: '100%', height: '100%', background: BACKDROP }} />;
}

/**
 * Diagnostics live at the TOP of the hero, horizontally centred.
 *
 * The previous panel sat at `bottom: 76px` of a `100vh` section. On a laptop
 * that is below the fold, and it never appeared in any screenshot — so several
 * rounds of debugging were spent guessing at a failure the page was already
 * reporting, just off-screen. Anything diagnostic must be visible without
 * scrolling.
 *
 * Turn it off with ?diag=0 once the hero is confirmed working.
 */
function DiagPanel({ stats, note }) {
  const rows = Object.entries(stats);
  const bad = rows.some(([, v]) => /FAIL|UNMOUNT|unavailable/i.test(String(v)));

  return (
    <div
      style={{
        position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 5, maxWidth: 'min(560px, calc(100% - 28px))',
        padding: '12px 16px', borderRadius: '8px',
        background: 'rgba(4, 10, 24, 0.86)',
        border: `1px solid ${bad ? 'rgba(220,60,60,0.7)' : 'color-mix(in srgb, var(--on-accent) 22%, transparent)'}`,
        color: '#E8EDF5', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        lineHeight: 1.7, pointerEvents: 'none', backdropFilter: 'blur(6px)'
      }}
    >
      <strong style={{ display: 'block', marginBottom: '4px', letterSpacing: '0.1em' }}>
        HERO 3D DIAGNOSTIC {bad ? '— PROBLEM DETECTED' : ''}
      </strong>
      {note && <div style={{ marginBottom: '4px', color: '#FFB4B4' }}>{note}</div>}
      {rows.length === 0 && <div>waiting for the 3D chunk…</div>}
      {rows.map(([k, v]) => (
        <div key={k}>
          <span style={{ opacity: 0.6 }}>{k}:</span>{' '}
          <span style={{ color: /FAIL|UNMOUNT/i.test(String(v)) ? '#FF9A9A' : '#B8F5C8' }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: '6px', opacity: 0.55 }}>append ?diag=0 to hide · ?ao=0 disables AO</div>
    </div>
  );
}

function flag(name, fallback) {
  try {
    const v = new URLSearchParams(window.location.search).get(name);
    return v === null ? fallback : v !== '0';
  } catch {
    return fallback;
  }
}

/**
 * Whether this device should get the interactive scene at all.
 *
 * The hero costs ~1.1 MB of JavaScript plus a 1.4 MB HDRI, then asks a phone GPU
 * to run 269 spheres with screen-space AO. On mobile that is slow to arrive and
 * slow to run, which is exactly the report we had. Nothing here is a nice-to-have
 * on a 4-inch screen, so phones get a still image and an explicit opt-in instead
 * — and because the canvas is lazily imported, declining means the chunk and the
 * HDRI are never requested at all.
 *
 * ?3d=1 forces it on for testing on a real device.
 */
function shouldRender3D() {
  try {
    if (new URLSearchParams(window.location.search).get('3d') === '1') return true;
    if (window.matchMedia('(max-width: 820px)').matches) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    // Honour the OS/browser data saver rather than spending someone's data cap.
    if (navigator.connection?.saveData) return false;
    const type = navigator.connection?.effectiveType;
    if (type === 'slow-2g' || type === '2g') return false;
    return true;
  } catch {
    return true;
  }
}

/**
 * Static stand-in for the 3D bed. Deliberately offers the real thing rather than
 * hiding it: someone on a tablet may well want to interact, and the opt-in is
 * one tap.
 */
function HeroPoster({ onEnable }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: BACKDROP }}>
      <img
        src={`${import.meta.env.BASE_URL}products/catalyst-bed-grading-media.jpg`}
        alt="Graded inert alumina ceramic ball media, from 3 mm through 75 mm"
        width={1600}
        height={900}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, color-mix(in srgb, var(--clay-900) 84%, transparent) 0%, color-mix(in srgb, var(--clay-900) 28%, transparent) 55%, color-mix(in srgb, var(--clay-900) 10%, transparent) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: '32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
          padding: '0 20px', textAlign: 'center'
        }}
      >
        <div style={{ color: 'var(--on-accent)', fontWeight: 800, fontSize: 'clamp(1.15rem, 4.5vw, 1.6rem)', lineHeight: 1.25, textShadow: '0 2px 14px rgba(0,0,0,0.5)' }}>
          Inert alumina ceramic balls &amp; catalyst bed support media
        </div>
        <button
          type="button"
          onClick={onEnable}
          style={{
            background: 'var(--brand-red)', color: 'var(--on-accent)', border: 'none',
            padding: '12px 22px', borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer', minHeight: '44px',
            boxShadow: '0 10px 26px -12px rgba(0,0,0,0.7)'
          }}
        >
          Load interactive 3D view
        </button>
        <span style={{ color: 'color-mix(in srgb, var(--on-accent) 74%, transparent)', fontSize: '0.72rem' }}>
          Around 2.5 MB — best on Wi-Fi
        </span>
      </div>
    </div>
  );
}

export default function FullWidth3DSliderHero() {
  const [ready3d, setReady3d] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [stats, setStats] = useState({});
  const [crashed, setCrashed] = useState(null);

  // Off by default now the hero is confirmed working. Kept rather than deleted:
  // it is what finally located the Suspense fault, and it costs nothing while
  // dormant. Add ?diag=1 to bring it back.
  const showDiag = React.useMemo(() => flag('diag', false), []);
  const [want3d, setWant3d] = useState(shouldRender3D);

  // Stable identity: the canvas reports through this from inside useEffect, so a
  // new function each render would re-fire those effects forever.
  const onStat = useCallback((key, value) => {
    setStats((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 9000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100vw',
        height: 'calc(100vh - 76px)',
        minHeight: '660px',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        background: 'var(--clay-900)'
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {want3d ? (
          <ErrorBoundary
            label="hero-3d"
            onError={(e) => setCrashed(e && e.message ? e.message : String(e))}
            fallback={<HeroPoster onEnable={() => window.location.reload()} />}
          >
            <Suspense fallback={<HeroBackdrop />}>
              <Physics3DHeroCanvas onReady={() => setReady3d(true)} onStat={onStat} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <HeroPoster onEnable={() => setWant3d(true)} />
        )}
      </div>

      {showDiag && want3d && (
        <DiagPanel
          stats={stats}
          note={
            crashed
              ? `scene threw: ${crashed}`
              : timedOut && !ready3d
                ? 'No frame painted within 9s.'
                : null
          }
        />
      )}
    </section>
  );
}
