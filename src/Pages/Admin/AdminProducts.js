import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState([]); // Initialize as array, not null
  const [imagePreview, setImagePreview] = useState([]); // Initialize as array, not string
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Tişört',
    tshirtType: 'duz'
  });

  // Initialize sizes as an array, not a string
  const [sizes, setSizes] = useState([{ size: 'S', stock: '0' }]);

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'Admin') {
      navigate('/');
      return;
    }
    
    setIsAuthenticated(true);
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/admin/products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Fetched products:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
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
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile([file]); // Set as array
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview([reader.result]); // Set as array
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple image file selection
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise(resolve => {
            reader.onloadend = () => resolve(reader.result);
        });
    });

    Promise.all(previews).then(previews => {
        setImageFile(files);
        setImagePreview(previews);
    });
};

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Tişört',
      tshirtType: 'duz'
    });
    setImageFile([]);
    setImagePreview([]);
    setSizes([{ size: 'S', stock: '0' }]);
    setEditingProduct(null);
  };

  // Open form for creating a new product
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing product
  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Tişört',
      tshirtType: product.tshirtType || 'duz'
    });
    
    // Set sizes correctly from tshirtSize
    setSizes(Array.isArray(product.tshirtSize) && product.tshirtSize.length > 0 
      ? product.tshirtSize.map(item => ({ 
          size: item.size || '',
          stock: item.stock || '0',
          _id: item._id // Preserve the _id for updates
        }))
      : [{ size: 'S', stock: '0' }]
    );
    
    setEditingProduct(product._id);
    
    // Handle images preview safely
    if (Array.isArray(product.images) && product.images.length > 0) {
      setImagePreview(product.images.map(img => img.imgUrl));
    } else if (product.imageUrl) {
      setImagePreview([product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `${process.env.REACT_APP_BACKEND_URL}${product.imageUrl}`]);
    } else {
      setImagePreview([]);
    }
    
    setShowForm(true);
  };

  // Cancel form submission and close form
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Handle adding a new size
  const handleAddSize = () => {
    setSizes(prevSizes => 
      Array.isArray(prevSizes) ? [...prevSizes, { size: '', stock: '0' }] : [{ size: '', stock: '0' }]
    );
  };

  // Handle removing a size
  const handleRemoveSize = (index) => {
    setSizes(prevSizes => {
      if (!Array.isArray(prevSizes)) return [{ size: 'S', stock: '0' }];
      const newSizes = [...prevSizes];
      newSizes.splice(index, 1);
      return newSizes.length > 0 ? newSizes : [{ size: 'S', stock: '0' }];
    });
  };

  // Handle size change
  const handleSizeChange = (index, field, value) => {
    setSizes(prevSizes => {
      if (!Array.isArray(prevSizes)) return [{ size: 'S', stock: '0' }];
      const newSizes = [...prevSizes];
      if (newSizes[index]) {
        newSizes[index] = {
          ...newSizes[index],
          [field]: value
        };
      }
      return newSizes;
    });
  };

  // Submit form to create or update a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized access.');

      const data = new FormData();
      data.append('name', sanitizeInput(formData.name || ''));
      data.append('description', sanitizeInput(formData.description || ''));
      data.append('price', sanitizeInput(formData.price || ''));
      data.append('category', sanitizeInput(formData.category || 'Tişört'));
      data.append('tshirtType', sanitizeInput(formData.tshirtType || 'duz'));
      
      // Add sizes and stock to the form data with safety checks
      if (Array.isArray(sizes)) {
        sizes.forEach((sizeItem, index) => {
          data.append('sizes[]', sanitizeInput(sizeItem.size || ''));
          data.append('stock[]', sanitizeInput(sizeItem.stock || '0'));
          if (sizeItem._id) {
            data.append('sizeIds[]', sizeItem._id);
          }
        });
      }
      
      // Handle imageFile safely
      if (Array.isArray(imageFile) && imageFile.length > 0) {
        imageFile.forEach(file => file && data.append('images', file));
      } else if (imageFile) {
        data.append('images', imageFile);
      }

      let response;
      if (editingProduct) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/payment/admin/products/${editingProduct}`,
          data,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/payment/admin/products`,
          data,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      showNotification(response.data.message || 'Success.');
      fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      showNotification(err.response?.data?.error || 'An error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Confirm product deletion
  const handleDeleteConfirm = (productId) => {
    setConfirmDelete(productId);
  };

  // Cancel product deletion
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Delete a product
  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/admin/products/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      showNotification('Ürün başarıyla silindi.');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(
        err.response?.data?.error || 'Ürün silinirken bir hata oluştu.',
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
        <Link to="/Admin/Products" className="nav-item active">Ürün Yönetimi</Link>
        <Link to="/Admin/Manage" className="nav-item">Sipariş Yönetimi</Link>
        <Link to="/Admin/Discounts" className="nav-item">İndirim Yönetimi</Link>
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
        <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Yeni Ürün Ekle
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
      
      {/* Product form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ürün Adı</label>
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
                <label className="block text-sm font-medium mb-1">Fiyat</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="Tişört">Tişört</option>
                  <option value="Hoodie">Hoodie</option>
                  <option value="Sweatshirt">Sweatshirt</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ürün Tipi</label>
                <select
                  name="tshirtType"
                  value={formData.tshirtType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="duz">Düz</option>
                  <option value="baskili">Baskılı</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Ürün Görselleri</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingProduct && (!imageFile || imageFile.length === 0) ? "Görseller değiştirmezseniz mevcut görseller kullanılacaktır." : ""}
                </p>
              </div>
              
              {/* Size and Stock Management */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Beden ve Stok Yönetimi</label>
                <div className="size-management">
                  {Array.isArray(sizes) && sizes.map((sizeItem, index) => (
                    <div key={index} className="size-item">
                      <div className="size-inputs">
                        <input
                          type="text"
                          placeholder="Beden (S, M, L, XL...)"
                          value={sizeItem.size}
                          onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                          className="size-input"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Stok"
                          value={sizeItem.stock}
                          onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                          className="stock-input"
                          min="0"
                          required
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(index)}
                        className="remove-size-btn"
                        disabled={sizes.length <= 1}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddSize}
                    className="add-size-btn"
                  >
                    <FaPlus className="mr-2" /> Beden Ekle
                  </button>
                </div>
              </div>
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
                    <FaCheck className="mr-2" /> {editingProduct ? 'Güncelle' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Products table */}
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Görsel</th>
                <th className="border px-4 py-2 text-left">Ürün Adı</th>
                <th className="border px-4 py-2 text-left">Kategori</th>
                <th className="border px-4 py-2 text-left">Tip</th>
                <th className="border px-4 py-2 text-left">Fiyat</th>
                <th className="border px-4 py-2 text-left">Bedenler</th>
                <th className="border px-4 py-2 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].imgUrl} 
                        alt={product.name || 'Ürün'} 
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <img 
                        src={product.imageUrl && product.imageUrl.startsWith('http') 
                            ? product.imageUrl 
                            : `${process.env.REACT_APP_BACKEND_URL}${product.imageUrl || ''}`
                        } 
                        alt={product.name || 'Ürün'} 
                        className="w-16 h-16 object-cover"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2">
                    {product.tshirtType === 'duz' ? 'Düz' : 'Baskılı'}
                  </td>
                  <td className="border px-4 py-2">{product.price} TL</td>
                  <td className="border px-4 py-2">
                    <div className="size-badges">
                      {Array.isArray(product.tshirtSize) && product.tshirtSize.length > 0 ? (
                        product.tshirtSize.map((sizeItem, index) => (
                          <span key={index} className="size-badge">
                            {sizeItem.size}: {sizeItem.stock}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Beden bilgisi yok</span>
                      )}
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    {confirmDelete === product._id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleDelete(product._id)}
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
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(product._id)}
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
      {!loading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Henüz hiç ürün eklenmemiş.</p>
          <button 
            onClick={handleAddNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            İlk Ürünü Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
