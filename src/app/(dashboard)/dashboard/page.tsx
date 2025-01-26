'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  passengers: {
    id: string;
    name: string;
    email: string;
  }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeReservations: 0,
    totalPassengers: 0,
    pendingOperations: 0
  });
  const [loading, setLoading] = useState(true);

  // İstatistikleri çekme
  useEffect(() => {
    const fetchStats = async (retryCount = 3) => {
      try {
        if (!auth.currentUser) {
          throw new Error('Kullanıcı oturumu bulunamadı');
        }

        let token;
        try {
          token = await auth.currentUser.getIdToken(true);
        } catch (_error) {
          console.error('Token alınamadı, yeniden deneniyor...', _error);
          if (retryCount > 0) {
            setTimeout(() => fetchStats(retryCount - 1), 1000);
          }
          return;
        }

        const endpoint = user?.role === 'admin' 
          ? `${process.env.NEXT_PUBLIC_API_URL}/reservations/admin`
          : `${process.env.NEXT_PUBLIC_API_URL}/reservations`;

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Rezervasyonlar yüklenemedi');
        }

        const reservations: Reservation[] = await response.json();
        
        const activeReservations = reservations.filter((r: Reservation) => r.status === 'ACTIVE').length;
        const totalPassengers = reservations.reduce((total: number, r: Reservation) => total + r.passengers.length, 0);
        const pendingOperations = reservations.filter((r: Reservation) => 
          new Date(r.departureDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
        ).length;

        setStats({
          activeReservations,
          totalPassengers,
          pendingOperations
        });
      } catch (_error) {
        console.error('İstatistikler yüklenirken hata:', _error);
        if (retryCount > 0) {
          console.log(`Yeniden deneniyor... (${retryCount} deneme kaldı)`);
          setTimeout(() => fetchStats(retryCount - 1), 1000);
        } else {
          toast.error('İstatistikler yüklenemedi');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Sabit Blob Efekti */}
      <div 
        className="absolute w-[800px] h-[800px] opacity-10 pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="absolute w-full h-full bg-[#E11D48] rounded-full blur-[120px]"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Hoş Geldiniz, {user?.email}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 ease-out hover:-translate-y-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Aktif Rezervasyonlar</h2>
            <p className="text-3xl font-bold text-[#E11D48]">{stats.activeReservations}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 ease-out hover:-translate-y-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Toplam Yolcu</h2>
            <p className="text-3xl font-bold text-[#E11D48]">{stats.totalPassengers}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 ease-out hover:-translate-y-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Bekleyen İşlemler</h2>
            <p className="text-3xl font-bold text-[#E11D48]">{stats.pendingOperations}</p>
          </div>
        </div>
      </div>
    </main>
  );
} 