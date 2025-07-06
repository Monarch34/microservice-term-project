// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'; // AuthContext'i import ediyoruz

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth(); // AuthContext'ten kimlik durumunu ve yükleme durumunu alıyoruz

    // Kimlik doğrulama durumu hala kontrol ediliyorsa (AuthContext'teki isLoading)
    if (isLoading) {
        // Genellikle burada daha merkezi bir yükleme göstergesi (spinner vb.) kullanılır
        // veya uygulamanın genel bir yükleme ekranı olur.
        // Şimdilik basit bir metin gösterelim.
        return <p>Oturum durumu kontrol ediliyor...</p>;
    }

    // Eğer kullanıcı giriş yapmamışsa (ve yükleme bittiyse)
    if (!isAuthenticated) {
        // Kullanıcıyı login sayfasına yönlendir.
        // state: { from: location } ekleyerek, giriş yaptıktan sonra
        // kullanıcının gelmek istediği sayfaya geri yönlendirilmesini sağlayabiliriz (isteğe bağlı).
        return <Navigate to="/login" replace />;
    }

    // Kullanıcı giriş yapmışsa, istenen component'i (children) göster
    return children;
}