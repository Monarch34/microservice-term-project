import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, LogOut, Package, Shield } from 'lucide-react'; // Shield ikonunu ekliyoruz

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-purple-700 hover:text-purple-800 transition-colors">
                        E-Ticaret
                    </Link>
                    {user && (
                         <div className="flex items-center space-x-6">
                            <Link to="/profile" className="text-gray-700 hidden sm:block hover:text-purple-600 transition-colors">
                                Hoşgeldin, <span className="font-semibold">{user.name}</span>
                            </Link>

                            {/* Sadece admin'e görünecek Admin Paneli linki */}
                            {isAdmin && (
                                <Link to="/admin/products" className="flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors" aria-label="Admin Paneli">
                                    <Shield size={22} />
                                    <span className="hidden md:block">Admin</span>
                                </Link>
                            )}
                            
                            <Link to="/orders" className="text-gray-600 hover:text-purple-700 transition-colors" aria-label="Siparişlerim"><Package size={24} /></Link>
                            <Link to="/cart" className="text-gray-600 hover:text-purple-700 transition-colors" aria-label="Alışveriş Sepeti"><ShoppingCart size={24} /></Link>
                            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors" aria-label="Çıkış Yap">
                                <LogOut size={22} />
                                <span className="hidden md:block">Çıkış Yap</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}