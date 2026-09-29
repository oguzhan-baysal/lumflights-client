![Image](https://github.com/user-attachments/assets/a319c758-b92f-4e57-a405-a46d927da2d4)


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
  - Next.js 15 (App Router)
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

### Gereksinimler

- Node.js 18.18 veya üzeri (Next.js 15 `^18.18.0 || ^19.8.0 || >= 20.0.0` sürümlerini destekler)
- npm 9 veya üzeri
- Çalışan bir LumFlights rezervasyon API'si (`NEXT_PUBLIC_API_URL`)

### 1. Kurulum

```bash
git clone https://github.com/oguzhan-baysal/lumflights-client.git
cd lumflights-client
npm ci
```

`npm ci`, `package-lock.json` içinde kilitlenen sürümleri aynen kurar. Bağımlılık güncellemek için `npm install` kullanabilirsiniz.

### 2. Ortam Değişkenleri

Proje kökünde `.env.local` dosyası oluşturun. Bu değişkenler tanımlanmadan uygulama derlenmez:

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Rezervasyon API'sinin taban adresi (örn. `http://localhost:8080`). `/reservations`, `/reservations/admin`, `/reservations/seed` ve `/reservations/seed-users` uç noktaları bu adrese eklenir. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase konsolundaki **Project settings → Your apps → Web app** bölümünden alınan web uygulaması yapılandırması. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Aynı web uygulamasının `authDomain` değeri. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase proje kimliği. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Aynı web uygulamasının `storageBucket` değeri. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Aynı web uygulamasının `messagingSenderId` değeri. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Aynı web uygulamasının `appId` değeri. |

> **Not:** `NEXT_PUBLIC_FIREBASE_API_KEY` boş kalırsa `npm run build` şu hatayla durur: `FirebaseError: Firebase: Error (auth/invalid-api-key)`. Derlemeden önce dosyanın doldurulduğundan emin olun. `.env.local` `.gitignore` içinde olduğu için repoya eklenmez.

### 3. Geliştirme Sunucusu

```bash
npm run dev
```

Ardından http://localhost:3000 adresini açın.

### 4. Production Build (Statik Export)

```bash
npm run build
```

`next.config.ts` içinde `output: 'export'` ayarlı olduğu için build, statik çıktıyı `out/` dizinine yazar. Bu yapılandırmada `npm run start` çalışmaz ve `"next start" does not work with "output: export" configuration` hatasını verir. Statik çıktıyı yerelde denemek için:

```bash
npx serve@latest out
```

### 5. Yayına Alma

- **Firebase Hosting:** `npm run deploy` komutu önce `npm run build`, ardından `firebase deploy` çalıştırır. `firebase.json` hosting kökü olarak `out/` dizinini kullanır ve `.firebaserc` projeyi `lumflights` olarak tanımlar.
- **Vercel:** Repoyu Vercel projesine bağlayın ve `.env.local` içindeki değişkenleri Vercel proje ayarlarına ekleyin.

### Bilinen Sınırlama

`output: 'export'` ile Next.js middleware desteklenmez; `npm run dev` ve `npm run build` çıktısında `Middleware cannot be used with "output: export"` uyarısı görünür. Yani `src/middleware.ts` içindeki `/dashboard`, `/reservations` ve `/login` yönlendirmeleri statik olarak yayınlanan sürümde çalışmaz.

## 🔑 Demo Hesapları

Uygulamayı test etmek için aşağıdaki hesapları kullanabilirsiniz:

```plaintext
Admin Hesabı:
- Email    : admin@lumflights.com
- Password : Admin123!

Staff Hesabı:
- Email    : staff@lumflights.com
- Password : Staff123!

Test Staff Hesapları:
- Email    : staff1@lumflights.com (staff2, staff3, ...)
- Password : Staff123!

Not: Bu hesaplar sadece demo amaçlıdır ve periyodik olarak sıfırlanabilir.
```
