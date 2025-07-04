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
  const [selectedSize, setSelectedSize] = useState(''); // Add state for selected size
  const [customImage, setCustomImage] = useState(null);
  const [customImagePreview, setCustomImagePreview] = useState(null);
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
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
          _id: product.uniqueId,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          imageUrl: product.images.length > 0 ? product.images.sort((a, b) => a.imgNumber - b.imgNumber)[0]?.imgUrl : '', // Use the first image based on imgNumber
          category: product.category || 'Unknown',
          tshirtType: product.tshirtType || 'duz',
          images: product.images.sort((a, b) => a.imgNumber - b.imgNumber), // Sort images by imgNumber
          tshirtSize: product.tshirtSize || [] // Add this line to include size data
        }));
        
        console.log("Products with sizes:", formattedProducts); // Add this for debugging
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
    
    // Set default selected size if available
    if (product.tshirtSize && Array.isArray(product.tshirtSize) && product.tshirtSize.length > 0) {
      // Find first size that has stock
      const availableSize = product.tshirtSize.find(size => parseInt(size.stock) > 0);
      setSelectedSize(availableSize ? availableSize.size : '');
    } else {
      setSelectedSize('');
    }
    
    setOrderPanelOpen(true);
  };

  // Add a helper function to get available stock for selected size
  const getAvailableStock = () => {
    if (!selectedProduct || !selectedSize) return 0;
    const sizeInfo = selectedProduct.tshirtSize?.find(item => item.size === selectedSize);
    return sizeInfo ? parseInt(sizeInfo.stock) : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    // Ensure minimum quantity for printed t-shirts
    if (selectedProduct?.tshirtType === 'baskili' && newQuantity < 5) {
      newQuantity = 5;
    }
    
    // Prevent negative quantities
    if (newQuantity < 1) newQuantity = 1;
    
    // Check available stock for selected size
    const availableStock = getAvailableStock();
    
    // Limit quantity to available stock
    if (availableStock > 0 && newQuantity > availableStock) {
      showNotification(`En fazla ${availableStock} adet ekleyebilirsiniz (stok sınırı)`, 'warning');
      newQuantity = availableStock;
    }
    
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

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Check if a size is in stock
  const isSizeInStock = (sizeItem) => {
    return parseInt(sizeItem.stock) > 0;
  };

  // Add to cart function
  const addToCart = () => {
    if (!selectedProduct) return;
    
    // Validate size selection
    if (selectedProduct.tshirtSize && Array.isArray(selectedProduct.tshirtSize) && 
        selectedProduct.tshirtSize.length > 0 && !selectedSize) {
      showNotification('Lütfen bir beden seçiniz', 'error');
      return;
    }

    // Validate minimum quantity for printed products
    if (selectedProduct.tshirtType === 'baskili' && quantity < 5) {
      showNotification('Baskılı ürünlerde minimum sipariş adedi 5\'tir', 'error');
      return;
    }
    
    // Check available stock for selected size
    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      showNotification(`Seçilen beden (${selectedSize}) için yeterli stok yok. Maksimum ${availableStock} adet ekleyebilirsiniz`, 'error');
      return;
    }

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
      size: selectedSize,
      availableStock: getAvailableStock(),
      price: parseFloat(sanitizedProduct.price),
      quantity: quantity,
      image: sanitizedProduct.imageUrl || (sanitizedProduct.images && sanitizedProduct.images.length > 0 ? sanitizedProduct.images[0].imgUrl : ''),
      customImage: customImagePreview,
      totalPrice: parseFloat(sanitizedProduct.price) * quantity,
    };
    
    
    setCart(prevCart => [...prevCart, cartItem]);
    setAddedToCart(true);
    setOrderPanelOpen(false);
    showNotification('Ürün sepete eklendi!');
    
    // Reset selections
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize('');
    setCustomImage(null);
    setCustomImagePreview(null);
  };
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // SEO alternate languages for this page
  const alternateLanguages = [
    { hrefLang: 'tr', href: '/Menu' },
    { hrefLang: 'en', href: '/en/products' }
  ];

  // Handle image click to open lightbox
  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

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
                        src={product.images[0]?.imgUrl || product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="product-card-overlay">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-lg font-bold">₺{product.price}</p>
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
                            {product.tshirtType === 'duz' ? 'Düz' : 'Baskılı'}
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold mb-4">₺{product.price}</p>
                      <button
                        onClick={() => handleOrderClick(product)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300"
                      >
                        Detaylar ve Sipariş
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">Hiç ürün bulunamadı. Farklı bir arama veya filtre deneyin.</p>
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
                  <div className="image-carousel">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="carousel-item" onClick={() => openLightbox(image.imgUrl)}>
                        <img
                          src={image.imgUrl}
                          alt={`Resim ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-details">
                    <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    
                    {/* Size selector - Update this section to show stock numbers */}
                    {selectedProduct.tshirtSize && Array.isArray(selectedProduct.tshirtSize) && selectedProduct.tshirtSize.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-medium mb-2">Beden:</p>
                        <div className="size-selector">
                          {selectedProduct.tshirtSize.map((sizeItem, index) => (
                            <button
                              key={index}
                              className={`size-option ${selectedSize === sizeItem.size ? 'selected' : ''} ${!isSizeInStock(sizeItem) ? 'out-of-stock' : ''}`}
                              onClick={() => isSizeInStock(sizeItem) && handleSizeSelect(sizeItem.size)}
                              disabled={!isSizeInStock(sizeItem)}
                              title={!isSizeInStock(sizeItem) ? 'Stokta yok' : `${sizeItem.size} - Stok: var`} 
                            >
                              <span className="size-label">{sizeItem.size}</span>
                              <span className="stock-indicator">
                                {isSizeInStock(sizeItem) ? (
                                  <span className="stock-count">Var</span>
                                ) : (
                                  <span className="out-of-stock-indicator">×</span>
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        {/* Display selected size stock information */}
                        {selectedSize && (
                          <div className="selected-size-info">
                            <p className="text-sm mt-2">
                              <span className="font-medium">Seçilen Beden: </span> 
                              {selectedSize} - Stok: 
                              <span className="stock-number">
                                {(() => {
                                  const stock = selectedProduct.tshirtSize.find(item => item.size === selectedSize)?.stock || 0;
                                  if (stock > 3) {
                                    return 'Var';
                                  } else if (stock > 0) {
                                    return 'Son Stoklar';
                                  } else {
                                    return 'Yok';
                                  }
                                })()}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <p className="text-sm font-medium mb-2">Adet:</p>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 h-10 w-10 rounded-l-lg flex items-center justify-center"
                          disabled={quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min={selectedProduct.tshirtType === 'baskili' ? 5 : 1}
                          max={getAvailableStock() || 99}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          className="h-10 w-16 border-t border-b text-center"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className={`bg-gray-200 hover:bg-gray-300 text-gray-800 h-10 w-10 rounded-r-lg flex items-center justify-center ${
                            quantity >= getAvailableStock() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={quantity >= getAvailableStock()}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      {selectedProduct.tshirtType === 'baskili' && (
                        <p className="text-xs text-red-500 mt-1">* Baskılı tişörtlerimizde sipariş sayısı minimum 5'tir</p>
                      )}
                      {selectedSize && (
                        <p className="text-xs text-blue-500 mt-1">* Bu beden için maksimum {getAvailableStock()} adet ekleyebilirsiniz fazlası için iletişime geçin !</p>
                      )}
                    </div>
                    
                    {/* Price calculation */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tekli fiyat:</span>
                        <span>₺{selectedProduct.price}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Adet:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Toplam:</span>
                        <span>₺{calculateTotal()}</span>
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div 
              className="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div 
                className="lightbox-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="lightbox-close"
                  onClick={closeLightbox}
                >
                  <FaTimes />
                </button>
                <img src={lightboxImage} alt="Ürün Görseli" className="lightbox-image" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Products;
