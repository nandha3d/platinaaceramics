import React, { useState, useEffect, Suspense, lazy } from 'react';
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
 * Shown when the 3D canvas actually fails. Deliberately loud: an identical dark
 * panel to the loading state made a broken canvas impossible to tell apart from
 * a working one, which cost a lot of debugging time.
 */
function HeroFailed({ note }) {
  const [why, setWhy] = React.useState('checking…');

  React.useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) {
        setWhy('This browser reports no WebGL context at all.');
        return;
      }
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'hidden';
      setWhy(`WebGL is available (renderer: ${renderer}) — the 3D scene threw. See the console.`);
    } catch (e) {
      setWhy(`WebGL probe failed: ${e && e.message}`);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: BACKDROP, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          right: '24px',
          bottom: '76px',
          maxWidth: '420px',
          padding: '14px 16px',
          borderRadius: '4px',
          background: 'rgba(144,1,0,0.14)',
          border: '1px solid rgba(144,1,0,0.45)',
          color: 'var(--sand-200)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          lineHeight: 1.6
        }}
      >
        <strong style={{ display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>
          3D SCENE UNAVAILABLE
        </strong>
        {note ? note + ' ' : ''}{why}
      </div>
    </div>
  );
}

export default function FullWidth3DSliderHero() {
  const [ready3d, setReady3d] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // If the canvas never paints a frame it would just sit dark and silent, which
  // is indistinguishable from a working scene. Surface it instead.
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
      {/* Full-width 3D physics canvas — untouched, loaded lazily */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ErrorBoundary label="hero-3d" fallback={<HeroFailed note="The scene threw." />}>
          <Suspense fallback={<HeroBackdrop />}>
            <Physics3DHeroCanvas onReady={() => setReady3d(true)} />
          </Suspense>
        </ErrorBoundary>
        {timedOut && !ready3d && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <HeroFailed note="No frame was painted within 9s." />
          </div>
        )}
      </div>

      {/* Nothing is layered over the canvas: the hero is the 3D bed alone.
          The only overlay left is the failure panel, which appears solely when
          no frame has painted after 9 seconds. */}

    </section>
  );
}
