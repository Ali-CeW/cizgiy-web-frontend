import React from 'react';
import './Destek.css';

const KargoBilgileri = () => {
  return (
    <div className="support-page">
      <div className="support-container">
        <h1>Kargo Bilgileri</h1>
        
        <div className="support-content">
          <section className="support-section">
            <h2>Kargo ve Teslimat</h2>
            <p>Siparişleriniz, ödeme onayından sonra 1-3 iş günü içerisinde kargoya verilmektedir. 
            Kargo takip numarası, ürünleriniz kargoya verildikten sonra size e-posta yoluyla iletilecektir.</p>
            
            <h3>Kargo Ücreti</h3>
            <p>100 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 100 TL altındaki siparişlerde 
            kargo ücreti 20 TL'dir.</p>
            
            <h3>Teslimat Süresi</h3>
            <p>Ürünleriniz genellikle kargoya verildikten sonra 1-3 iş günü içerisinde teslim edilmektedir. 
            Ancak bu süre, adresinizin bulunduğu bölgeye göre değişiklik gösterebilir.</p>
            
            <h3>İşbirliği Yaptığımız Kargo Firmaları</h3>
            <p>Şu anda Aras Kargo ve Yurtiçi Kargo ile çalışmaktayız.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default KargoBilgileri;
