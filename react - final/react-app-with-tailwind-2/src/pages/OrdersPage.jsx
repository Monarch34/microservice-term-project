import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';
import { Hash, Calendar, CircleDollarSign, Truck, MapPin } from 'lucide-react';

// Duruma göre renkli etiket döndüren yardımcı fonksiyon
const getStatusChip = (status) => {
    let colorClass = 'bg-gray-500'; // Varsayılan renk
    let text = status;

    switch (status) {
        case 'ISLENIYOR':
            colorClass = 'bg-blue-500';
            text = 'İşleniyor';
            break;
        case 'KARGODA':
            colorClass = 'bg-orange-500';
            text = 'Kargoda';
            break;
        case 'TESLIM_EDILDI':
            colorClass = 'bg-green-600';
            text = 'Teslim Edildi';
            break;
        case 'IPTAL_EDILDI':
            colorClass = 'bg-red-600';
            text = 'İptal Edildi';
            break;
    }

    return (
        <span className={`px-3 py-1 text-xs font-bold text-white ${colorClass} rounded-full`}>
            {text}
        </span>
    );
};

const OrderCard = ({ order, productsInfo }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 bg-gray-50 border-b grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
             <div className="space-y-2">
                <div className="flex items-center space-x-2"><Hash size={16} className="text-purple-600" /><div><p className="font-bold">SİPARİŞ NO</p><p>#{order.id}</p></div></div>
                <div className="flex items-center space-x-2"><CircleDollarSign size={16} className="text-purple-600" /><div><p className="font-bold">TUTAR</p><p>{order.totalAmount.toFixed(2)} TL</p></div></div>
            </div>
            <div className="space-y-2">
                 <div className="flex items-center space-x-2"><Calendar size={16} className="text-purple-600" /><div><p className="font-bold">TARİH</p><p>{new Date(order.orderDate).toLocaleDateString('tr-TR')}</p></div></div>
                <div className="flex items-center space-x-2">
                    <Truck size={16} className="text-purple-600" />
                    <div>
                        <p className="font-bold">DURUM</p>
                        {getStatusChip(order.status)}
                    </div>
                </div>
            </div>
            <div className="flex items-start space-x-2 md:col-span-2 lg:col-span-1">
                <MapPin size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                <div><p className="font-bold">TESLİMAT ADRESİ</p><p className="break-words">{order.shippingAddress}</p></div>
            </div>
        </div>
        <div className="p-4">
            <h4 className="font-semibold mb-2 text-gray-700">Sipariş Detayları:</h4>
            {order.orderItems.map(item => {
                const productName = productsInfo[item.productId]?.name || `Ürün ID: ${item.productId}`;
                return (
                    <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-none">
                        <p className="text-gray-800 font-medium">{productName}</p>
                        <p className="text-gray-500">{item.quantity} x {item.priceAtTimeOfOrder.toFixed(2)} TL</p>
                    </div>
                );
            })}
        </div>
    </div>
);

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [productsInfo, setProductsInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrdersAndProducts = useCallback(async () => {
        try {
            const ordersResponse = await apiClient.get('/api/orders');
            const fetchedOrders = ordersResponse.data;
            setOrders(fetchedOrders);
            if (fetchedOrders.length > 0) {
                const productIds = new Set();
                fetchedOrders.forEach(order => order.orderItems.forEach(item => productIds.add(item.productId)));
                const productPromises = Array.from(productIds).map(id => apiClient.get(`/api/products/${id}`));
                const productResponses = await Promise.all(productPromises);
                const productsData = productResponses.reduce((acc, response) => {
                    acc[response.data.id] = response.data;
                    return acc;
                }, {});
                setProductsInfo(productsData);
            }
        } catch (err) {
            console.error("Failed to fetch orders or products:", err);
            setError('Siparişler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrdersAndProducts();
    }, [fetchOrdersAndProducts]);

    if (loading) return <div className="text-center p-10 font-semibold">Siparişler Yükleniyor...</div>;
    if (error) return <div className="text-center p-10 text-red-500 bg-red-100">{error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Siparişlerim</h1>
            {orders.length === 0 ? (
                 <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">Henüz bir siparişiniz bulunmuyor.</h2>
                    <Link to="/" className="mt-6 inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">Alışverişe Başla</Link>
                </div>
            ) : (
                <div>
                    {orders.map(order => (<OrderCard key={order.id} order={order} productsInfo={productsInfo} />))}
                </div>
            )}
        </div>
    );
}