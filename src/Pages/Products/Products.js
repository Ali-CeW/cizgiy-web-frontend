import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaShoppingCart, FaPlus, FaMinus, FaUpload, FaCheck } from 'react-icons/fa';
import SeoMetaTags from '../../Components/SEO/SeoMetaTags';
import './Products.css';

const Products = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customImage, setCustomImage] = useState(null);
  const [customImagePreview, setCustomImagePreview] = useState(null);
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // This will trigger the Navbar to update its cart count
    window.dispatchEvent(new Event('storage'));
  }, [cart]);

  // Custom notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payment/products`);
        
        // Map the backend data to match our expected format
        const formattedProducts = response.data.map(product => ({
          _id: product._id || product.uniqueId,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          imageUrl: product.imageUrl ,
          category: product.category ,
          tshirtType: product.tshirtType
        }));
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ürünler gelirken bir sorunla karşılaştık.');
        setLoading(false);

        // Remove fallback to test products
        showNotification('Could not connect to server.', 'error');
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  // Handle order button click
  const handleOrderClick = (product) => {
    if (!product || typeof product !== 'object') return;
    setSelectedProduct(product);
    setQuantity(product.tshirtType === 'baskili' ? 5 : 1);
    setCustomImage(null);
    setCustomImagePreview(null);
    setOrderPanelOpen(true);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    // Ensure minimum quantity for printed t-shirts
    if (selectedProduct?.tshirtType === 'baskili' && newQuantity < 5) {
      newQuantity = 5;
    }
    
    // Prevent negative quantities
    if (newQuantity < 1) newQuantity = 1;
    
    setQuantity(newQuantity);
  };

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(file);
        setCustomImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return (parseFloat(selectedProduct.price) * quantity).toFixed(2);
  };

  // Add to cart function
  const addToCart = () => {
    if (!selectedProduct) return;

    const sanitizedProduct = {
        ...selectedProduct,
        name: sanitizeInput(selectedProduct.name),
        type: sanitizeInput(selectedProduct.type),
    };

    const cartItem = {
        id: `${sanitizedProduct._id}_${Date.now()}`,
        productId: sanitizedProduct._id,
        name: sanitizedProduct.name,
        type: sanitizedProduct.category,
        productType: sanitizedProduct.tshirtType,
        price: parseFloat(sanitizedProduct.price),
        quantity: quantity,
        image: sanitizedProduct.imageUrl,
        customImage: customImagePreview,
        totalPrice: parseFloat(sanitizedProduct.price) * quantity,
    };

    setCart(prevCart => [...prevCart, cartItem]);
    showNotification('Ürün sepete eklendi!');
    setTimeout(() => {
        setOrderPanelOpen(false);
    }, 1500);
  };
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // SEO alternate languages for this page
  const alternateLanguages = [
    { hrefLang: 'tr', href: '/Menu' },
    { hrefLang: 'en', href: '/en/products' }
  ];

  return (
    <>
      <SeoMetaTags 
        title="Çizgiy Ürünleri - Özel Tasarım T-shirt ve Giyim Koleksiyonu"
        description="Çizgiy'in özgün ve yaratıcı tasarım ürünleri. Türkiye'nin en kaliteli baskılı t-shirt, hoodie ve sweatshirt modellerini keşfedin."
        keywords="Çizgiy ürünler, tasarım tişört, özel baskı, hoodie, sweatshirt, Türk tasarım, moda, giyim, tişört modelleri"
        canonicalUrl="/Menu"
        alternateLanguages={alternateLanguages}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Custom notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
                notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cart indicator */}
        <div className="fixed top-4 right-4 z-10">
          <a href="/basket" className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </a>
        </div>
        
        {/* Header and filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Ürünlerimiz</h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <FaTimes 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
            
            {/* Category filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    categoryFilter === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-card-inner">
                    {/* Front side */}
                    <div className="product-card-front">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="product-card-overlay">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-lg font-bold">${product.price}</p>
                      </div>
                    </div>
                    
                    {/* Back side */}
                    <div className="product-card-back">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm mb-3">{product.description}</p>
                      <div className="mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {product.category}
                        </span>
                        {product.tshirtType && (
                          <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.tshirtType === 'duz' ? 'Plain' : 'Printed'}
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold mb-4">${product.price}</p>
                      <button
                        onClick={() => handleOrderClick(product)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300"
                      >
                        Sipariş Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No products found. Try a different search or filter.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Order panel */}
        <AnimatePresence>
          {orderPanelOpen && selectedProduct && (
            <motion.div
              className="order-panel-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderPanelOpen(false)}
            >
              <motion.div
                className="order-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="order-panel-header">
                  <h2 className="text-xl font-bold">Siparişin</h2>
                  <button
                    onClick={() => setOrderPanelOpen(false)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="order-panel-content">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product preview */}
                    <div className="flex-1">
                      <div className="product-preview">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-auto" />
                        
                        {/* Custom image overlay for t-shirts */}
                        {selectedProduct.category.toLowerCase().includes('shirt') && customImagePreview && (
                          <div className="custom-image-overlay">
                            <img src={customImagePreview} alt="Custom design" />
                          </div>
                        )}
                      </div>
                      
                      {/* Custom image upload for t-shirts */}
                      {selectedProduct.category.toLowerCase().includes('shirt') && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Resminle özelleştir:</p>
                          <div className="flex items-center">
                            <button
                              onClick={() => fileInputRef.current.click()}
                              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mr-3 cursor-not-allowed"
                              disabled={true}
                            >
                              <FaUpload className="mr-2" /> Henüz aktif değil
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            {customImagePreview && (
                              <button
                                onClick={() => {
                                  setCustomImage(null);
                                  setCustomImagePreview(null);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Order details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
                      <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                      
                      {/* Quantity selector */}
                      <div className="mb-6">
                        <p className="text-sm font-medium mb-2">Adet:</p>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-10 w-10 rounded-l-lg flex items-center justify-center"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            min={selectedProduct.tshirtType === 'baskili' ? 5 : 1}
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="h-10 w-16 border-t border-b text-center"
                          />
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-10 w-10 rounded-r-lg flex items-center justify-center"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        {selectedProduct.tshirtType === 'baskili' && (
                          <p className="text-xs text-red-500 mt-1">* Baskılı tişörtlerimizde sipariş sayısı minimum 5 tir</p>
                        )}
                      </div>
                      
                      {/* Price calculation */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Tekli fiyat:</span>
                          <span>${selectedProduct.price}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Adet:</span>
                          <span>{quantity}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Toplam:</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                      
                      {/* Order button */}
                      <button 
                        onClick={addToCart}
                        className={`w-full py-3 rounded-lg transition-colors duration-300 flex items-center justify-center
                          ${addedToCart ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        disabled={addedToCart}
                      >
                        {addedToCart ? (
                          <>
                            <FaCheck className="mr-2" /> Sepete Eklendi
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="mr-2" /> Sepete Ekle
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Products;
