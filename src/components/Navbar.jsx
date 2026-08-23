import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Phone, Search, Calculator, Menu, X, ArrowUpRight, ChevronDown, Layers, Sparkles } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import { categories } from '../data/products';

export default function Navbar({ openCalculator, openRfqModal, searchQuery, setSearchQuery }) {
  // The URL is the single source of truth for which nav item is current; the
  // old activeSection state could disagree with the page you were actually on.
  const { pathname } = useLocation();
  const activeSection = pathname === '/' ? 'home' : pathname.split('/')[1];
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', to: '/' },
    { id: 'products', label: 'Products', to: '/products', hasDropdown: true },
    { id: 'industries', label: 'Industries', to: '/industries' },
    { id: 'calculator', label: 'Spec Calculator', to: '/calculator' },
    { id: 'about', label: 'About Us', to: '/about' },
    { id: 'contact', label: 'Contact Us', to: '/contact' }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setProductsDropdown(false);
  };

  return (
    <>
      {/* Top Industrial Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, var(--clay-600) 0%, var(--clay-500) 50%, var(--clay-700) 100%)',
        color: 'var(--surface-card)',
        fontSize: '0.8rem',
        fontWeight: '600',
        padding: '7px 0',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div className="container-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--sand-400)' }} />
              ISO 9001:2015 Quality Certified Manufacturer
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: 0.95 }}>
              📍 Namakkal & Erode, Tamil Nadu, India
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.78rem' }}>
            <a href={`tel:${companyInfo.mobile.replace(/\s+/g, '')}`} style={{ color: 'var(--surface-card)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={13} /> {companyInfo.mobile}
            </a>
            <button 
              onClick={() => openRfqModal()}
              style={{
                background: 'var(--surface-card)',
                color: 'var(--clay-500)',
                border: 'none',
                padding: '3px 12px',
                borderRadius: '12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              Get Quick RFQ
            </button>
          </div>
        </div>
      </div>

      {/* Main Clean Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--surface-card)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: scrolled ? '0 4px 20px rgba(1, 20, 49, 0.05)' : 'none',
        transition: 'var(--transition-fast)'
      }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
          
          {/* Logo & Emblem */}
          <Link
            to="/"
            onClick={handleNavClick}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}
          >
            {/* Brand mark, cropped from the Platinaa Ceramics logo */}
            <img
              src={`${import.meta.env.BASE_URL}logo-mark.png`}
              alt="Platinaa Ceramics"
              width={44}
              height={44}
              style={{ width: '44px', height: '44px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
            />

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.32rem', letterSpacing: '0.01em', lineHeight: 1.1, color: 'var(--text-bright)', whiteSpace: 'nowrap' }}>
              Platinaa Ceramics
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }} className="desktop-nav">
            {navLinks.map((link) => (
              <div key={link.id} style={{ position: 'relative' }} onMouseLeave={() => setProductsDropdown(false)}>
                <Link
                  to={link.to}
                  onClick={handleNavClick}
                  onMouseEnter={() => link.hasDropdown && setProductsDropdown(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'none',
                    color: activeSection === link.id ? 'var(--primary-red)' : 'var(--clay-700)',
                    fontWeight: activeSection === link.id ? 700 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 2px',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} style={{ opacity: 0.7 }} />}
                </Link>

                {/* Products Megamenu Dropdown */}
                {link.hasDropdown && productsDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-20px',
                    width: '280px',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    boxShadow: '0 20px 40px rgba(1, 20, 49, 0.12)',
                    zIndex: 110
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '6px 12px', letterSpacing: '0.05em' }}>
                      Categories Range
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
                        onClick={() => setProductsDropdown(false)}
                        style={{
                          textDecoration: 'none',
                          padding: '9px 12px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.86rem',
                          color: 'var(--text-bright)',
                          transition: 'var(--transition-fast)'
                        }}
                        className="dropdown-item-hover"
                      >
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary-red)', background: 'var(--primary-red-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {cat.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Search Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  background: searchOpen ? 'var(--primary-red-light)' : 'var(--bg-surface-1)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-bright)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Search size={18} />
              </button>

              {searchOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '52px',
                  width: '260px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  boxShadow: '0 12px 28px rgba(1, 20, 49, 0.12)'
                }}>
                  <input
                    type="text"
                    placeholder="Search products (e.g. 99% alumina, bed support)..."
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      const lowerValue = value.toLowerCase();
                      if (lowerValue.includes('refinery') || lowerValue.includes('catalyst') || lowerValue.includes('tower packing')) {
                        window.open('https://platinaaceramics.in', '_blank');
                        setSearchQuery('');
                        setSearchOpen(false);
                      }
                    }}
                    autoFocus
                    style={{
                      width: '100%',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-bright)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Spec Calculator CTA */}
            <button
              onClick={openCalculator}
              className="btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.85rem', gap: '6px' }}
            >
              <Calculator size={16} style={{ color: 'var(--primary-red)' }} />
              Calculator
            </button>

            {/* Request Quote Primary CTA */}
            <button
              onClick={() => openRfqModal()}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.86rem' }}
            >
              Request Quote <ArrowUpRight size={16} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-bright)',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--surface-card)',
            borderBottom: '1px solid var(--border-light)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                onClick={handleNavClick}
                style={{
                  background: 'none',
                  border: 'none',
                  textDecoration: 'none',
                  color: 'var(--text-bright)',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '10px 0',
                  borderBottom: '1px solid var(--bg-surface-1)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
