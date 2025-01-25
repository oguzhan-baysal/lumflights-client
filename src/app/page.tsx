'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState<Position>({ x: 50, y: 50 });
  const animationFrameIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const targetPositionRef = useRef<Position>({ x: 50, y: 50 });
  const currentPositionRef = useRef<Position>({ x: 50, y: 50 });

  // Blob sıfırlama fonksiyonu
  const resetBlob = useCallback(() => {
    // Blob'u merkeze konumlandır
    setMousePosition({ x: 50, y: 50 });
    currentPositionRef.current = { x: 50, y: 50 };
    targetPositionRef.current = { x: 50, y: 50 };
    
    // Mevcut animasyonu temizle
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Component mount olduğunda blob'u sıfırla
  useEffect(() => {
    // Sayfa yüklendiğinde çalıştır
    resetBlob();

    return () => {
      resetBlob();
    };
  }, [resetBlob]);

  // Çıkış sonrası yönlendirme için ayrı bir effect
  useEffect(() => {
    if (!user) {
      resetBlob();
    }
  }, [user, resetBlob]);

  // Mouse hareketi için optimize edilmiş fonksiyon
  const updatePosition = useCallback(() => {
    const currentPos = currentPositionRef.current;
    const targetPos = targetPositionRef.current;
    const dx = targetPos.x - currentPos.x;
    const dy = targetPos.y - currentPos.y;

    // Eğer hedef pozisyona yeterince yakınsak, animasyonu durdur
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      isAnimatingRef.current = false;
      return;
    }

    // Daha yumuşak hareket için easing fonksiyonu
    currentPos.x += dx * 0.08;
    currentPos.y += dy * 0.08;

    setMousePosition({ ...currentPos });
    animationFrameIdRef.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Mouse pozisyonunu viewport yüzdesine çevir
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      // Hedef pozisyonu güncelle
      targetPositionRef.current = { x, y };

      // Eğer animasyon çalışmıyorsa başlat
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationFrameIdRef.current = requestAnimationFrame(updatePosition);
      }
    };

    // Throttle fonksiyonu için değişkenler
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttleDelay = 16; // yaklaşık 60fps

    // Throttled mouse hareket handler'ı
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleMouseMove(e);
          throttleTimeout = null;
        }, throttleDelay);
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [updatePosition]);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Blob Efekti */}
      <div 
        className="absolute w-[600px] h-[600px] opacity-20 pointer-events-none will-change-transform"
        style={{
          top: `${mousePosition.y}%`,
          left: `${mousePosition.x}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="absolute w-full h-full bg-[#E11D48] rounded-full blur-[80px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <nav className="flex justify-between items-center mb-20">
          <div className="text-3xl font-bold text-gray-900">LUMIN</div>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Uçuş Rezervasyonlarını 
            <span className="text-[#E11D48]"> Yönetmek </span> 
            Hiç Bu Kadar Kolay Olmamıştı
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            LumFlights ile rezervasyonlarınızı tek platformdan yönetin, 
            yapay zeka destekli önerilerle işinizi kolaylaştırın.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#E11D48] text-white px-8 py-4 rounded-lg text-lg font-semibold
                     hover:bg-[#BE123C] transition-all duration-300 
                     shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Hemen Başla
          </button>
        </div>

        {/* Özellikler */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl 
                        transition-all duration-300 ease-out 
                        hover:-translate-y-2 hover:scale-105">
            <div className="w-12 h-12 bg-[#E11D48] bg-opacity-10 rounded-lg 
                          flex items-center justify-center mb-4
                          group-hover:bg-opacity-20">
              <svg className="w-6 h-6 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gerçek Zamanlı Takip</h3>
            <p className="text-gray-600">Rezervasyonlarınızı anlık olarak takip edin ve yönetin.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl 
                        transition-all duration-300 ease-out 
                        hover:-translate-y-2 hover:scale-105">
            <div className="w-12 h-12 bg-[#E11D48] bg-opacity-10 rounded-lg 
                          flex items-center justify-center mb-4
                          group-hover:bg-opacity-20">
              <svg className="w-6 h-6 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Destekli Öneriler</h3>
            <p className="text-gray-600">Yapay zeka ile akıllı öneriler ve analizler alın.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl 
                        transition-all duration-300 ease-out 
                        hover:-translate-y-2 hover:scale-105">
            <div className="w-12 h-12 bg-[#E11D48] bg-opacity-10 rounded-lg 
                          flex items-center justify-center mb-4
                          group-hover:bg-opacity-20">
              <svg className="w-6 h-6 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Erişim</h3>
            <p className="text-gray-600">Rol tabanlı yetkilendirme ile güvenli veri yönetimi.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
