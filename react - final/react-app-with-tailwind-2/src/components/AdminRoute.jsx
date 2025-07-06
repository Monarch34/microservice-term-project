import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
    const { isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen font-semibold text-lg">Yetki Kontrol Ediliyor...</div>;
    }

    // Eğer kullanıcı admin ise alt rotaları göster, değilse ana sayfaya yönlendir.
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}