'use client';

import { auth } from '@/lib/firebase';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);

      if (!auth.currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const token = await auth.currentUser.getIdToken(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/seed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Seed sonucu:', result);
      toast.success('Mock veriler başarıyla oluşturuldu');
      window.location.reload();
    } catch (error) {
      console.error('Seed hatası:', error);
      toast.error('Mock veri oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 ml-2"
    >
      {loading ? 'Veriler Oluşturuluyor...' : 'Mock Veri Oluştur'}
    </button>
  );
} 