import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Payment from './Pages/Payment/Payment';
import Sucsess from './Pages/AfterPayPages/Sucsess';
import NotFound from './Pages/AfterPayPages/NotFound';
import PaymentError from './Pages/AfterPayPages/PaymentError';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/Menu" element={<Products />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/CreateProd" element={<CreateProd />} />
            <Route path='/Sepet' element={<Basket />} />
            <Route path="/Admin/Login" element={<AdminLogin />} />
            <Route path="/Admin/Products" element={<AdminProducts />} />
            <Route path="/Admin/Manage" element={<AdminManage />} />
            <Route path="/Admin/Discounts" element={<AdminDiscounts />} />
            <Route path="/Admin/Notes" element={<AdminNotes />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/success" element={<Sucsess />} />
            <Route path="/payment/error" element={<PaymentError />} />
            <Route path="*" element={<NotFound />} />
            { /*
            <Route path="/Admin/Actions" element={<AdminActions />} />
            <Route path="/Galeri" element={<GaleriPage />} />
            */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
