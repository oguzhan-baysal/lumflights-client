'use client';

import Modal from './Modal';

interface AIRecommendation {
  title: string;
  content: string;
  type: 'suggestion' | 'analysis' | 'summary';
}

interface AIRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

// Dinamik öneri üreten fonksiyon
const generateRecommendations = (reservation: any): AIRecommendation[] => {
  if (!reservation) return [];
  
  const recommendations: AIRecommendation[] = [];
  
  // Doluluk Analizi
  const occupancyRate = (reservation.passengers.length / 3) * 100;
  recommendations.push({
    title: 'Doluluk Analizi',
    content: `Bu uçuşta %${occupancyRate.toFixed(0)} doluluk oranı var. ${
      occupancyRate > 66 
        ? 'Yüksek doluluk nedeniyle ek sefer düşünülebilir.' 
        : occupancyRate < 33 
        ? 'Düşük doluluk nedeniyle promosyon önerilir.' 
        : 'Doluluk oranı normal seviyelerde.'
    }`,
    type: 'analysis'
  });

  // Sezon Analizi
  const flightDate = new Date(reservation.departureDate);
  const month = flightDate.getMonth();
  const isSummer = month >= 5 && month <= 8;
  const isWinter = month <= 1 || month >= 11;
  
  recommendations.push({
    title: 'Sezon Analizi',
    content: `${
      isSummer 
        ? 'Yaz sezonu yoğunluğu devam ediyor. Fiyat optimizasyonu önerilir.' 
        : isWinter 
        ? 'Kış sezonu. Tatil destinasyonlarına özel kampanyalar düşünülebilir.' 
        : 'Orta sezon. Standart fiyatlandırma uygun.'
    }`,
    type: 'summary'
  });

  // Müşteri Profili
  const hasMultiplePassengers = reservation.passengers.length > 1;
  recommendations.push({
    title: 'Müşteri Profili',
    content: `${
      hasMultiplePassengers 
        ? `Grup rezervasyonu (${reservation.passengers.length} yolcu) tespit edildi. 
           Grup indirimleri ve özel hizmetler önerilebilir.`
        : 'Tekil rezervasyon. Kişiselleştirilmiş hizmetler sunulabilir.'
    }`,
    type: 'analysis'
  });

  // Operasyonel Öneri
  const flightNumber = reservation.flightNumber;
  const isInternational = !flightNumber.startsWith('TK');
  
  recommendations.push({
    title: 'Operasyonel Öneri',
    content: `${flightNumber} numaralı uçuş için ${
      isInternational 
        ? 'uluslararası uçuş protokolleri uygulanmalı. Pasaport kontrolleri için ek personel planlanabilir.' 
        : 'yurtiçi uçuş protokolleri uygulanmalı.'
    } ${
      hasMultiplePassengers 
        ? 'Grup check-in işlemleri için ek personel planlanabilir.' 
        : 'Standart check-in prosedürleri yeterli olacaktır.'
    }`,
    type: 'suggestion'
  });

  // Fiyatlandırma Önerisi
  const daysToDeparture = Math.ceil(
    (flightDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  recommendations.push({
    title: 'Fiyatlandırma Önerisi',
    content: `Uçuşa ${daysToDeparture} gün var. ${
      daysToDeparture < 7 
        ? 'Son dakika fiyatlandırması uygulanabilir. Yüksek talep durumunda fiyat artışı düşünülebilir.' 
        : daysToDeparture < 30 
        ? 'Standart fiyatlandırma uygun. Doluluk oranına göre dinamik fiyatlandırma yapılabilir.' 
        : 'Erken rezervasyon indirimleri sunulabilir. Uzun dönem promosyonlar planlanabilir.'
    } ${
      isInternational 
        ? 'Uluslararası uçuş için döviz kuru dalgalanmaları göz önünde bulundurulmalı.' 
        : ''
    }`,
    type: 'suggestion'
  });

  return recommendations;
};

export default function AIRecommendationsModal({ isOpen, onClose, reservation }: AIRecommendationsModalProps) {
  if (!isOpen || !reservation) return null;

  const recommendations = generateRecommendations(reservation);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {reservation.flightNumber} Numaralı Uçuş İçin AI Önerileri
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => {
            let styles = '';
            switch (rec.title) {
              case 'Doluluk Analizi':
                styles = 'bg-emerald-50 border border-emerald-100';
                break;
              case 'Sezon Analizi':
                styles = 'bg-amber-50 border border-amber-100';
                break;
              case 'Müşteri Profili':
                styles = 'bg-violet-50 border border-violet-100';
                break;
              case 'Operasyonel Öneri':
                styles = 'bg-blue-50 border border-blue-100';
                break;
              case 'Fiyatlandırma Önerisi':
                styles = 'bg-rose-50 border border-rose-100';
                break;
              default:
                styles = 'bg-gray-50 border border-gray-100';
            }

            let titleColor = '';
            switch (rec.title) {
              case 'Doluluk Analizi':
                titleColor = 'text-emerald-800';
                break;
              case 'Sezon Analizi':
                titleColor = 'text-amber-800';
                break;
              case 'Müşteri Profili':
                titleColor = 'text-violet-800';
                break;
              case 'Operasyonel Öneri':
                titleColor = 'text-blue-800';
                break;
              case 'Fiyatlandırma Önerisi':
                titleColor = 'text-rose-800';
                break;
              default:
                titleColor = 'text-gray-800';
            }

            let contentColor = '';
            switch (rec.title) {
              case 'Doluluk Analizi':
                contentColor = 'text-emerald-700';
                break;
              case 'Sezon Analizi':
                contentColor = 'text-amber-700';
                break;
              case 'Müşteri Profili':
                contentColor = 'text-violet-700';
                break;
              case 'Operasyonel Öneri':
                contentColor = 'text-blue-700';
                break;
              case 'Fiyatlandırma Önerisi':
                contentColor = 'text-rose-700';
                break;
              default:
                contentColor = 'text-gray-700';
            }

            return (
              <div 
                key={rec.title} 
                className={`p-4 rounded-lg ${styles}`}
              >
                <h3 className={`font-semibold text-lg mb-2 ${titleColor}`}>
                  {rec.title}
                </h3>
                <p className={contentColor}>{rec.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 