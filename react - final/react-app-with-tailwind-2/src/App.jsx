import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout ve Sayfaları import et
import MainLayout from './components/MainLayout';
import AdminRoute from './components/AdminRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';

// --- Rota Koruma Bileşenleri ---

// Sadece giriş yapmış kullanıcıların erişebileceği rotaları korur.
// Giriş yapılmamışsa /login sayfasına yönlendirir.
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen font-semibold text-lg">Yükleniyor...</div>;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// ProtectedRoute'a ek olarak, içindeki sayfalara MainLayout'u (Navbar vb.) ekler.
const ProtectedRouteWithLayout = () => (
    <MainLayout>
        <Outlet />
    </MainLayout>
);

// Sadece giriş yapmamış kullanıcıların erişebileceği rotaları (login, register) korur.
// Giriş yapılmışsa ana sayfaya yönlendirir.
const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen font-semibold text-lg">Yükleniyor...</div>;
    }
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

// --- Ana App Bileşeni ---

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Rotalar (Giriş yapmamış kullanıcılar için) */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Korumalı Rotalar (Giriş yapmış kullanıcılar için) */}
                    <Route element={<ProtectedRoute />}>
                        
                        {/* Standart Layout'a sahip korumalı rotalar */}
                        <Route element={<ProtectedRouteWithLayout/>}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products/:productId" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            
                            {/* Admin rotasını hem layout'lu hem de AdminRoute korumalı yapıyoruz */}
                            <Route path="/admin" element={<AdminRoute />}>
                                <Route path="products" element={<AdminPanelPage />} />
                            </Route>
                        </Route>

                        {/* Layout'u olmayan, tam sayfa korumalı rotalar (Örn: Ödeme Sayfası) */}
                        <Route path="/checkout/payment" element={<PaymentPage />} />
                    </Route>
                    
                    {/* Eşleşmeyen tüm yolları ana sayfaya yönlendir */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
