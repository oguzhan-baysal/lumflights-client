'use client';

import { auth } from '@/lib/firebase';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SeedUsersButton() {
  const [loading, setLoading] = useState(false);

  const handleSeedUsers = async () => {
    try {
      setLoading(true);

      if (!auth.currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const token = await auth.currentUser.getIdToken(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/seed-users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Kullanıcı oluşturma sonucu:', result);
      toast.success('Test kullanıcıları başarıyla oluşturuldu');
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      toast.error('Kullanıcılar oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeedUsers}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
    >
      {loading ? 'Kullanıcılar Oluşturuluyor...' : 'Test Kullanıcıları Oluştur'}
    </button>
  );
} 