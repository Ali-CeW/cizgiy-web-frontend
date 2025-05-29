import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentPages.css';

const Success = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="payment-result-container">
      <Container>
        <div className="result-card">
          <div className="icon-container success-icon-container">
            <FaCheckCircle className="result-icon text-success" />
          </div>
          <h2 className="result-title text-center">Ödemeniz Başarıyla Tamamlandı!</h2>
          <p className="result-message text-center">
            Siparişiniz için teşekkür ederiz. Ödemeniz başarıyla gerçekleştirildi ve siparişiniz işleme alındı.
            Sipariş detayları e-posta adresinize gönderilecektir.
          </p>
          <div className="action-buttons">
            <Link to="/account/orders">
              <button className="action-button secondary-button">Siparişlerim</button>
            </Link>
            <Link to="/">
              <button className="action-button primary-button">Ana Sayfaya Dön</button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Success;
