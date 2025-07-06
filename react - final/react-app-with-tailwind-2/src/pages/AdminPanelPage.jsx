import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { Check, X, PlusCircle, Edit, Image as ImageIcon, ShoppingBag, Box } from 'lucide-react';

// --- Ürün Yönetimi Bileşeni (Değişiklik yok) ---
const ProductManagement = () => {
    // ... Bu bileşenin içeriği önceki cevaplarla aynı, değişiklik yok ...
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [productData, setProductData] = useState({});
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
    const fetchProducts = useCallback(async () => { try { setLoading(true); const response = await apiClient.get('/api/products'); setProducts(response.data); } catch (err) { setError('Ürünler yüklenemedi.'); } finally { setLoading(false); } }, []);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    const handleEditClick = (product) => { setEditingProductId(product.id); setProductData({ name: product.name, description: product.description || '', price: product.price, stock: product.stock, category: product.category || '', imageUrl: product.imageUrl || '' }); };
    const handleCancelClick = () => setEditingProductId(null);
    const handleSaveClick = async (productId) => { try { await apiClient.put(`/api/products/${productId}`, { ...productData, price: parseFloat(productData.price), stock: parseInt(productData.stock, 10) }); setEditingProductId(null); fetchProducts(); } catch (err) { setError('Ürün güncellenemedi.'); } };
    const handleInputChange = (e, formType) => { const { name, value } = e.target; if (formType === 'edit') { setProductData(prev => ({ ...prev, [name]: value })); } else { setNewProduct(prev => ({ ...prev, [name]: value })); } };
    const handleAddNewProduct = async (e) => { e.preventDefault(); try { await apiClient.post('/api/products', { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock, 10) }); setNewProduct({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' }); fetchProducts(); } catch (err) { setError('Yeni ürün eklenemedi.'); } };
    if (loading) return <div className="p-8 text-center">Ürünler Yükleniyor...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center"><PlusCircle className="mr-2 text-purple-600"/>Yeni Ürün Ekle</h2>
                <form onSubmit={handleAddNewProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <input type="text" name="name" value={newProduct.name} onChange={(e) => handleInputChange(e, 'new')} placeholder="Ürün Adı" className="p-2 border rounded" required />
                    <input type="text" name="category" value={newProduct.category} onChange={(e) => handleInputChange(e, 'new')} placeholder="Kategori" className="p-2 border rounded" />
                    <input type="number" name="price" value={newProduct.price} onChange={(e) => handleInputChange(e, 'new')} placeholder="Fiyat" className="p-2 border rounded" required step="0.01" />
                    <input type="number" name="stock" value={newProduct.stock} onChange={(e) => handleInputChange(e, 'new')} placeholder="Stok" className="p-2 border rounded" required />
                    <textarea name="description" value={newProduct.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Açıklama" className="p-2 border rounded md:col-span-2 lg:col-span-3" rows="1"></textarea>
                    <input type="url" name="imageUrl" value={newProduct.imageUrl} onChange={(e) => handleInputChange(e, 'new')} placeholder="Görsel URL" className="p-2 border rounded md:col-span-2 lg:col-span-3" />
                    <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 h-full w-full">Ekle</button>
                </form>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100"><tr><th className="p-4 text-left font-semibold">Görsel</th><th className="p-4 text-left font-semibold">ID</th><th className="p-4 text-left font-semibold">Ad</th><th className="p-4 text-left font-semibold">Açıklama</th><th className="p-4 text-left font-semibold">Fiyat</th><th className="p-4 text-left font-semibold">Stok</th><th className="p-4 text-left font-semibold">Kategori</th><th className="p-4 text-left font-semibold">İşlemler</th></tr></thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b">
                                {editingProductId === product.id ? (
                                    <><td className="p-2"><input type="url" name="imageUrl" value={productData.imageUrl} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-full min-w-[200px]" placeholder="Görsel URL"/></td><td className="p-2 font-medium">{product.id}</td><td className="p-2"><input type="text" name="name" value={productData.name} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-full min-w-[150px]" /></td><td className="p-2"><input type="text" name="description" value={productData.description} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-full min-w-[200px]" /></td><td className="p-2"><input type="number" name="price" value={productData.price} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-24" step="0.01" /></td><td className="p-2"><input type="number" name="stock" value={productData.stock} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-20" /></td><td className="p-2"><input type="text" name="category" value={productData.category} onChange={(e) => handleInputChange(e, 'edit')} className="p-1 border rounded w-full min-w-[120px]" /></td><td className="p-2 flex space-x-2"><button onClick={() => handleSaveClick(product.id)} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><Check /></button><button onClick={handleCancelClick} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><X /></button></td></>
                                ) : (
                                    <><td className="p-2">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md"/> : <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center"><ImageIcon className="text-gray-400"/></div>}</td><td className="p-4 font-medium">{product.id}</td><td className="p-4">{product.name}</td><td className="p-4 truncate max-w-xs">{product.description || '-'}</td><td className="p-4">{product.price.toFixed(2)} TL</td><td className="p-4">{product.stock}</td><td className="p-4">{product.category || '-'}</td><td className="p-4"><button onClick={() => handleEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit /></button></td></>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Sipariş Yönetimi Bileşeni (GÜNCELLENDİ) ---
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Sadece yeni Türkçe durumları içeren temizlenmiş liste
    const ORDER_STATUSES = [
        "ISLENIYOR",
        "KARGODA",
        "TESLIM_EDILDI",
        "IPTAL_EDILDI"
    ];

    const fetchAllOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/orders/all');
            const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (err) {
            setError('Siparişler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleStatusChange = async (currentOrder, newStatus) => {
        try {
            await apiClient.put(`/api/orders/${currentOrder.id}`, {
                status: newStatus,
                shippingAddress: currentOrder.shippingAddress
            });
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === currentOrder.id ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error("Order status update failed:", err);
            alert('Sipariş durumu güncellenirken bir hata oluştu.');
        }
    };

    if (loading) return <div className="p-8 text-center">Siparişler Yükleniyor...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left font-semibold">Sipariş ID</th>
                        <th className="p-4 text-left font-semibold">Kullanıcı ID</th>
                        <th className="p-4 text-left font-semibold">Tarih</th>
                        <th className="p-4 text-left font-semibold">Tutar</th>
                        <th className="p-4 text-left font-semibold">Teslimat Adresi</th>
                        <th className="p-4 text-left font-semibold">Durum</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{order.id}</td>
                            <td className="p-4">{order.userId}</td>
                            <td className="p-4">{new Date(order.orderDate).toLocaleDateString('tr-TR')}</td>
                            <td className="p-4">{order.totalAmount.toFixed(2)} TL</td>
                            <td className="p-4 truncate max-w-xs">{order.shippingAddress}</td>
                            <td className="p-4">
                                {/* Select menüsü sadece Türkçe durumları gösterecek */}
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order, e.target.value)}
                                    className="p-2 border rounded-md bg-white focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Ana Admin Paneli Bileşeni (Değişiklik yok) ---
export default function AdminPanelPage() {
    const [activeTab, setActiveTab] = useState('products');
    const renderContent = () => {
        switch (activeTab) {
            case 'products': return <ProductManagement />;
            case 'orders': return <OrderManagement />;
            default: return null;
        }
    };
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Admin Paneli</h1>
            <div className="flex border-b mb-8">
                <button onClick={() => setActiveTab('products')} className={`flex items-center space-x-2 py-3 px-6 font-semibold text-lg transition-colors ${activeTab === 'products' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}><Box /><span>Ürün Yönetimi</span></button>
                <button onClick={() => setActiveTab('orders')} className={`flex items-center space-x-2 py-3 px-6 font-semibold text-lg transition-colors ${activeTab === 'orders' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}><ShoppingBag /><span>Sipariş Yönetimi</span></button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
}