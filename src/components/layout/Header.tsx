'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Ana sayfaya yönlendir
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/light-logo.svg" 
            alt="LumFlights Logo" 
            width={156}
            height={34}
            priority
          />
        </Link>

        <nav className="flex items-center gap-4">
          {user && (
            <>
              <Link 
                href="/dashboard" 
                className={`${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-700`}
              >
                Dashboard
              </Link>
              <Link 
                href="/reservations" 
                className={`${isActive('/reservations') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-700`}
              >
                Rezervasyonlar
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700"
              >
                Çıkış Yap
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 