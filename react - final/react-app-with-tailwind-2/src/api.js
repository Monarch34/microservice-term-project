import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './config';

// Axios için yeni bir instance oluşturuyoruz.
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (İstek Yakalayıcı)
// Bu bölüm, herhangi bir istek gönderilmeden hemen önce araya girer.
apiClient.interceptors.request.use(
    (config) => {
        // Cookie'den token'ı oku.
        const token = Cookies.get('token');

        // Eğer token varsa, Authorization başlığını ayarla.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // İstek hatası olursa burası çalışır.
        return Promise.reject(error);
    }
);

export default apiClient;