import React, { useState, useEffect } from 'react';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Basket.css';

const Basket = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const needsMinimumQuantity = (item) => {
    return item.type.includes('Baskılı') && item.quantity < 5;
  };

  const handleCheckout = () => {
    const invalidItems = cartItems.filter(item => needsMinimumQuantity(item));

    if (invalidItems.length > 0) {
      alert('Baskılı ürünlerde minimum 5 adet sipariş vermelisiniz.');
      return;
    }

    const encodedCartItems = encodeURIComponent(JSON.stringify(cartItems));
    navigate(`/payment?cart=${encodedCartItems}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Sepetim</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <FaShoppingCart className="mx-auto text-gray-300 text-6xl mb-4" />
          <p className="text-xl text-gray-500">Sepetiniz şu anda boş.</p>
        </div>
      ) : (
        <div className="lg:flex lg:space-x-8">
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-40 object-cover rounded" 
                    />
                  </div>
                  <div className="md:w-3/4 md:pl-4">
                    <div className="flex justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">{item.type}</p>
                    <div className="flex items-center mb-4">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        <FaMinus className="text-gray-600" />
                      </button>
                      <span className="mx-3 text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>
                    {needsMinimumQuantity(item) && (
                      <p className="text-red-500 text-sm">
                        Baskılı ürünlerde minimum 5 adet sipariş verilebilir.
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} TL
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Sepet Özeti</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Toplam Ürün:</span>
                <span>{totalItems} adet</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Ara Toplam:</span>
                <span className="font-semibold">{subtotal.toFixed(2)} TL</span>
              </div>
              <button 
                className="bg-blue-600 text-white w-full py-3 rounded font-semibold hover:bg-blue-700 transition"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;
