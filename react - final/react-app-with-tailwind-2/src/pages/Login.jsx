import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api'; // Merkezi API client'ımızı import ediyoruz

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && auth.isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [auth.isAuthenticated, auth.isLoading, navigate]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // API isteğini apiClient üzerinden yapıyoruz.
            const response = await apiClient.post('/api/auth/login', formData);
            
            // Cevap başarılıysa context'teki login fonksiyonunu çağırıyoruz.
            auth.login(response.data.token);
            
            // Ana sayfaya yönlendiriyoruz.
            navigate("/", { replace: true });

        } catch (err) {
            console.error("Login error:", err);
            const errorMsg = err.response?.data?.error || "Giriş başarısız. Bilgilerinizi kontrol edin.";
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ... (return JSX kısmı önceki cevapla aynı kalabilir, aşağıya ekliyorum)
    
    if (auth.isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    }

    const inputStyle = "w-full border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm transition-colors shadow-sm";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Giriş Yap</h2>
                    {error && (<div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded-md text-sm"><p>{error}</p></div>)}
                    <div className="mb-4">
                        <label htmlFor="email" className={labelStyle}>E-posta Adresi</label>
                        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} disabled={isSubmitting} placeholder="ornek@eposta.com" className={inputStyle} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className={labelStyle}>Şifre</label>
                        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} disabled={isSubmitting} placeholder="••••••••" className={inputStyle} />
                    </div>
                    <button type="submit" className="w-full py-3 text-md bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none disabled:opacity-60" disabled={isSubmitting}>
                        {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Hesabınız yok mu?{" "}
                        <Link to="/register" className="text-purple-600 hover:underline font-medium">Kayıt Olun</Link>
                    </div>
                </form>
            </div>
            <div className="hidden md:flex md:w-1/2 h-full items-center justify-center overflow-hidden">
                <img src="/images/login-page-image.jpg" alt="Login görseli" className="w-full h-full object-cover"/>
            </div>
        </div>
    );
}