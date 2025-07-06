import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, title, message, buttonText = "Tamam" }) {
    if (!isOpen) return null;

    return (
        // Artık arka planı karartan div yok
        <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
            {/* Modal İçeriği */}
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform transition-all scale-100"
            >
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={50} className="text-green-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-6">{title}</h2>
                <p className="text-gray-600 mt-2 text-md">{message}</p>

                <button
                    onClick={onClose}
                    className="w-full mt-8 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}