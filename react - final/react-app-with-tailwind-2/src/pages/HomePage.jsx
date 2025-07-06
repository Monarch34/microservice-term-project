import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => (
    <div className="bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
        <Link to={`/products/${product.id}`} className="block">
            {/* Ürün Görseli Alanı - YENİ EKLENDİ */}
            <div className="h-48 overflow-hidden">
                <img
                    // Eğer imageUrl varsa onu kullan, yoksa varsayılan bir görsel göster
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Urun+Resmi'}
                    alt={product.name}
                    // w-full: kartın genişliğini kapla
                    // h-full: belirlenen yüksekliği (h-48) kapla
                    // object-cover: en-boy oranını koruyarak alanı doldur, gerekirse kırp
                    // transition-transform: üzerine gelince yumuşak bir büyüme efekti için
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            
            {/* Ürün Bilgileri Alanı */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-purple-700 transition-colors" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Stok: {product.stock > 0 ? product.stock : 'Tükendi'}
                </p>
            </div>
        </Link>
        
        {/* Fiyat ve Sepete Ekle Butonu Alanı */}
        <div className="p-4 bg-slate-50 flex justify-between items-center">
            <p className="text-xl font-extrabold text-purple-700">
                {product.price.toFixed(2)} TL
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Linkin tıklanmasını engelle
                    onAddToCart(product.id);
                }}
                disabled={product.stock === 0}
                className="p-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Sepete Ekle"
            >
                <ShoppingCart size={20} />
            </button>
        </div>
    </div>
);

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        apiClient.get('/api/products')
            .then(response => setProducts(response.data))
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setError('Ürünler yüklenirken bir hata oluştu.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = async (productId) => {
        try {
            await apiClient.post('/api/cart/items', { productId, quantity: 1 });
            setNotification('Ürün başarıyla sepete eklendi!');
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            console.error("Failed to add to cart:", err);
            const errorMsg = err.response?.data?.error || 'Ürün sepete eklenemedi.';
            setNotification(errorMsg);
            setTimeout(() => setNotification(''), 3000);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Ürünlerimiz</h1>

            {notification && (
                <div className={`fixed top-20 right-5 p-4 rounded-lg shadow-xl text-white ${notification.includes('başarıyla') ? 'bg-green-500' : 'bg-red-500'} transition-opacity duration-300`}>
                    {notification}
                </div>
            )}
            
            {loading && <p className="text-center text-gray-500">Yükleniyor...</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
}