import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userEmail: '',
        userAdSoyad: '',
        userAdres: '',
        userIl: '',
        userIlce: '',
        userTelefon: '',
        discountCode: ''
    });
    const [product, setProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [discount, setDiscount] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cart = params.get('cart');

        if (cart) {
            try {
                const parsedCart = JSON.parse(decodeURIComponent(cart));
                setCartItems(parsedCart);

                // Fetch product details for the first item in the cart
                if (parsedCart.length > 0) {
                    fetchProductDetails(parsedCart[0].productId);
                }
            } catch {
                setError('Invalid cart data');
            }
        } else {
            setError('Cart data is missing');
        }
    }, [location]);
    
    useEffect(() => {
        if (product) {
            calculateTotal();
        }
    }, [product, quantity, discount]);
    
    const fetchProductDetails = async (productId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payment/products`);
            const productData = response.data.find(p => p.uniqueId === productId);
            
            if (productData) {
                setProduct(productData);
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Error fetching product details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const calculateTotal = () => {
        if (!product) return 0;
        
        let price = product.price * quantity;
        
        if (discount && discount.discountType === 'percentage') {
            price = price * (1 - discount.discountAmount / 100);
        } else if (discount && discount.discountType === 'fixed') {
            price = price - discount.discountAmount;
        }
        
        setTotalPrice(price);
        return price;
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleDiscountCode = async () => {
        if (!formData.discountCode) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/payment/DiscountQuery/${formData.discountCode}` // Confirmed endpoint
            );
            setDiscount(response.data);
        } catch (err) {
            setError('Invalid discount code');
            console.error(err);
            setDiscount(null);
        } finally {
            setLoading(false);
        }
    };
    
    const validateStep1 = () => {
        const { userEmail, userAdSoyad, userAdres, userIl, userIlce, userTelefon } = formData;
        if (!userEmail || !userAdSoyad || !userAdres || !userIl || !userIlce || !userTelefon) {
            setError('Please fill all required fields');
            return false;
        }
        if (!userEmail.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        setError('');
        return true;
    };
    
    const handleNextStep = () => {
        if (step === 1) {
            if (validateStep1()) {
                setStep(2);
            }
        } else if (step === 2) {
            setStep(3);
            initiatePayment();
        }
    };
    
    const handlePreviousStep = () => {
        setStep(step - 1);
    };
    
    const initiatePayment = async () => {
        if (!cartItems || cartItems.length === 0) return;

        try {
            setLoading(true);

            const paymentData = {
                cartItems: cartItems.map(item => ({
                    id: item.productId,
                    quantity: item.quantity
                })),
                userEmail: formData.userEmail,
                userAdSoyad: formData.userAdSoyad,
                userAdres: formData.userAdres,
                userIl: formData.userIl,
                userIlce: formData.userIlce,
                userTelefon: formData.userTelefon,
                discountCode: discount ? formData.discountCode : null
            };

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/initiate`, paymentData);

            if (response.data.status === 'success') {
                document.getElementById('paytr-iframe-container').innerHTML = response.data.iframeContent;
            } else {
                setError(response.data.message || 'Payment initialization failed');
            }
        } catch (err) {
            setError('Error initializing payment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const renderStep1 = () => (
        <div className="payment-step">
            <h2>Step 1: Customer Information</h2>
            <div className="form-group">
                <label>Email</label>
                <input 
                    type="email" 
                    name="userEmail" 
                    value={formData.userEmail} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Name Surname</label>
                <input 
                    type="text" 
                    name="userAdSoyad" 
                    value={formData.userAdSoyad} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <textarea 
                    name="userAdres" 
                    value={formData.userAdres} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>City</label>
                    <input 
                        type="text" 
                        name="userIl" 
                        value={formData.userIl} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>District</label>
                    <input 
                        type="text" 
                        name="userIlce" 
                        value={formData.userIlce} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input 
                    type="tel" 
                    name="userTelefon" 
                    value={formData.userTelefon} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <button className="btn-next" onClick={handleNextStep}>Next</button>
        </div>
    );
    
    const renderStep2 = () => (
        <div className="payment-step">
            <h2>Step 2: Order Review</h2>
            {product && (
                <div className="order-summary">
                    <div className="product-details">
                        <img src={product.imageUrl} alt={product.name} />
                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Type: {product.tshirtType}</p>
                            <div className="quantity-control">
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <p>Price: ₺{product.price} x {quantity} = ₺{product.price * quantity}</p>
                        </div>
                    </div>
                    <div className="discount-section">
                        <input 
                            type="text" 
                            name="discountCode" 
                            placeholder="Discount Code" 
                            value={formData.discountCode} 
                            onChange={handleInputChange} 
                        />
                        <button onClick={handleDiscountCode}>Apply</button>
                    </div>
                    {discount && (
                        <div className="discount-applied">
                            <p>Discount Applied: {discount.name}</p>
                            <p>
                                {discount.discountType === 'percentage' 
                                    ? `${discount.discountAmount}% off` 
                                    : `₺${discount.discountAmount} off`}
                            </p>
                        </div>
                    )}
                    <div className="order-total">
                        <h3>Total: ₺{totalPrice.toFixed(2)}</h3>
                    </div>
                </div>
            )}
            <div className="navigation-buttons">
                <button className="btn-back" onClick={handlePreviousStep}>Back</button>
                <button className="btn-next" onClick={handleNextStep}>Proceed to Payment</button>
            </div>
        </div>
    );
    
    const renderStep3 = () => (
        <div className="payment-step">
            <h2>Step 3: Payment</h2>
            <div id="paytr-iframe-container" className="paytr-iframe"></div>
            <div className="navigation-buttons">
                <button className="btn-back" onClick={handlePreviousStep}>Back</button>
            </div>
        </div>
    );
    
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    
    return (
        <div className="payment-container">
            <div className="payment-steps-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>Customer Info</div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>Review Order</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>Payment</div>
            </div>
            
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    );
};

export default Payment;
