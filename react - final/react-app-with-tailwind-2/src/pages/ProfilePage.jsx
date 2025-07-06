import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { User, Mail, Calendar, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
    // AuthContext'ten gelen kullanıcı bilgisini doğrudan kullanabiliriz.
    // Çünkü AuthContext zaten /api/user/me'den veri çekiyor.
    const { user, isLoading } = useAuth();
    const [error, setError] = useState('');

    if (isLoading) {
        return <div className="text-center p-10 font-semibold">Profil Yükleniyor...</div>;
    }

    if (!user) {
        return <div className="text-center p-10 text-red-500 bg-red-100">Kullanıcı bilgileri bulunamadı veya yüklenemedi.</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Profil Bilgilerim</h1>

            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                    {/* Profil Resmi Alanı */}
                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center border-4 border-purple-200">
                        <User size={60} className="text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                
                <div className="mt-8 border-t pt-6 space-y-4">
                    <div className="flex items-center text-lg">
                        <Mail size={20} className="text-purple-600 mr-4" />
                        <span className="font-semibold text-gray-700 w-32">E-posta:</span>
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-lg">
                        <User size={20} className="text-purple-600 mr-4" />
                        <span className="font-semibold text-gray-700 w-32">Tam Ad:</span>
                        <span>{user.name}</span>
                    </div>
                     <div className="flex items-center text-lg">
                        <Calendar size={20} className="text-purple-600 mr-4" />
                        <span className="font-semibold text-gray-700 w-32">Kayıt Tarihi:</span>
                        <span>{new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center text-lg">
                        <KeyRound size={20} className="text-purple-600 mr-4" />
                        <span className="font-semibold text-gray-700 w-32">Kullanıcı ID:</span>
                        <span>{user.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}