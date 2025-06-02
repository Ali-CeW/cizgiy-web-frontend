import React from 'react';
import './Destek.css';

const GizlilikPolitikasi = () => {
  return (
    <div className="support-page">
      <div className="support-container">
        <h1>Gizlilik Politikası</h1>
        
        <div className="support-content">
          <section className="support-section">
            <h2>Kişisel Verilerin Korunması</h2>
            <p>Çizgiy olarak, kişisel verilerinizin güvenliğine önem veriyoruz. Kişisel verileriniz, 
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında korunmaktadır.</p>
            
            <h3>Toplanan Veriler</h3>
            <p>Web sitemizi ziyaret ettiğinizde veya alışveriş yaptığınızda adınız, soyadınız, e-posta 
            adresiniz, telefon numaranız, teslimat ve fatura adresiniz gibi kişisel bilgilerinizi topluyoruz.</p>
            
            <h3>Verilerin Kullanımı</h3>
            <p>Topladığımız kişisel verileri, siparişlerinizi işleme koymak, hesabınızı yönetmek, size 
            daha iyi hizmet sunmak ve yasal yükümlülüklerimizi yerine getirmek için kullanıyoruz.</p>
            
            <h3>Veri Güvenliği</h3>
            <p>Kişisel verilerinizin güvenliğini sağlamak için teknik ve idari önlemler alıyoruz. 
            Verileriniz, yetkisiz erişime, değiştirilmeye veya ifşa edilmeye karşı korunmaktadır.</p>
            
            <h3>Çerezler</h3>
            <p>Web sitemizde çerezler kullanıyoruz. Çerezler, web sitemizi nasıl kullandığınızı anlamamıza 
            ve size daha iyi bir deneyim sunmamıza yardımcı oluyor.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GizlilikPolitikasi;
