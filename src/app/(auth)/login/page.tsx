'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Giriş hatası:', error);
      toast.error('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
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

      {/* Login Form */}
      <div className="relative w-full max-w-md p-8">
        <div className="text-3xl font-bold text-gray-900 text-center mb-8">LUMIN</div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Giriş Yap</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                           focus:ring-2 focus:ring-[#E11D48] focus:border-transparent 
                           transition-all duration-300
                           text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                           focus:ring-2 focus:ring-[#E11D48] focus:border-transparent 
                           transition-all duration-300
                           text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E11D48] text-white py-3 rounded-lg text-lg font-semibold
                       hover:bg-[#BE123C] transition-all duration-300 
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 