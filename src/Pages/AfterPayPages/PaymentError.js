import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './PaymentPages.css';

const PaymentError = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleRetry = () => {
    // Navigate back to checkout page
    navigate('/checkout');
  };

  return (
    <div className="payment-result-container">
      <Container>
        <div className="result-card">
          <div className="icon-container error-icon-container">
            <FaTimesCircle className="result-icon text-danger" />
          </div>
          <h2 className="result-title text-center">Ödeme İşleminde Hata</h2>
          <p className="result-message text-center">
            Ödeme işlemi sırasında bir sorun oluştu. Bu, geçici bir sorun olabilir veya 
            ödeme bilgilerinizle ilgili bir problem olabilir. Lütfen tekrar deneyin veya 
            farklı bir ödeme yöntemi kullanın.
          </p>
          <div className="action-buttons">
            <button className="action-button primary-button" onClick={handleRetry}>
              Tekrar Dene
            </button>
            <Link to="/contact">
              <button className="action-button secondary-button">Destek Al</button>
            </Link>
            <Link to="/cart">
              <button className="action-button tertiary-button">Sepete Dön</button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentError;
