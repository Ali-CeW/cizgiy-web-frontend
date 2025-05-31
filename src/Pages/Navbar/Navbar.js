import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Initialize with cart items from localStorage
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart).length : 0;
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart items when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cart = localStorage.getItem('cart');
        setCartItems(cart ? JSON.parse(cart).length : 0);
      } catch {
        setCartItems(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Navigate to basket page
  const goToBasket = (e) => {
    e.preventDefault();
    navigate('/Sepet');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="logo">
            <img src={`${process.env.PUBLIC_URL}/images/Cizgiy.png`} alt="Çizgiy Logo" className="logo-image" />
          </Link>
          <div className="tagline">Çizginin Ötesinde Tasarım</div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <motion.div 
            className="nav-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            <NavLink to="/" label="Ana Sayfa" />
            <NavLink to="/Menu" label="Ürünler" />
            <NavLink to="/iletisim" label="İletişim" />
          </motion.div>

          <div className="nav-actions">
            <motion.div 
              className="search-box"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Ara..." />
            </motion.div>
            
            <motion.div 
              className="cart-icon-container"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToBasket}
            >
              <FaShoppingCart className="cart-icon" />
              {cartItems > 0 && (
                <motion.span 
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  {cartItems}
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-links">
              <Link to="/" className="mobile-link">Ana Sayfa</Link>
              <Link to="/Menu" className="mobile-link">Ürünler</Link>
              <Link to="/Galeri" className="mobile-link">Galeri</Link>
              <Link to="/iletisim" className="mobile-link">İletişim</Link>
              
              <div className="mobile-search">
                <input type="text" placeholder="Ara..." />
                <FaSearch className="mobile-search-icon" />
              </div>
              
              <div className="mobile-cart" onClick={goToBasket}>
                <FaShoppingCart /> 
                <span>Sepet ({cartItems})</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper component for animated nav links
const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
        {label}
        {isActive && (
          <motion.div 
            className="active-indicator" 
            layoutId="activeIndicator"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default Navbar;
