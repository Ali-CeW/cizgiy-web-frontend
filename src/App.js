import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './Pages/Navbar/Navbar';
import Footer from './Pages/Footer/Footer';
import Products from './Pages/Products/Products';
import ContactPage from './Pages/Contact/iletisim';
import CreateProd from './Pages/Products/CreateProd';
import Basket from './Pages/Basket/Basket';
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminManage from './Pages/Admin/AdminManage';
import AdminDiscounts from './Pages/Admin/AdminDiscounts';
import AdminNotes from './Pages/Admin/AdminNotes';
import AdminActions from './Pages/Admin/AdminActions';
import Payment from './Pages/Payment/Payment';
import Sucsess from './Pages/AfterPayPages/Sucsess';
import PaymentError from './Pages/AfterPayPages/PaymentError';
import NotFound from './Pages/AfterPayPages/NotFound';

// Main pages
import Galeri from './Pages/Galeri/Galeri';
import Faq from './Pages/Faq/Faq';

// Hizmetler pages
import GrafikTasarim from './Pages/Hizmetler/GrafikTasarim';
import WebTasarim from './Pages/Hizmetler/WebTasarim';
import MarkaKimligi from './Pages/Hizmetler/MarkaKimligi';
import AmbalajTasarimi from './Pages/Hizmetler/AmbalajTasarimi';

// Destek pages
import KargoBilgileri from './Pages/Destek/KargoBilgileri';
import IadePolitikasi from './Pages/Destek/IadePolitikasi';
import GizlilikPolitikasi from './Pages/Destek/GizlilikPolitikasi';

import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Çizgiy - Tasarım Dünyası</title>
          <meta name="description" content="Çizgiy ile tasarım dünyasında çizginin ötesine geçin. Ürünlerimizle yaratıcılığı keşfedin." />
          <meta property="og:image" content="/Cizgiy.png" />
          <meta name="twitter:image" content="/Cizgiy.png" />
        </Helmet>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/Menu" element={<Products />} />
            <Route path="/Galeri" element={<Galeri />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/CreateProd" element={<CreateProd />} />
            <Route path="/Sepet" element={<Basket />} />
            <Route path="/Admin/Login" element={<AdminLogin />} />
            <Route path="/Admin/Products" element={<AdminProducts />} />
            <Route path="/Admin/Manage" element={<AdminManage />} />
            <Route path="/Admin/Discounts" element={<AdminDiscounts />} />
            <Route path="/Admin/Notes" element={<AdminNotes />} />
            <Route path="/Admin/Actions" element={<AdminActions />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/success" element={<Sucsess />} />
            <Route path="/payment/error" element={<PaymentError />} />
            
            {/* Hizmetler routes */}
            <Route path="/hizmetler/grafik-tasarim" element={<GrafikTasarim />} />
            <Route path="/hizmetler/web-tasarim" element={<WebTasarim />} />
            <Route path="/hizmetler/marka-kimligi" element={<MarkaKimligi />} />
            <Route path="/hizmetler/ambalaj-tasarimi" element={<AmbalajTasarimi />} />
            
            {/* Destek routes */}
            <Route path="/destek/kargo-bilgileri" element={<KargoBilgileri />} />
            <Route path="/destek/iade-politikasi" element={<IadePolitikasi />} />
            <Route path="/destek/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
