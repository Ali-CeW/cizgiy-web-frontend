import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-info">
            <motion.div 
              className="footer-logo"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="footer-logo-text">Çizgiy</span>
              <span className="footer-logo-dot">.</span>
            </motion.div>
            <p className="footer-description">
              Çizgiy, tasarım dünyasında çizgilerin ötesine geçerek, yaratıcılığı ve estetiği birleştiren öncü bir firmadır. Grafik tasarımdan web tasarımına, endüstriyel tasarımdan modaya kadar geniş bir yelpazede hizmet vermekteyiz.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Tasarım Bulvarı No:42, İstanbul</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+90 212 555 6789</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>info@cizgiy.com</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Hızlı Bağlantılar</h3>
              <ul>
                <li><Link to="/">Ana Sayfa</Link></li>
                <li><Link to="/Menu">Ürünler</Link></li>
                <li><Link to="/Galeri">Galeri</Link></li>
                <li><Link to="/iletisim">İletişim</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h3>Hizmetlerimiz</h3>
              <ul>
                <li><Link to="/services/graphic-design">Grafik Tasarım</Link></li>
                <li><Link to="/services/web-design">Web Tasarım</Link></li>
                <li><Link to="/services/branding">Marka Kimliği</Link></li>
                <li><Link to="/services/packaging">Ambalaj Tasarımı</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h3>Destek</h3>
              <ul>
                <li><Link to="/faq">Sıkça Sorulan Sorular</Link></li>
                <li><Link to="/shipping">Kargo Bilgileri</Link></li>
                <li><Link to="/returns">İade Politikası</Link></li>
                <li><Link to="/privacy">Gizlilik Politikası</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="social-icons">
            <motion.a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#4267B2' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#1DA1F2' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#E1306C' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#0077B5' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FaLinkedin />
            </motion.a>
          </div>
          <div className="newsletter">
            <h3>Bültenimize Abone Olun</h3>
            <div className="newsletter-form">
              <input type="email" placeholder="E-posta adresiniz" />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Abone Ol
              </motion.button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} Çizgiy. Tüm hakları saklıdır.
          </div>
          <motion.div 
            className="developer-credit"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span>Dev By Alice</span> <FaHeart className="heart-icon" />
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
