# 📂 BazzarHub: Platform Manajemen Event & Booking UMKM

**BazzarHub** adalah aplikasi web berbasis Next.js yang menghubungkan **Event Organizer (Admin)** dengan **UMKM (Seller)**. Aplikasi ini mendigitalkan proses penyewaan _booth_ (lapak) pameran yang selama ini sering dilakukan secara manual, menjadi sistem yang otomatis, transparan, dan _real-time_.

---

## 🛠️ 1. Tech Stack (Teknologi yang Digunakan)

Aplikasi ini dibangun dengan arsitektur modern (**Bleeding Edge**) yang mengutamakan performa dan skalabilitas.

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) - Menggunakan Server Components & Server Actions.
- **Language:** JavaScript / React.
- **Database:** PostgreSQL (via [Supabase](https://supabase.com/)).
- **ORM:** [Prisma](https://www.prisma.io/) - Untuk interaksi database yang type-safe.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (Komponen UI modern).
- **Auth:** [NextAuth.js (v5)](https://authjs.dev/) - Login via Google & Credentials.
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/).
- **AI:** Google Gemini (Generative AI & Vision).
- **State Management:** TanStack Query (untuk client-side fetching) & Server Actions (untuk mutasi).

---

## 🔗 2. Arsitektur Database & Relasi

Struktur database menggunakan **PostgreSQL** yang dikelola oleh **Prisma**. Inti dari aplikasi ini adalah "Segitiga Emas": **Event - Booth - Booking**.

### **A. Entitas Utama**

1. **User:** Pengguna sistem (bisa Admin atau Seller).
2. **Event:** Acara bazar (Wadah).
3. **Booth:** Slot/Lapak yang dijual (Inventaris).
4. **Booking:** Transaksi penyewaan (Bukti Kepemilikan).

### **B. Penjelasan Relasi (ERD)**

1. **Event ↔ Booth (One-to-Many)**

   - _Logika:_ Satu Event memiliki banyak Booth.
   - _Fungsi:_ Menentukan **Kuota/Limit Slot**. Jika Admin membuat 50 data Booth untuk Event A, maka kuota Event A adalah 50. Tidak ada kolom angka manual.

2. **Booth ↔ Booking (One-to-One) 🔥 [CRITICAL]**

   - _Logika:_ Satu Booth hanya bisa memiliki SATU Booking aktif.
   - _Constraint:_ Field `boothId` di tabel `Booking` bersifat `@unique`.
   - _Fungsi:_ Mencegah **Double Booking**. Jika Booth A1 sudah dibooking (status PENDING/PAID), database akan menolak booking baru untuk A1.

3. **User ↔ Booking (One-to-Many)**

   - _Logika:_ Satu Seller bisa memiliki banyak histori Booking.

4. **Booking ↔ Review (One-to-Many)**
   - _Logika:_ Review terikat pada transaksi Booking. Hanya orang yang sudah booking (dan PAID) yang idealnya memberikan review.

---

## 👥 3. User Roles & Alur Pengguna

Aplikasi membagi pengguna menjadi tiga kategori akses:

### **1. GUEST (Pengunjung Umum / Unauthenticated)**

- **Akses:** Halaman Publik (`/`, `/event`, `/tenant`, `/blog`, `/contact`).
- **Aktivitas:**
  - Melihat daftar event yang akan datang.
  - Melihat detail event (tanpa harga booth).
  - Melihat leaderboard tenant (UMKM terpopuler).
  - Membaca artikel blog.
  - Menghubungi admin via form kontak.

### **2. SELLER (UMKM / Authenticated)**

- **Akses:** Halaman Seller Dashboard (`/seller/...`).
- **Aktivitas Utama:**
  - **Register & Login:** Membuat akun toko.
  - **Explore & Booking:** Melihat event, memilih booth tersedia, mengisi form booking (Nama Toko, Kategori), dan mengupload bukti transfer.
  - **Manage Profile:** Mengatur profil toko (Logo, Banner, Deskripsi).
  - **AI Magic Write:** Menggunakan AI untuk membuat deskripsi toko otomatis.
  - **Tiket QR:** Mendapatkan QR Code tiket masuk setelah status `PAID`.

### **3. ADMIN (Event Organizer / Superuser)**

- **Akses:** Halaman Admin Dashboard (`/admin/...`).
- **Aktivitas Utama:**
  - **Manajemen Event:** Membuat, mengedit, menghapus Event.
  - **Manajemen Booth:** Men-generate booth secara massal (misal: A1-A50) untuk menentukan kuota event.
  - **Verifikasi Booking:** Menerima (`PAID`) atau Menolak (`REJECTED`) booking seller. Menggunakan **AI Vision** untuk cek keaslian bukti transfer.
  - **Manajemen User:** Memantau list user dan seller.
  - **Scan Tiket:** Memindai QR Code seller saat hari-H (Check-in).
  - **Manajemen Konten:** Menulis artikel blog dan membalas pesan kontak.

---

## 📖 4. Peta Situs & Penjelasan Halaman

Berikut adalah sitemap lengkap aplikasi BazzarHub:

### **A. Public Pages (Akses Semua)**

1. **`/` (Landing Page):** Hero section, highlight event, testimoni, dan CTA.
2. **`/event` (Event Catalog):** List semua event dengan filter (Mingguan/Spesial, Kota).
3. **`/event/[id]` (Event Detail):** Informasi lengkap event (Deskripsi, Rundown, FAQ) dan daftar tenant yang sudah bergabung.
4. **`/tenant` (Tenant Leaderboard):** Daftar UMKM terbaik berdasarkan rating & review.
5. **`/tenant/[id]` (Tenant Profile):** Halaman profil toko UMKM (Galeri produk, Review).
6. **`/blog` & `/blog/[id]`:** Artikel tips & trik untuk seller.
7. **`/contact`:** Form untuk menghubungi admin.

### **B. Auth Pages**

1. **`/auth/login`:** Login form (Email/Pass atau Google).
2. **`/auth/register`:** Pendaftaran seller baru.

### **C. Seller Dashboard (Protected: Seller Only)**

1. **`/seller/dashboard`:** Pusat kontrol Seller. Menggunakan layout **Tabs**:
   - **Overview:** Statistik (Total Scan, Pengeluaran, Rating).
   - **Booking:** Status booking aktif (Pending/Paid) dan akses Tiket QR.
   - **Explore:** Mencari event baru untuk dibooking.
   - **Profile:** Preview tampilan toko di mata publik.

### **D. Admin Dashboard (Protected: Admin Only)**

1. **`/admin` (Overview):** Grafik pendapatan, total user, dan aktivitas terbaru.
2. **`/admin/events`:** CRUD Event.
3. **`/admin/events/[id]`:** Detail Event & **Booth Manager** (Tambah/Hapus Slot Booth).
4. **`/admin/events/[id]/scan`:** Halaman khusus untuk scan QR check-in seller.
5. **`/admin/bookings`:** Daftar booking masuk. Tempat Admin memverifikasi bukti bayar.
6. **`/admin/users`:** Database seluruh pengguna.
7. **`/admin/blogs`:** CMS sederhana untuk menulis artikel.
8. **`/admin/messages`:** Inbox pesan dari halaman Contact.
9. **`/admin/settings`:** Pengaturan akun dan konfigurasi sistem.

---

## ⚙️ 5. Alur Bisnis Utama (The Core Flow)

Inilah bagaimana sistem bekerja dari hulu ke hilir:

### **Fase 1: Persiapan (Admin)**

1. Admin membuat **Event Baru** (misal: "Pesta Rakyat").
2. Di halaman detail event, Admin melakukan **Generate Booth** (misal: 50 Booth, Kode A1-A50, Harga Rp 500rb).
   - _Status Database:_ 50 baris data Booth tercipta. Status `booking` kosong (Available).

### **Fase 2: Transaksi (Seller)**

1. Seller login dan melihat event "Pesta Rakyat".
2. Seller melihat **Daftar Booth**. Booth A1-A50 berwarna Hijau (Available).
3. Seller memilih **Booth A1** dan klik "Book Now".
4. Seller mengisi form (Nama Toko, Kategori, Upload Bukti Transfer).
5. Seller submit.
   - _Status Database:_ Tercipta data `Booking` baru dengan status `PENDING`.
   - _Efek:_ Booth A1 sekarang memiliki relasi ke Booking tersebut. Warnanya berubah jadi Kuning/Merah (Booked) bagi orang lain. Tidak bisa diambil lagi.

### **Fase 3: Verifikasi (Admin)**

1. Admin membuka menu **Bookings**. Muncul notifikasi "1 Booking Pending".
2. Admin melihat detail booking Seller A. Admin mengecek bukti transfer (bisa pakai bantuan AI).
3. **Jika Sah:** Admin klik **"Terima"**. Status berubah jadi `PAID`.
4. **Jika Palsu:** Admin klik **"Tolak"**. Status berubah jadi `REJECTED` **DAN** data booking dihapus/diputus relasinya agar Booth A1 kembali Hijau (Available) untuk orang lain.

### **Fase 4: Pelaksanaan (On-Site)**

1. Seller membuka dashboard, status sudah `PAID`. Muncul tombol **"Tiket Masuk"**.
2. Seller datang ke lokasi, menunjukkan **QR Code** di HP.
3. Admin/Panitia membuka halaman **Scan**, memindai QR Seller.
4. Sistem memvalidasi dan mencatat jam kehadiran (`checkInTime`).

---

## 🤖 6. Fitur Spesial (AI & Automation)

1. **Magic Write (Seller):**

   - Seller malas nulis deskripsi toko? Cukup klik "Generate AI".
   - Gemini AI akan membuatkan deskripsi menarik berdasarkan Nama & Kategori Toko.

2. **Receipt Scanner (Admin):**

   - Admin tidak perlu menyipitkan mata baca struk buram.
   - Gemini Vision membaca nominal & tanggal di struk dan mencocokkan dengan harga booth.

3. **Post Analysis (System):**
   - Mencocokan konten postingan yang memiliki keterkaitan secara otomatis.
   - Gemini mencocokan postingan yang sedang tampil dengan postingan yang ada di database, kemudian menyarankan pada Guest untuk melihat postingan yang dia rekomendasikan.

---

## Instalasi & Setup

### Prerequisites

- Node.js (versi 18.17 atau lebih baru)
- npm atau yarn
- PostgreSQL (untuk database lokal atau Supabase)
- Git

### Langkah-langkah Instalasi

1. **Clone Repository**

   ```bash
   git clone [https://github.com/ahmadchoms/event-bazzar-hub.git](https://github.com/ahmadchoms/event-bazzar-hub.git)
   cd event-bazzar-hub
   ```

````

2.  **Install Dependencies**

    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Setup Database**

    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema ke Database
    npx prisma db push

    # (Opsional) Seeding data awal
    npx prisma db seed
    ```

4.  **Environment Variables**
    Salin file `.env.example` ke `.env` dan isi dengan nilai yang sesuai:

    ```env
    # Database (Supabase / Local)
    DATABASE_URL="postgresql://..."
    DIRECT_URL="postgresql://..."

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-here"

    # Google OAuth (Opsional - untuk Login Google)
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"

    # AI Integration (Gemini)
    GOOGLE_API_KEY="your-gemini-api-key"

    # Storage (Supabase Storage)
    NEXT_PUBLIC_SUPABASE_URL="[https://your-project.supabase.co](https://your-project.supabase.co)"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
    ```

5.  **Jalankan Development Server**

    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.

## Lisensi

MIT License

Copyright (c) 2025 Event Bazzar Hub

-----

**© 2025 Event Bazzar Hub. Hak Cipta Dilindungi.**
Dibangun dengan ❤️ untuk komunitas UMKM Indonesia
````
