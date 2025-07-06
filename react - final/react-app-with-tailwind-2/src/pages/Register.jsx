import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config'; // API_BASE_URL'i config dosyasından alıyoruz

export default function Register() {
    // State'lerimizi backend modeline tam uyumlu hale getiriyoruz.
    const [formData, setFormData] = useState({
        name: "", // Ad ve soyad için tek bir alan
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir.
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    // Form alanlarındaki değişiklikleri yöneten fonksiyon.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    // Form gönderildiğinde çalışacak fonksiyon.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Temel doğrulamalar
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Lütfen tüm zorunlu alanları doldurun.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        setIsSubmitting(true);

        // Backend'in beklediği `RegisterRequest` formatına uygun veri hazırlığı.
        // Artık doğrudan formData'yı gönderebiliriz (confirmPassword hariç).
        const registrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            // Yeni microservice endpoint'ine istek atıyoruz.
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
                // Formu temizle
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                // 2.5 saniye sonra login sayfasına yönlendir.
                setTimeout(() => navigate("/login"), 2500);
            } else {
                let errorMsg = `Kayıt başarısız oldu (HTTP ${response.status})`;
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.error) { // errorJson'ın varlığını kontrol et
                        errorMsg = errorJson.error;
                    }
                } catch (parseErr) {
                     const errorText = await response.text();
                    if(errorText) errorMsg = errorText;
                }
                setError(errorMsg);
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Sunucu ile iletişim kurulamadı veya bir ağ hatası oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isAuthLoading) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    }

    const inputStyle = "w-full border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm transition-colors shadow-sm";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
    const formElementMargin = "mb-4";

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 h-full">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md overflow-y-auto"
                    style={{ maxHeight: 'calc(100vh - 40px)' }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-700 mb-6">
                        Yeni Hesap Oluştur
                    </h2>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded-md text-sm shadow-sm">
                            <p className="font-semibold">Hata:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 mb-4 rounded-md text-sm shadow-sm">
                            <p className="font-semibold">Başarılı!</p>
                            <p>{success}</p>
                        </div>
                    )}
                    
                    {/* Ad ve Soyad için tek input alanı */}
                    <div className={formElementMargin}>
                        <label htmlFor="name" className={labelStyle}>Adınız Soyadınız *</label>
                        <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} disabled={isSubmitting} placeholder="Adınız Soyadınız" className={inputStyle}/>
                    </div>
                    
                    <div className={formElementMargin}>
                         <label htmlFor="email" className={labelStyle}>E-posta Adresiniz *</label>
                        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} disabled={isSubmitting} placeholder="ornek@eposta.com" className={inputStyle}/>
                    </div>

                    <div className={formElementMargin}>
                         <label htmlFor="password" className={labelStyle}>Şifre *</label>
                        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} disabled={isSubmitting} placeholder="En az 6 karakter" className={inputStyle}/>
                    </div>
                    <div className={formElementMargin}>
                         <label htmlFor="confirmPassword" className={labelStyle}>Şifre (Tekrar) *</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} placeholder="Şifrenizi tekrar girin" className={inputStyle}/>
                    </div>

                    <button type="submit" className="w-full mt-4 py-3 text-md bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-60" disabled={isSubmitting}>
                        {isSubmitting ? "Kaydediliyor..." : "Hesap Oluştur"}
                    </button>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Zaten bir hesabınız var mı?{" "}
                        <Link to="/login" className="text-purple-600 hover:underline font-medium">
                            Giriş Yapın
                        </Link>
                    </div>
                </form>
            </div>
            
            <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center overflow-hidden">
                <img src="/images/login-page-image.jpg" alt="Register görseli" className="w-full h-full object-cover"/>
            </div>
        </div>
    );
}