import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>
                <Outlet /> {/* Rota'daki diğer sayfalar burada görünecek */}
            </main>
        </div>
    );
}