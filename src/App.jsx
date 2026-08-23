import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import CompareDrawer from './components/CompareDrawer';
import ProductDetailModal from './components/ProductDetailModal';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import IndustriesPage from './pages/IndustriesPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

/** Every navigation lands at the top; without this React Router keeps the
 *  previous scroll offset and a new page appears to open half way down. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rfqProduct, setRfqProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [compareNotice, setCompareNotice] = useState('');

  const toggleCompare = useCallback((product) => {
    setCompareList((list) => {
      if (list.some((p) => p.id === product.id)) {
        return list.filter((p) => p.id !== product.id);
      }
      if (list.length >= 3) {
        // A blocking alert() interrupts the whole page for a soft limit.
        setCompareNotice('You can compare up to three grades at a time.');
        return list;
      }
      return [...list, product];
    });
  }, []);

  useEffect(() => {
    if (!compareNotice) return undefined;
    const t = setTimeout(() => setCompareNotice(''), 3200);
    return () => clearTimeout(t);
  }, [compareNotice]);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const openRfqModal = useCallback((productDetails = null) => {
    setRfqProduct(productDetails);
    setSelectedProduct(null);
    navigate('/contact');
  }, [navigate]);

  const openCalculator = useCallback(() => navigate('/calculator'), [navigate]);

  const productProps = {
    onSelectProduct: setSelectedProduct,
    searchQuery,
    setSearchQuery,
    compareList,
    toggleCompare,
    openRfqForProduct: openRfqModal
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-bright)' }}>
      <ScrollToTop />

      <Navbar
        openCalculator={openCalculator}
        openRfqModal={openRfqModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage {...productProps} openRfqModal={openRfqModal} />} />
          <Route path="/products" element={<ProductsPage {...productProps} />} />
          <Route path="/products/:productId" element={<ProductPage openRfqModal={openRfqModal} toggleCompare={toggleCompare} compareList={compareList} />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/calculator" element={<CalculatorPage openRfqModal={openRfqModal} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/contact"
            element={<ContactPage rfqProduct={rfqProduct} onCloseRfq={() => setRfqProduct(null)} />}
          />
          {/* Legacy single-page anchors people may have bookmarked. */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <CompareDrawer
        compareList={compareList}
        toggleCompare={toggleCompare}
        clearCompare={clearCompare}
        openRfqModal={openRfqModal}
      />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          openRfqModal={openRfqModal}
        />
      )}

      {compareNotice && (
        <div role="status" className="toast">{compareNotice}</div>
      )}

      <Footer openCalculator={openCalculator} openRfqModal={openRfqModal} />

      {/* TEMPORARY: palette picker for client sign-off. See ThemeSwitcher.jsx. */}
      <ThemeSwitcher />
    </div>
  );
}
