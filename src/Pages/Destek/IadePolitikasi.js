import React from 'react';
import './Destek.css';

const IadePolitikasi = () => {
  return (
    <div className="support-page">
      <div className="support-container">
        <h1>İade Politikası</h1>
        
        <div className="support-content">
          <section className="support-section">
            <h2>İade ve Değişim Koşulları</h2>
            <p>Ürünlerimizden memnun kalmamanız durumunda, satın aldığınız ürünleri teslim tarihinden 
            itibaren 14 gün içerisinde iade edebilirsiniz.</p>
            
            <h3>İade Süreci</h3>
            <p>İade etmek istediğiniz ürünü, orijinal ambalajında ve kullanılmamış durumda, faturası ile 
            birlikte iade etmeniz gerekmektedir. İade talebinizi info@cizgiy.com adresine e-posta göndererek 
            veya müşteri hizmetleri numaramızı arayarak iletebilirsiniz.</p>
            
            <h3>İade Edilemeyecek Ürünler</h3>
            <p>Kişiye özel tasarlanmış ürünler, dijital ürünler ve indirimli olarak satın alınan ürünler 
            iade kapsamı dışındadır.</p>
            
            <h3>Geri Ödeme</h3>
            <p>İade edilen ürünün tarafımıza ulaşmasını takiben, ödeme yapılan karta veya banka hesabınıza 
            ücret iadesi yapılacaktır. Geri ödeme işlemi, bankanızın işlem süresine bağlı olarak 3-7 iş günü 
            içerisinde gerçekleştirilecektir.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IadePolitikasi;
