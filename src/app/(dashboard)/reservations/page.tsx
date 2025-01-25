'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import SeedButton from './SeedButton';
import SeedUsersButton from './SeedUsersButton';
import AIRecommendationsModal from '@/components/AIRecommendations';

interface Reservation {
  id: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  passengers: {
    id: string;
    name: string;
    email: string;
  }[];
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const currentPositionRef = useRef<{ x: number; y: number }>({ x: 50, y: 50 });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Rezervasyonları çekme fonksiyonu
  const fetchReservations = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const token = await auth.currentUser.getIdToken(true);
      
      // Admin için tarih filtreli endpoint
      let endpoint = user?.role === 'admin' 
        ? 'http://localhost:3001/reservations/admin'
        : 'http://localhost:3001/reservations';

      // Admin ve tarih filtreleri varsa query parametreleri ekle
      if (user?.role === 'admin' && startDate && endDate) {
        // Tarihleri ISO formatına çevir
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
        endpoint += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'API hatası');
      }

      const data = await response.json();
      
      // Admin için tarih filtresi uygula
      if (user?.role === 'admin' && startDate && endDate) {
        const filteredData = data.filter((reservation: Reservation) => {
          const reservationDate = new Date(reservation.departureDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          // Saat bilgisini sıfırla
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          
          return reservationDate >= start && reservationDate <= end;
        });
        setReservations(filteredData);
      } else {
        setReservations(data);
      }
      
      // Filtreleme sonrası ilk sayfaya dön
      setCurrentPage(1);
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      toast.error('Rezervasyonlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [user?.role, startDate, endDate]);

  useEffect(() => {
    if (user) {
      fetchReservations();
      const interval = setInterval(fetchReservations, 10000); // 10 saniye
      return () => clearInterval(interval);
    }
  }, [user, fetchReservations]); // fetchReservations'ı dependency olarak ekledik

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const paginatedReservations = reservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
        className="absolute w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="absolute w-full h-full bg-[#E11D48] rounded-full blur-[80px]"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
          
          {/* Admin için tarih filtresi */}
          {user?.role === 'admin' && (
            <div className="flex gap-4 items-center">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-[#E11D48]
                             text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-[#E11D48]
                             text-gray-900"
                />
              </div>
              <button
                onClick={() => {
                  if (!startDate || !endDate) {
                    toast.error('Lütfen başlangıç ve bitiş tarihlerini seçin');
                    return;
                  }
                  if (new Date(startDate) > new Date(endDate)) {
                    toast.error('Başlangıç tarihi bitiş tarihinden sonra olamaz');
                    return;
                  }
                  fetchReservations();
                }}
                className="mt-6 px-4 py-2 bg-[#E11D48] text-white rounded-lg 
                           hover:bg-[#BE123C] transition-colors"
              >
                Filtrele
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <SeedButton />
            <SeedUsersButton />
          </div>
        </div>

        {/* Rezervasyon Kartları */}
        <div className="space-y-4">
          {paginatedReservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                       transition-all duration-300 ease-out hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Uçuş No: {reservation.flightNumber}
                  </h2>
                  <p className="text-gray-600">Kalkış: {formatDate(reservation.departureDate)}</p>
                  <p className="text-gray-600">Varış: {formatDate(reservation.arrivalDate)}</p>
                  <p className="text-gray-600">Yolcu Sayısı: {reservation.passengers.length}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setIsAIModalOpen(true);
                    }}
                    className="text-[#E11D48] hover:text-[#BE123C] transition-colors"
                  >
                    AI Önerileri
                  </button>
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {/* Önceki Sayfa Butonu */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 
                       hover:bg-gray-100 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-gray-700 font-medium"
          >
            ←
          </button>

          {/* İlk Sayfa */}
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              1 === currentPage 
                ? 'bg-[#E11D48] text-white border border-[#E11D48]' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            1
          </button>

          {/* Üç Nokta */}
          {currentPage > 4 && (
            <span className="px-3 py-2 text-gray-600 font-medium">...</span>
          )}

          {/* Orta Sayfalar */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(num => {
              if (num === 1 || num === totalPages) return false;
              return Math.abs(currentPage - num) <= 2;
            })
            .map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pageNum === currentPage 
                    ? 'bg-[#E11D48] text-white border border-[#E11D48]' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

          {/* Üç Nokta */}
          {currentPage < totalPages - 3 && (
            <span className="px-3 py-2 text-gray-600 font-medium">...</span>
          )}

          {/* Son Sayfa */}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              totalPages === currentPage 
                ? 'bg-[#E11D48] text-white border border-[#E11D48]' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {totalPages}
          </button>

          {/* Sonraki Sayfa Butonu */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 
                       hover:bg-gray-100 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-gray-700 font-medium"
          >
            →
          </button>
        </div>

        {/* Sayfa bilgisi - Rengi koyulaştırıldı */}
        <div className="mt-2 text-center text-sm font-medium text-gray-800">
          Toplam {reservations.length} rezervasyon • Sayfa {currentPage}/{totalPages}
        </div>

        {/* Modals */}
        <AIRecommendationsModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          reservation={selectedReservation}
        />

        {/* Detay Modal */}
        {selectedReservation && !isAIModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Rezervasyon Detayları</h2>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">Uçuş Numarası</p>
                  <p className="text-gray-600">{selectedReservation.flightNumber}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Kalkış Tarihi</p>
                  <p className="text-gray-600">{formatDate(selectedReservation.departureDate)}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Varış Tarihi</p>
                  <p className="text-gray-600">{formatDate(selectedReservation.arrivalDate)}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Yolcular</p>
                  <div className="space-y-2">
                    {selectedReservation.passengers.map((passenger) => (
                      <div key={passenger.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-900">İsim: {passenger.name}</p>
                        <p className="text-gray-600">Email: {passenger.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 