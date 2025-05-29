import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AdminManage.css';

const AdminManage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdated, setStatusUpdated] = useState(false);

  // Fetch all orders
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== 'Admin') {
      navigate('/');
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/payment/kiyafetstatement`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from server');
        }
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Reset status updated flag
    if (statusUpdated) {
      setStatusUpdated(false);
    }
  }, [statusUpdated]);

  // Handle order approval
  const handleApprove = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized access.');

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}/approve`,
        { urunonay: true },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setStatusUpdated(true);
      alert('Order approved!');
    } catch (err) {
      console.error('Error approving order:', err);
      alert('An error occurred while approving the order.');
    }
  };

  // Handle order rejection
  const handleReject = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/reject`, { urunonay: false });
      setStatusUpdated(true);
      alert('Sipariş reddedildi!');
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('Sipariş reddedilirken bir hata oluştu.');
    }
  };

  // Format products for display
  const formatProducts = (products) => {
    return products.map(product => (
      `${product.isim} (${product.adet} adet)`
    )).join(', ');
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      {/* Admin Navigation */}
      <div className="admin-nav mb-6">
        <Link to="/Admin/Products" className="nav-item">Ürün Yönetimi</Link>
        <Link to="/Admin/Manage" className="nav-item active">Sipariş Yönetimi</Link>
        <Link to="/Admin/Discounts" className="nav-item">İndirim Yönetimi</Link>
        <Link to="/Admin/Notes" className="nav-item">Not Yönetimi</Link>
        <Link to="/Admin/Login" className="nav-item logout">Çıkış Yap</Link>
      </div>
      
      <h1>Sipariş Yönetimi</h1>
      
      <div className="order-stats">
        <div className="stat-card">
          <h3>Toplam Sipariş</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Onaylanan Siparişler</h3>
          <p>{orders.filter(order => order.urunonay).length}</p>
        </div>
        <div className="stat-card">
          <h3>Bekleyen Siparişler</h3>
          <p>{orders.filter(order => !order.urunonay).length}</p>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Email</th>
              <th>Adres</th>
              <th>İl/İlçe</th>
              <th>Ürünler</th>
              <th>Fiyat</th>
              <th>Kategori</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-orders">Sipariş bulunmamaktadır.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className={order.urunonay ? "approved" : "pending"}>
                  <td>{order.UserAdSoyad}</td>
                  <td>{order.UserEmail}</td>
                  <td>{order.UserAdres}</td>
                  <td>{order.Useril}/{order.Userilce}</td>
                  <td>{formatProducts(order.urunler)}</td>
                  <td>{order.price} TL</td>
                  <td>{order.kategori}</td>
                  <td>
                    <span className={`status-badge ${order.urunonay ? "status-approved" : "status-pending"}`}>
                      {order.urunonay ? "Onaylandı" : "Beklemede"}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {!order.urunonay ? (
                      <>
                        <button 
                          className="approve-btn" 
                          onClick={() => handleApprove(order._id)}
                        >
                          Onayla
                        </button>
                        <button 
                          className="reject-btn" 
                          onClick={() => handleReject(order._id)}
                        >
                          Reddet
                        </button>
                      </>
                    ) : (
                      <button 
                        className="reject-btn" 
                        onClick={() => handleReject(order._id)}
                      >
                        İptal Et
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManage;
