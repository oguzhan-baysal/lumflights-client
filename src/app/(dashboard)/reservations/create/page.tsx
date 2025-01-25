'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface PassengerForm {
  name: string;
  email: string;
}

export default function CreateReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    flightNumber: '',
    departureDate: '',
    arrivalDate: '',
    passengers: [{ name: '', email: '' }]
  });

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      passengers: [...prev.passengers, { name: '', email: '' }]
    }));
  };

  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData(prev => ({ ...prev, passengers: newPassengers }));
  };

  const removePassenger = (index: number) => {
    if (formData.passengers.length > 1) {
      setFormData(prev => ({
        ...prev,
        passengers: prev.passengers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kullanıcı kontrolü
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      // Token'ı yenileyelim
      const token = await currentUser.getIdToken(true);

      const response = await fetch('http://localhost:3001/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          departureDate: new Date(formData.departureDate).toISOString(),
          arrivalDate: new Date(formData.arrivalDate).toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error('Rezervasyon oluşturulamadı');
      }

      toast.success('Rezervasyon başarıyla oluşturuldu');
      router.push('/reservations');
    } catch (error) {
      console.error('Rezervasyon oluşturma hatası:', error);
      toast.error('Rezervasyon oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Rezervasyon</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Uçuş Numarası</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.flightNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kalkış Tarihi</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.departureDate}
              onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Varış Tarihi</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.arrivalDate}
              onChange={(e) => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Yolcular</h2>
            <button
              type="button"
              onClick={addPassenger}
              className="text-blue-600 hover:text-blue-700"
            >
              + Yolcu Ekle
            </button>
          </div>

          {formData.passengers.map((passenger, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Yolcu {index + 1}</h3>
                {formData.passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Kaldır
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İsim</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={passenger.email}
                    onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Rezervasyon Oluştur'}
        </button>
      </form>
    </div>
  );
} 