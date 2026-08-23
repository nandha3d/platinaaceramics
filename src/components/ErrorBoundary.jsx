import React from 'react';

/**
 * Catches render/runtime errors so one failing subtree cannot blank the page.
 *
 * Wrap the whole app (shows a readable error card) or an individual widget such
 * as a 3D canvas (pass `fallback` to degrade quietly instead).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the detail in the console even when a quiet fallback is rendered.
    console.error(`[ErrorBoundary${this.props.label ? ` · ${this.props.label}` : ''}]`, error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    // Quiet degrade — used for the 3D canvases.
    if (this.props.fallback !== undefined) return this.props.fallback;

    // Visible card — used at the app root so failures are diagnosable.
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          background: 'var(--bg-main, var(--bg-main))',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            background: 'var(--surface-card)',
            border: '1px solid rgba(1,20,49,0.14)',
            borderRadius: '6px',
            padding: '32px'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--accent-rust)',
              marginBottom: '14px'
            }}
          >
            Application error
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              color: 'var(--text-bright)',
              marginBottom: '12px',
              lineHeight: 1.15
            }}
          >
            Something threw while rendering
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
            The page stopped instead of going blank. The message below says what failed.
          </p>

          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: 1.6,
              color: 'var(--text-bright)',
              background: 'var(--bg-surface-1)',
              border: '1px solid rgba(1,20,49,0.1)',
              borderRadius: '4px',
              padding: '16px',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0
            }}
          >
            {String(error && (error.stack || error.message || error))}
          </pre>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '22px',
              background: 'var(--text-bright)',
              color: 'var(--bg-surface-1)',
              border: '1px solid var(--text-bright)',
              borderRadius: '4px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
