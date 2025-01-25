import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const reservationsRef = collection(db, 'reservations');
    const snapshot = await getDocs(reservationsRef);
    
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(reservations);
  } catch (_error) {
    console.error('Rezervasyonlar yüklenirken hata:', _error);
    return NextResponse.json(
      { error: 'Rezervasyonlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    // Firestore'a kaydetme işlemi gelecek
    return NextResponse.json({ message: 'Rezervasyon oluşturuldu', data: requestData });
  } catch (_error) {
    console.error('Rezervasyon oluşturulurken hata:', _error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 