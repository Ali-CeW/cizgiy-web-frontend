import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './iletisim.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Simulate form submission success
    setFormStatus('success');
    setTimeout(() => {
      setFormStatus(null);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-title"
          >
            İletişime Geçin
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="contact-slogan"
          >
            <span className="highlight">Çizginin ötesinde</span> bir dünya yaratıyoruz.
          </motion.p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-wrapper">
            <motion.div 
              className="mission-box"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Misyonumuz</h2>
              <p>
                Çizgiy olarak misyonumuz, sanatın ve tasarımın gücünü kullanarak markaların hikayelerini 
                görselleştirmek ve bu hikayeleri hedef kitlelerine en etkileyici şekilde anlatmaktır. 
                Her çizgimizde tutku, yaratıcılık ve özgünlüğü bir araya getirerek, müşterilerimizin 
                vizyonlarını gerçeğe dönüştürüyoruz.
              </p>
              <div className="slogan-tag">
                "Her çizgide bir hikaye, her tasarımda bir vizyon."
              </div>
            </motion.div>

            <motion.div 
              className="vision-box"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Vizyonumuz</h2>
              <p>
                Tasarım dünyasında çığır açan yenilikçi yaklaşımlarla sektörün öncüsü olmak ve 
                global ölçekte tanınan bir tasarım stüdyosu haline gelmektir. Müşterilerimizin 
                markalarını sadece görselleştirmekle kalmayıp, onları kültürel birer fenomene 
                dönüştürmek için çalışıyoruz.
              </p>
              <div className="slogan-tag">
                "Sınırları aşan tasarım, çizgiyi yeniden tanımlıyoruz."
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Bize Ulaşın</h2>
              <p className="contact-intro">
                Projeleriniz veya sorularınız için bizimle iletişime geçin. Yaratıcı ekibimiz 
                size en kısa sürede yanıt verecektir.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <h3>Adres</h3>
                    <p>Tasarım Bulvarı No:42, Levent</p>
                    <p>İstanbul, Türkiye</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <h3>Telefon</h3>
                    <p>+90 212 555 6789</p>
                    <p>+90 533 123 4567</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <h3>E-posta</h3>
                    <p>info@cizgiy.com</p>
                    <p>destek@cizgiy.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaClock className="contact-icon" />
                  <div>
                    <h3>Çalışma Saatleri</h3>
                    <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p>Cumartesi: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
              
              <div className="social-media">
                <h3>Sosyal Medya</h3>
                <div className="social-icons">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Mesaj Gönder</h2>
              
              {formStatus === 'success' && (
                <div className="form-success-message">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <FaPaperPlane />
                    <p>Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
                  </motion.div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={formStatus === 'success' ? 'hidden' : ''}>
                <div className="form-group">
                  <label htmlFor="name">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-posta Adresiniz</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Konu</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mesajınız</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    required
                  ></textarea>
                </div>
                
                <motion.button 
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gönder
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <motion.div 
            className="map-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.49490231267!2d28.97361287475371!3d41.06073705484423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f6f8f8d65%3A0xd9e097ea0d423145!2sLevent%2C%20Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1661086437071!5m2!1str!2str" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Çizgiy Location"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* Creative Slogan Banner */}
      <motion.section 
        className="slogan-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h2>Hayallerinizi Çiziyoruz, Vizyonunuzu Renklendiriyoruz</h2>
          <p>Çizginin ötesinde, tasarımın merkezinde...</p>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;
