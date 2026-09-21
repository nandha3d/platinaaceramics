import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import { Search, Layers, ArrowUpRight, SlidersHorizontal, Eye, Scale } from 'lucide-react';

export default function ProductsSection({ onSelectProduct, searchQuery, setSearchQuery, compareList, toggleCompare, openRfqForProduct, limit, heading }) {
  // The category lives in the URL so a filtered view is shareable and the
  // navbar dropdown can deep-link straight into it.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const setActiveCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setSearchParams(next, { replace: true });
  };
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query) ||
        p.density.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'density-high') {
        const dA = parseFloat(a.density.replace(/[^0-9.]/g, '')) || 0;
        const dB = parseFloat(b.density.replace(/[^0-9.]/g, '')) || 0;
        return dB - dA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <section id="products" style={{ padding: '80px 0', background: 'var(--surface-card)', position: 'relative', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-custom">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge-red" style={{ marginBottom: '12px' }}>
            <Layers size={14} /> COMPLETE PRODUCT RANGE
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '16px' }}>
            Inert Ceramic Media & Bed Support Catalogue
          </h2>
          <p style={{ color: 'var(--text-body)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
            Inert alumina ceramic balls from 17% to 99% Al₂O₃, graded catalyst bed support media, ceramic tower packing, adsorbents and guard beds — all to HG/T 3683.1-2014.
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 14px color-mix(in srgb, var(--clay-800) 3%, transparent)'
        }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: activeCategory === cat.id ? 'var(--primary-red)' : 'var(--surface-card)',
                  color: activeCategory === cat.id ? 'var(--surface-card)' : 'var(--text-muted)',
                  border: activeCategory === cat.id ? '1px solid var(--primary-red)' : '1px solid var(--border-light)',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat.id ? '0 4px 12px color-mix(in srgb, var(--clay-600) 20%, transparent)' : '0 2px 6px color-mix(in srgb, var(--clay-800) 3%, transparent)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat.name}
              </button>
            ))}
            <button
                onClick={() => window.open('https://platinaaceramics.in', '_blank')}
                style={{
                  background: 'linear-gradient(90deg, var(--clay-600) 0%, var(--clay-500) 100%)',
                  color: 'var(--surface-card)',
                  border: '1px solid var(--primary-red)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px color-mix(in srgb, var(--clay-600) 30%, transparent)',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Refinery Media <ArrowUpRight size={14} />
              </button>
          </div>

          {/* Search & Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                placeholder="Filter by grade / density..."
                aria-label="Filter products by grade or density"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-bright)',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="sort-products-select" className="sr-only">Sort products catalogue</label>
              <SlidersHorizontal size={14} style={{ color: 'var(--text-subtle)' }} aria-hidden="true" />
              <select
                id="sort-products-select"
                value={sortBy}
                aria-label="Sort products catalogue"
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-bright)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Sort: Featured First</option>
                <option value="density-high">Sort: Highest Density</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Products Grid Display */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)' }}>
            No products match "{searchQuery}". Try selecting "All Products".
          </div>
        ) : (
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '26px'
          }}>
            {(limit ? filteredProducts.slice(0, limit) : filteredProducts).map((product) => {
              const isCompared = compareList.some((c) => c.id === product.id);

              return (
                <article key={product.id} className="product-card">
                  <div className="pc-media zoom-wrap">
                    <img
                      src={`${import.meta.env.BASE_URL}${product.image}`}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="600"
                    />
                    <span className="pc-chip pc-chip--code">{product.materialType}</span>
                  </div>

                  <div className="pc-body">
                    {/* Both clamped to two lines so every card in a row keeps the
                        same height regardless of copy length. */}
                    <h3 className="pc-title">
                      <Link
                        to={`/products/${product.id}`}
                        onClick={(e) => {
                          // Plain click opens the quick modal; modified clicks and
                          // middle-click fall through so the link still works as a
                          // link (new tab, copy address, crawlers).
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          onSelectProduct(product);
                        }}
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="pc-desc">{product.shortDesc}</p>

                    {/* One hue per property type so the three pills are told
                        apart at a glance, rather than three identical chips. */}
                    <div className="pc-pills">
                      <span className="pc-pill pc-pill--grade">{product.grade}</span>
                      <span className="pc-pill pc-pill--density">{product.density}</span>
                      {product.acidResistance && (
                        <span className="pc-pill pc-pill--acid">Acid {product.acidResistance}</span>
                      )}
                    </div>
                  </div>

                  <div className="pc-actions">
                    <button className="pc-btn pc-btn--primary" onClick={() => onSelectProduct(product)}>
                      <Eye size={15} /> Technical Datasheet
                    </button>
                    <button
                      className={`pc-btn pc-btn--ghost${isCompared ? ' is-on' : ''}`}
                      onClick={() => toggleCompare(product)}
                      aria-pressed={isCompared}
                    >
                      <Scale size={15} /> {isCompared ? 'Added' : 'Add to Compare'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
