import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { ShoppingCart, ArrowLeft, Star, Tag, Package, FolderKanban } from 'lucide-react';

export default function ProductDetailPage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiClient.get(`/api/products/${productId}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product details:", err);
                setError('Ürün bilgileri yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        try {
            await apiClient.post('/api/cart/items', { productId: product.id, quantity: 1 });
            setNotification('Ürün başarıyla sepete eklendi!');
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            const errorMsg = err.response?.data?.error || 'Ürün sepete eklenemedi.';
            setNotification(errorMsg);
            setTimeout(() => setNotification(''), 3000);
        }
    };

    if (loading) return <div className="text-center p-10 font-semibold">Yükleniyor...</div>;
    if (error) return <div className="text-center p-10 text-red-500 bg-red-100">{error}</div>;
    if (!product) return <div className="text-center p-10">Ürün bulunamadı.</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold mb-6">
                <ArrowLeft size={20} />
                <span>Alışverişe Devam Et</span>
            </button>

            {notification && (
                <div className="fixed top-20 right-5 p-4 rounded-lg shadow-xl text-white bg-green-500 transition-opacity duration-300">
                    {notification}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                    <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} className="max-w-full h-auto object-contain rounded-lg"/>
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                    <div className="flex items-center space-x-2 mt-2 text-yellow-500">
                        {/* ... (Star rating aynı kalabilir) ... */}
                    </div>
                    <p className="text-gray-600 mt-4 text-lg">
                        {product.description || 'Bu ürün için henüz bir açıklama girilmemiştir.'}
                    </p>
                    <div className="my-6 space-y-3">
                        {/* Kategori Bilgisi - YENİ EKLENDİ */}
                        {product.category && (
                             <div className="flex items-center space-x-3 text-lg">
                                <FolderKanban size={20} className="text-purple-600"/>
                                <span className="font-semibold text-gray-700">Kategori:</span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">{product.category}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-3 text-lg">
                            <Tag size={20} className="text-purple-600"/>
                            <span className="font-semibold text-gray-700">Fiyat:</span>
                            <span className="text-3xl font-bold text-purple-700">{product.price.toFixed(2)} TL</span>
                        </div>
                        <div className="flex items-center space-x-3 text-lg">
                             <Package size={20} className="text-purple-600"/>
                            <span className="font-semibold text-gray-700">Stok Durumu:</span>
                            <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} Adet` : 'Tükendi'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full mt-4 flex items-center justify-center space-x-3 bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={22}/>
                        <span>Sepete Ekle</span>
                    </button>
                </div>
            </div>
        </div>
    );
}