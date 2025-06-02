import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Çizgiy neler yapıyor?",
      answer: "Çizgiy, grafik tasarım, web tasarım, marka kimliği ve ambalaj tasarımı gibi geniş bir yelpazede hizmet vermektedir."
    },
    {
      question: "Bir proje için fiyat teklifi nasıl alabilirim?",
      answer: "İletişim sayfamızdaki formu doldurarak veya doğrudan cizgiy@gmail.com adresine email göndererek proje detaylarınızı iletebilirsiniz. Size özel fiyat teklifimizi en kısa sürede iletiriz."
    },
    {
      question: "Projemi tamamlamak ne kadar sürer?",
      answer: "Proje tamamlama süresi, projenin kapsamına ve karmaşıklığına bağlı olarak değişir. Basit projeler bir hafta içinde tamamlanabilirken, daha kapsamlı projeler birkaç hafta sürebilir."
    },
    {
      question: "Revizyon hakkım var mı?",
      answer: "Evet, tüm projelerimizde belirli sayıda ücretsiz revizyon hakkı sunuyoruz. Revizyon sayısı, projenin türüne ve büyüklüğüne göre değişiklik gösterebilir."
    }
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1>Sıkça Sorulan Sorular</h1>
        
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                {item.question}
                <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
