import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import SuccessModal from '../components/SuccessModal';
import { CreditCard, User, Calendar, Lock, ArrowLeft } from 'lucide-react';

export default function PaymentPage() {
    const [cardInfo, setCardInfo] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    // Sepet sayfasından gönderilen state'i al
    const { shippingAddress, totalPrice } = location.state || {};

    // Eğer state bilgisi yoksa (örn: direkt URL ile gelindiyse), kullanıcıyı sepet sayfasına geri yolla
    if (!shippingAddress || totalPrice === undefined) {
        navigate('/cart');
        return null; // Component'in geri kalanının render edilmesini engelle
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Basit bir doğrulama
        if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvc) {
            setError('Lütfen tüm kart bilgilerini eksiksiz girin.');
            return;
        }
        
        setIsProcessing(true);
        setError('');

        try {
            // Asıl sipariş oluşturma isteğini burada atıyoruz
            await apiClient.post('/api/orders', { shippingAddress });
            setIsModalOpen(true); // Başarılı olursa modalı aç
        } catch (err) {
            console.error('Failed to create order:', err);
            setError(err.response?.data?.error || 'Sipariş oluşturulurken bir hata oluştu.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/'); // Ana sayfaya yönlendir
    };


    return (
        <div className="bg-slate-50 min-h-screen flex justify-center items-center p-4">
             <SuccessModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Ödeme Başarılı!"
                message="Siparişiniz başarıyla oluşturuldu. Detayları 'Siparişlerim' sayfasından takip edebilirsiniz."
                buttonText="Harika!"
            />

            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ödeme Formu */}
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <button onClick={() => navigate('/cart')} className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold mb-6">
                        <ArrowLeft size={20} />
                        <span>Sepete Geri Dön</span>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Ödeme Bilgileri</h2>
                    <form onSubmit={handlePaymentSubmit}>
                        <div className="space-y-4">
                            {/* Kart Numarası */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                                <CreditCard className="absolute left-3 top-9 text-gray-400" size={20} />
                                <input type="text" name="number" placeholder="0000 0000 0000 0000" onChange={handleInputChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                            {/* Kart Üzerindeki İsim */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                                <User className="absolute left-3 top-9 text-gray-400" size={20} />
                                <input type="text" name="name" placeholder="Ad Soyad" onChange={handleInputChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                             {/* Son Kullanma Tarihi ve CVC */}
                            <div className="flex space-x-4">
                                <div className="relative w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Son K. T.</label>
                                    <Calendar className="absolute left-3 top-9 text-gray-400" size={20} />
                                    <input type="text" name="expiry" placeholder="AA/YY" onChange={handleInputChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                                <div className="relative w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <Lock className="absolute left-3 top-9 text-gray-400" size={20} />
                                    <input type="text" name="cvc" placeholder="123" onChange={handleInputChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <button type="submit" disabled={isProcessing} className="w-full mt-8 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                            {isProcessing ? 'İşleniyor...' : `Ödemeyi Yap (${totalPrice.toFixed(2)} TL)`}
                        </button>
                    </form>
                </div>
                {/* Sipariş Özeti */}
                <div className="bg-white p-8 rounded-2xl shadow-xl h-fit">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Sipariş Özeti</h2>
                    <div className="flex justify-between mb-4 text-lg">
                        <span className="text-gray-600">Teslimat Adresi</span>
                        <span className="font-semibold text-right w-1/2 truncate" title={shippingAddress}>{shippingAddress}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-2xl border-t pt-4">
                        <span>Toplam Tutar</span>
                        <span>{totalPrice.toFixed(2)} TL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}