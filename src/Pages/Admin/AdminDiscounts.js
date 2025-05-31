import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNotes.css'; // Reuse the same CSS

const AdminDiscounts = () => {
  const navigate = useNavigate();
  
  // State management
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountRate: '',
    startDate: '',
    endDate: '',
    discountType: '' // Added discountType field
  });

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== 'Admin') {
      setError('Admin yetkilerine sahip değilsiniz. Lütfen giriş yapın.');
      setLoading(false);
      navigate('/');
      return;
    }
    
    setIsAuthenticated(true);
    fetchDiscounts();
  }, []);

  // Fetch discounts from API
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/discaunt`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setDiscounts(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('İndirimler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  // Show notification message
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: sanitizeInput(value)
    });
    // Reset discountRate if discountType changes
    if (name === 'discountType') {
      setFormData((prev) => ({ ...prev, discountRate: '' }));
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountRate: '',
      startDate: '',
      endDate: '',
      discountType: '' // Reset discountType field
    });
    setEditingDiscount(null);
  };

  // Open form for creating a new discount
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing discount
  const handleEdit = (discount) => {
    // Format dates for the form
    const startDate = discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '';
    const endDate = discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '';

    setFormData({
      name: discount.name,
      description: discount.description,
      discountRate: discount.discountRate,
      startDate: startDate,
      endDate: endDate,
      discountType: discount.discountType || '' // Populate discountType field
    });
    setEditingDiscount(discount._id);
    setShowForm(true);
  };

  // Cancel form submission and close form
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Submit form to create or update a discount
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized access.');

      const sanitizedData = {
        name: sanitizeInput(formData.name),
        description: sanitizeInput(formData.description),
        discountRate: sanitizeInput(formData.discountRate),
        startDate: sanitizeInput(formData.startDate),
        endDate: sanitizeInput(formData.endDate),
        discountType: sanitizeInput(formData.discountType) // Include discountType in submission
      };

      let response;
      if (editingDiscount) {
        // Update existing discount
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/discaunt/${editingDiscount}`,
          sanitizedData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        showNotification('İndirim başarıyla güncellendi.');
      } else {
        // Create new discount
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/discaunt`,
          sanitizedData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        showNotification('Yeni indirim başarıyla eklendi.');
      }
      
      // Refresh discount list
      fetchDiscounts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      showNotification(err.response?.data?.message || 'An error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Confirm discount deletion
  const handleDeleteConfirm = (discountId) => {
    setConfirmDelete(discountId);
  };

  // Cancel discount deletion
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete a discount
  const handleDelete = async (discountId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/discaunt/${discountId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      showNotification('İndirim başarıyla silindi.');
      fetchDiscounts();
    } catch (err) {
      console.error('Error deleting discount:', err);
      showNotification(
        err.response?.data?.message || 'İndirim silinirken bir hata oluştu.',
        'error'
      );
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <p>{error}</p>
          <p className="mt-2">
            <a href="/Admin/Login" className="text-blue-600 underline">Admin Girişi</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Navigation */}
      <div className="admin-nav mb-6">
        <div className="flex justify-center mb-6">
          <img src={`${process.env.PUBLIC_URL}/images/Cizgiy.png`} alt="Çizgiy Logo" className="admin-logo" style={{ maxWidth: '150px', height: 'auto' }} />
        </div>
        <Link to="/Admin/Products" className="nav-item">Ürün Yönetimi</Link>
        <Link to="/Admin/Manage" className="nav-item">Sipariş Yönetimi</Link>
        <Link to="/Admin/Discounts" className="nav-item active">İndirim Yönetimi</Link>
        <Link to="/Admin/Notes" className="nav-item">Not Yönetimi</Link>
        <Link to="/Admin/Login" className="nav-item logout">Çıkış Yap</Link>
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">İndirim Yönetimi</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Yeni İndirim Ekle
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && !showForm && (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      )}
      
      {/* Discount form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingDiscount ? 'İndirimi Düzenle' : 'Yeni İndirim Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Discount Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Adı</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Türü</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="percentage">Yüzde</option>
                  <option value="fixed">Sabit</option>
                </select>
              </div>
            </div>

            {/* Discount Rate */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.discountType === 'percentage' ? 'İndirim Oranı (%)' : 'İndirim Tutarı'}
              </label>
              <input
                type={formData.discountType === 'percentage' ? 'number' : 'text'}
                name="discountRate"
                value={formData.discountRate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min={formData.discountType === 'percentage' ? '1' : undefined}
                max={formData.discountType === 'percentage' ? '100' : undefined}
                disabled={!formData.discountType} // Disable if no discount type is selected
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bitiş Tarihi</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> İşleniyor...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> {editingDiscount ? 'Güncelle' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Discounts table */}
      {!loading && discounts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">İndirim Adı</th>
                <th className="border px-4 py-2 text-left">Açıklama</th>
                <th className="border px-4 py-2 text-center">İndirim Türü</th>
                <th className="border px-4 py-2 text-center">{formData.discountType === 'percentage' ? 'İndirim Oranı (%)' : 'İndirim Tutarı'}</th>
                <th className="border px-4 py-2 text-center">Başlangıç</th>
                <th className="border px-4 py-2 text-center">Bitiş</th>
                <th className="border px-4 py-2 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{discount.name}</td>
                  <td className="border px-4 py-2">{discount.description}</td>
                  <td className="border px-4 py-2">{discount.discountType === 'percentage' ? 'Yüzde' : 'Düz'}</td>
                  <td className="border px-4 py-2 text-center">{discount.discountRate}</td>
                  <td className="border px-4 py-2 text-center">{formatDate(discount.startDate)}</td>
                  <td className="border px-4 py-2 text-center">{formatDate(discount.endDate)}</td>
                  <td className="border px-4 py-2">
                    {confirmDelete === discount._id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Silmeyi Onayla"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleDeleteCancel}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                          title="İptal"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(discount)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(discount._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && discounts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Henüz hiç indirim eklenmemiş.</p>
          <button 
            onClick={handleAddNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            İlk İndirimi Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;
