import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import './PaymentPages.css';

const NotFound = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="payment-result-container">
      <Container>
        <div className="result-card">
          <div className="icon-container warning-icon-container">
            <FaExclamationTriangle className="result-icon text-warning" />
          </div>
          <h2 className="result-title text-center">Sayfa Bulunamadı</h2>
          <p className="result-message text-center">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Lütfen doğru URL'yi girdiğinizden emin olun veya aşağıdaki seçeneklerden birini kullanın.
          </p>
          <div className="action-buttons">
            <Link to="/">
              <button className="action-button primary-button">Ana Sayfaya Dön</button>
            </Link>
            <Link to="/contact">
              <button className="action-button secondary-button">Yardım Al</button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
