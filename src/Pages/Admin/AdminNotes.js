import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AdminNotes.css';

const AdminNotes = () => {
  // State management
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    NoteName: '',
    NoteContent: ''
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
      return;
    }
    
    setIsAuthenticated(true);
    fetchNotes();
  }, []);

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/admin-notes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Notlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      NoteName: '',
      NoteContent: ''
    });
    setEditingNote(null);
  };

  // Open form for creating a new note
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing note
  const handleEdit = (note) => {
    setFormData({
      NoteName: note.NoteName,
      NoteContent: note.NoteContent
    });
    setEditingNote(note._id);
    setShowForm(true);
  };

  // Cancel form submission and close form
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Submit form to create or update a note
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let response;
      
      if (editingNote) {
        // Update existing note
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/admin-note/${editingNote}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        showNotification('Not başarıyla güncellendi.');
      } else {
        // Create new note
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/admin-note`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        showNotification('Yeni not başarıyla eklendi.');
      }
      
      // Refresh note list
      fetchNotes();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error submitting note:', err);
      showNotification(
        err.response?.data?.message || 'Not kaydedilirken bir hata oluştu.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Confirm note deletion
  const handleDeleteConfirm = (noteId) => {
    setConfirmDelete(noteId);
  };

  // Cancel note deletion
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete a note
  const handleDelete = async (noteId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/admin-note/${noteId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      showNotification('Not başarıyla silindi.');
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      showNotification(
        err.response?.data?.message || 'Not silinirken bir hata oluştu.',
        'error'
      );
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
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
        <Link to="/Admin/Discounts" className="nav-item">İndirim Yönetimi</Link>
        <Link to="/Admin/Notes" className="nav-item active">Not Yönetimi</Link>
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
        <h1 className="text-2xl font-bold">Not Yönetimi</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Yeni Not Ekle
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
      
      {/* Note form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingNote ? 'Notu Düzenle' : 'Yeni Not Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Not Başlığı</label>
              <input
                type="text"
                name="NoteName"
                value={formData.NoteName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Not İçeriği</label>
              <textarea
                name="NoteContent"
                value={formData.NoteContent}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="5"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
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
                    <FaCheck className="mr-2" /> {editingNote ? 'Güncelle' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Notes table */}
      {!loading && notes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Başlık</th>
                <th className="border px-4 py-2 text-left">İçerik</th>
                <th className="border px-4 py-2 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{note.NoteName}</td>
                  <td className="border px-4 py-2">
                    <div className="note-content-preview">
                      {note.NoteContent}
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    {confirmDelete === note._id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleDelete(note._id)}
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
                          onClick={() => handleEdit(note)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(note._id)}
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
      {!loading && notes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Henüz hiç not eklenmemiş.</p>
          <button 
            onClick={handleAddNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            İlk Notu Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotes;
