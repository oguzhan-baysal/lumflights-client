# LumFlights - Uçuş Rezervasyon Sistemi

Modern, güvenli ve kullanıcı dostu uçuş rezervasyon yönetim sistemi.

## 🚀 Özellikler

- **Gerçek Zamanlı İzleme**
  - Anlık rezervasyon güncellemeleri
  - Otomatik veri senkronizasyonu (10s)
  - Offline çalışma desteği

- **Akıllı Öneriler**
  - AI destekli operasyonel öneriler
  - Doluluk oranı analizi
  - Sezonsal trend analizi

- **Güvenlik**
  - Firebase Authentication
  - Rol tabanlı yetkilendirme (Admin/Staff)
  - Güvenli veri erişimi

- **Kullanıcı Deneyimi**
  - Responsive tasarım
  - Kolay navigasyon
  - Hızlı yükleme süreleri

## 🛠️ Teknolojiler

- **Frontend**
  - Next.js 13 (App Router)
  - TypeScript
  - TailwindCSS
  - React Context API

- **Backend & Veritabanı**
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Security Rules

- **Deployment**
  - Vercel
  - Firebase Hosting (alternatif)

## 🚀 Başlangıç

1. Repoyu klonlayın:
```bash
git clone https://github.com/kullaniciadi/lumflights-client.git
cd lumflights-client
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Environment değişkenlerini ayarlayın:
   - `.env.example` dosyasını `.env.local` olarak kopyalayın
   - Firebase yapılandırma değerlerini girin:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=your_api_url
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Production Build

```bash
npm run build
npm start
# veya
yarn build
yarn start
```

## 🔒 Güvenlik

- Tüm API istekleri JWT token doğrulaması gerektirir
- Firestore kuralları ile veri erişimi kontrol edilir
- Role-based access control (RBAC) uygulanmıştır

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📧 İletişim

Proje Yöneticisi - [@oguzhan-baysal](https://github.com/oguzhan-baysal)

Proje Linki: [https://github.com/oguzhan-baysal/lumflights-client](https://github.com/oguzhan-baysal/lumflights-client)
