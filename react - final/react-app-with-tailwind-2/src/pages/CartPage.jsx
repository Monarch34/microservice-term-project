import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    
    // Modal'ın durumunu kontrol etmek için state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const fetchCartAndProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const cartResponse = await apiClient.get('/api/cart');
            const cartData = cartResponse.data;

            if (cartData && cartData.items && cartData.items.length > 0) {
                const productIds = cartData.items.map(item => item.productId);
                const productDetails = {};
                for (const id of productIds) {
                    const productResponse = await apiClient.get(`/api/products/${id}`);
                    productDetails[id] = productResponse.data;
                }
                setProducts(productDetails);
            }
            setCart(cartData);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setCart({ items: [] });
            } else {
                console.error("Failed to fetch cart:", err);
                setError('Sepet bilgileri yüklenirken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartAndProducts();
    }, [fetchCartAndProducts]);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        // Miktar 1'den küçükse ürünü kaldır.
        if (newQuantity < 1) {
            handleRemoveItem(productId);
            return;
        }
        try {
            await apiClient.put(`/api/cart/items/${productId}`, { quantity: newQuantity });
            fetchCartAndProducts();
        } catch (err) {
            console.error('Failed to update quantity', err);
            setError('Miktar güncellenemedi.');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await apiClient.delete(`/api/cart/items/${productId}`);
            fetchCartAndProducts();
        } catch (err) {
            console.error('Failed to remove item', err);
            setError('Ürün sepetten kaldırılamadı.');
        }
    };

    const handleProceedToPayment = () => {
        if (!shippingAddress.trim()) {
            setError('Lütfen bir teslimat adresi girin.');
            setTimeout(() => setError(''), 3000); // Hata mesajını 3 sn sonra kaldır
            return;
        }
        navigate('/checkout/payment', { 
            state: { 
                shippingAddress: shippingAddress,
                totalPrice: totalPrice 
            }
        });
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const cartItems = cart?.items || [];
    const totalPrice = cartItems.reduce((total, item) => {
        const product = products[item.productId];
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    if (loading) return <div className="text-center p-10 font-semibold">Sepet Yükleniyor...</div>;
    if (error) return <div className="text-center p-10 text-red-500 bg-red-100">{error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <SuccessModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Siparişiniz Alındı!"
                message="Siparişiniz başarıyla oluşturuldu. Detayları 'Siparişlerim' sayfasından takip edebilirsiniz."
                buttonText="Alışverişe Devam Et"
            />

            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Alışveriş Sepetim</h1>
            {cartItems.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">Sepetinizde ürün bulunmuyor.</h2>
                    <p className="text-gray-500 mt-2">Hemen alışverişe başlayın!</p>
                    <Link to="/" className="mt-6 inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        <ArrowLeft className="inline-block mr-2" size={20}/>
                        Alışverişe Dön
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        {cartItems.map(item => {
                            const product = products[item.productId];
                            if (!product) return <div key={item.productId} className="py-4 font-semibold text-center">Ürün bilgisi yükleniyor...</div>;
                            
                            // Stok kontrolü için bir boolean değişkeni
                            const isStockLimitReached = item.quantity >= product.stock;

                            return (
                                <div key={item.productId} className="flex flex-col sm:flex-row items-center justify-between border-b py-4 last:border-none">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <img src={product.imageUrl || 'https://via.placeholder.com/80'} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                                        <div>
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <p className="text-gray-600">{product.price.toFixed(2)} TL</p>
                                            <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border rounded-md">
                                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
                                            <span className="px-4 font-semibold">{item.quantity}</span>
                                            {/* STOK KONTROLÜ İLE GÜNCELLENEN BUTON */}
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} 
                                                disabled={isStockLimitReached} // Stok limitine ulaşınca disable et
                                                className="p-2 hover:bg-gray-100 rounded-r-md disabled:bg-gray-200 disabled:cursor-not-allowed"
                                                title={isStockLimitReached ? "Maksimum stok adedine ulaşıldı" : "Adedi Arttır"}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <p className="font-bold w-24 text-right">{(item.quantity * product.price).toFixed(2)} TL</p>
                                        <button onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
                        <h2 className="text-2xl font-bold border-b pb-4 mb-4">Sipariş Özeti</h2>
                        <div className="flex justify-between mb-2"><span className="text-gray-600">Ara Toplam</span><span className="font-semibold">{totalPrice.toFixed(2)} TL</span></div>
                        <div className="flex justify-between mb-4"><span className="text-gray-600">Kargo</span><span className="font-semibold text-green-600">Ücretsiz</span></div>
                        <div className="flex justify-between font-extrabold text-xl border-t pt-4 mb-4"><span>Toplam</span><span>{totalPrice.toFixed(2)} TL</span></div>
                        <div className="mt-4">
                            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">Teslimat Adresi</label>
                            <textarea
                                id="shippingAddress"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Lütfen tam teslimat adresinizi girin..."
                                className="w-full border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                                rows="3"
                            ></textarea>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            disabled={!shippingAddress.trim()}
                            className="w-full mt-4 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                           Ödemeye Geç
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}