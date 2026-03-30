// ==========================================
// MOCK DATA FACTORY - BAZZARHUB
// ==========================================

// --- 1. USERS ---
export const MOCK_USERS = [
  {
    id: "user_1",
    name: "Ani Susanti",
    email: "ani@owner.com",
    phone: "081234567890",
    role: "SELLER",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "user_2",
    name: "Budi Santoso",
    email: "budi@craft.com",
    phone: "081298765432",
    role: "SELLER",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    createdAt: new Date("2025-02-20"),
  },
  {
    id: "user_3",
    name: "Citra Lestari",
    email: "citra@fashion.com",
    phone: "081345678901",
    role: "SELLER",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "user_4",
    name: "Doni Pratama",
    email: "doni@tech.com",
    phone: "081900001111",
    role: "SELLER",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    createdAt: new Date("2025-04-05"),
  },
  {
    id: "user_admin",
    name: "Super Admin",
    email: "admin@bazzarhub.com",
    phone: null,
    role: "ADMIN",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date("2025-01-01"),
  },
];

// --- 2. PROMOS ---
export const MOCK_PROMOS = [
  {
    id: "promo_1",
    code: "EARLYBIRD50",
    amount: 50000,
    quota: 100,
    isActive: true,
  },
  {
    id: "promo_2",
    code: "MERDEKA17",
    amount: 17000,
    quota: 0, // Habis
    isActive: false,
  },
  {
    id: "promo_3",
    code: "NEWSELLER",
    amount: 100000,
    quota: 10,
    isActive: true,
  },
  {
    id: "promo_4",
    code: "FLASH1212",
    amount: 25000,
    quota: 50,
    isActive: true,
  },
  {
    id: "promo_5",
    code: "COMMUNITY",
    amount: 15000,
    quota: 200,
    isActive: true,
  },
];

// --- 3. EVENTS (Include Booths & Bookings Relation) ---
export const MOCK_EVENTS = [
  {
    id: "evt_1",
    title: "CFD Sudirman Fest",
    description:
      "Event mingguan di jantung kota Jakarta saat Car Free Day. Cocok untuk F&B dan Fashion olahraga.",
    location: "Jl. Jend Sudirman, Jakarta",
    city: "Jakarta Pusat",
    date: new Date("2025-12-15T06:00:00Z"),
    time: "06:00 - 11:00 WIB",
    type: "WEEKLY",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",

    organizer: {
      name: "Pemprov DKI",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop",
      verified: true,
    },

    // Enum Array
    highlights: ["LIVE_MUSIC", "FOOD_STALLS", "SPORT_ACTIVITY", "CAR_FREE_DAY"],

    rundown: [
      { time: "05:30", activity: "Persiapan Tenant" },
      { time: "06:00", activity: "Senam Bersama" },
      { time: "08:00", activity: "Live Accoustic" },
      { time: "11:00", activity: "Closing" },
    ],
    faq: [
      {
        q: "Apakah boleh bawa genset?",
        a: "Tidak boleh, listrik disediakan panitia.",
      },
      { q: "Loading barang jam berapa?", a: "Maksimal jam 05:00 WIB." },
    ],

    // Nested Booths (Simulasi hasil include: booths)
    booths: [
      {
        id: "b_1_1",
        code: "A-01",
        price: 350000,
        booking: {
          id: "bk_1",
          status: "PAID",
          category: "FOOD_BEVERAGE",
          name: "Kopi Kenangan Mini",
          user: MOCK_USERS[0],
        },
      },
      {
        id: "b_1_2",
        code: "A-02",
        price: 350000,
        booking: {
          id: "bk_2",
          status: "PENDING",
          category: "FOOD_BEVERAGE",
          name: "Sate Taichan",
          user: MOCK_USERS[1],
        },
      },
      { id: "b_1_3", code: "A-03", price: 350000, booking: null },
      { id: "b_1_4", code: "B-01", price: 500000, booking: null },
      { id: "b_1_5", code: "B-02", price: 500000, booking: null },
    ],

    createdAt: new Date("2025-11-01"),
  },
  {
    id: "evt_2",
    title: "Jakarta Creative Week 2025",
    description:
      "Pekan raya industri kreatif terbesar. Menghadirkan ratusan jenama lokal dari fashion hingga kriya.",
    location: "JCC Senayan",
    city: "Jakarta Selatan",
    date: new Date("2025-12-20T10:00:00Z"),
    time: "10:00 - 22:00 WIB",
    type: "SPECIAL",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",

    organizer: {
      name: "Kemenparekraf",
      avatar:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&fit=crop",
      verified: true,
    },

    highlights: ["FASHION_MARKET", "TALKSHOW", "WORKSHOP", "ART_EXHIBITION"],

    rundown: [
      { time: "10:00", activity: "Opening Ceremony" },
      { time: "13:00", activity: "Talkshow: Go Digital" },
      { time: "19:00", activity: "Guest Star Performance" },
    ],
    faq: [],

    booths: [
      {
        id: "b_2_1",
        code: "VIP-1",
        price: 2500000,
        booking: {
          id: "bk_3",
          status: "PAID",
          category: "FOOD_BEVERAGE",
          name: "Batik Keris",
          user: MOCK_USERS[2],
        },
      },
      { id: "b_2_2", code: "VIP-2", price: 2500000, booking: null },
      { id: "b_2_3", code: "REG-1", price: 1000000, booking: null },
      { id: "b_2_4", code: "REG-2", price: 1000000, booking: null },
      { id: "b_2_5", code: "REG-3", price: 1000000, booking: null },
    ],

    createdAt: new Date("2025-11-05"),
  },
  {
    id: "evt_3",
    title: "Pasar Minggu Ria",
    description: "Bazar komunitas warga. Santai, murah meriah, dan guyub.",
    location: "Taman Kota Tebet",
    city: "Jakarta Selatan",
    date: new Date("2025-12-22T07:00:00Z"),
    time: "07:00 - 15:00 WIB",
    type: "WEEKLY",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",

    organizer: {
      name: "Komunitas Tebet",
      avatar: "https://github.com/shadcn.png",
      verified: false,
    },

    highlights: ["COMMUNITY_EVENT", "FOOD_STALLS", "KIDS_AREA", "PETS_AREA"],
    rundown: [],
    faq: [],

    booths: [
      { id: "b_3_1", code: "T-01", price: 150000, booking: null },
      { id: "b_3_2", code: "T-02", price: 150000, booking: null },
      { id: "b_3_3", code: "T-03", price: 150000, booking: null },
      { id: "b_3_4", code: "T-04", price: 150000, booking: null },
      { id: "b_3_5", code: "T-05", price: 150000, booking: null },
    ],

    createdAt: new Date("2025-11-10"),
  },
  {
    id: "evt_4",
    title: "Tech & Gadget Expo",
    description:
      "Pameran gadget dan aksesoris teknologi terlengkap akhir tahun.",
    location: "ICE BSD",
    city: "Tangerang",
    date: new Date("2026-01-10T10:00:00Z"),
    time: "10:00 - 21:00 WIB",
    type: "SPECIAL",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",

    organizer: { name: "IndoTech", avatar: null, verified: true },
    highlights: ["GADGETS", "DISCOUNT", "GIVEAWAY"],
    rundown: [],
    faq: [],
    booths: [], // Belum ada booth (Simulasi event baru launch)
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "evt_5",
    title: "Festival Kuliner Malam",
    description:
      "Surga makanan malam hari. Sate, Nasi Goreng, Martabak, semua ada!",
    location: "Pasar Modern Bintaro",
    city: "Tangerang Selatan",
    date: new Date("2025-12-25T18:00:00Z"),
    time: "18:00 - 24:00 WIB",
    type: "WEEKLY",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",

    organizer: { name: "PasMod Management", avatar: null, verified: true },
    highlights: ["CULINARY_FEST", "FOOD_STALLS"],
    rundown: [],
    faq: [],
    booths: Array.from({ length: 20 }).map((_, i) => ({
      id: `b_5_${i}`,
      code: `K-${i + 1}`,
      price: 200000,
      booking: null,
    })),
    createdAt: new Date("2025-11-15"),
  },
];

// --- 4. BOOKINGS (Detail Transaksi) ---
// Simulasi: include: { user: true, booth: { include: { event: true } }, promo: true }
export const MOCK_BOOKINGS = [
  {
    id: "bk_1",
    name: "Kopi Kenangan Mini",
    description: "Kopi kekinian dengan rasa otentik.",
    banner:
      "https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80",
    logo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    category: "FOOD_BEVERAGE",
    status: "PAID",
    paymentProof: "https://placehold.co/400x600?text=Bukti+Transfer",
    ticketCode: "TIK-CFD-001",
    isCheckedIn: false,

    // Relations
    userId: "user_1",
    user: MOCK_USERS[0],

    boothId: "b_1_1",
    booth: {
      id: "b_1_1",
      code: "A-01",
      price: 350000,
      eventId: "evt_1",
      event: {
        // Nested Event untuk UI Card
        id: "evt_1",
        title: "CFD Sudirman Fest",
        date: new Date("2025-12-15T06:00:00Z"),
        city: "Jakarta",
        location: "Jl. Jend Sudirman",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      },
    },

    createdAt: new Date("2025-12-01T08:00:00Z"),
  },
  {
    id: "bk_2",
    name: "Sate Taichan Senayan",
    description: "Pedasnya nampol, dagingnya empuk.",
    banner: null,
    logo: null,
    category: "FOOD_BEVERAGE",
    status: "PENDING",
    paymentProof: "https://placehold.co/400x600?text=Bukti+Transfer+2",
    ticketCode: "TIK-PENDING",
    isCheckedIn: false,

    userId: "user_2",
    user: MOCK_USERS[1],

    boothId: "b_1_2",
    booth: {
      id: "b_1_2",
      code: "A-02",
      price: 350000,
      eventId: "evt_1",
      event: {
        id: "evt_1",
        title: "CFD Sudirman Fest",
        date: new Date("2025-12-15T06:00:00Z"),
        location: "Jl. Jend Sudirman",
        city: "Jakarta",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      },
    },
    createdAt: new Date("2025-12-02T10:00:00Z"),
  },
  {
    id: "bk_3",
    name: "Batik Keris",
    description: "Warisan budaya nusantara.",
    banner: null,
    logo: null,
    category: "FASHION",
    status: "PAID",
    paymentProof: "https://placehold.co/400x600?text=Bukti+Lunas",
    ticketCode: "TIK-JCW-999",
    isCheckedIn: true, // Sudah datang

    userId: "user_3",
    user: MOCK_USERS[2],

    boothId: "b_2_1",
    booth: {
      id: "b_2_1",
      code: "VIP-1",
      price: 2500000,
      eventId: "evt_2",
      event: {
        id: "evt_2",
        title: "Jakarta Creative Week 2025",
        date: new Date("2025-12-20T10:00:00Z"),
        location: "JCC Senayan",
        city: "Jakarta",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      },
    },
    createdAt: new Date("2025-12-05T14:00:00Z"),
  },
  {
    id: "bk_4",
    name: "Gadget Store ID",
    description: "Aksesoris HP murah meriah.",
    category: "GADGETS",
    status: "REJECTED", // Contoh ditolak
    paymentProof: null,
    ticketCode: null,
    isCheckedIn: false,

    userId: "user_4",
    user: MOCK_USERS[3],

    boothId: null, // Kalau rejected biasanya booth dilepas
    createdAt: new Date("2025-12-06"),
  },
  {
    id: "bk_5",
    name: "Es Teh Solo",
    description: "Seger buger.",
    category: "FOOD_BEVERAGE",
    status: "PAID",
    paymentProof: null,
    ticketCode: "TIK-CFD-005",
    isCheckedIn: false,

    userId: "user_1",
    user: MOCK_USERS[0],
    boothId: "b_1_3", // Asumsi dia ambil booth lain di event 1
    booth: {
      id: "b_1_3",
      code: "A-03",
      price: 350000,
      eventId: "evt_1",
      event: {
        id: "evt_1",
        title: "CFD Sudirman Fest",
        date: new Date("2025-12-15T06:00:00Z"),
        location: "Jl. Jend Sudirman",
        city: "Jakarta",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      },
    },
    createdAt: new Date("2025-12-03"),
  },
];

// --- 5. REVIEWS ---
export const MOCK_REVIEWS = [
  {
    id: "rev_1",
    name: "Pengunjung Happy",
    rating: 5,
    comment: "Kopinya enak, pelayanan ramah!",
    bookingId: "bk_1",
    createdAt: new Date("2025-12-16"),
  },
  {
    id: "rev_2",
    name: "Netizen",
    rating: 4,
    comment: "Antrian agak panjang, tapi worth it.",
    bookingId: "bk_1",
    createdAt: new Date("2025-12-16"),
  },
  {
    id: "rev_3",
    name: null, // Guest anonim
    rating: 5,
    comment: "Batiknya bagus-bagus banget.",
    bookingId: "bk_3",
    createdAt: new Date("2025-12-21"),
  },
  {
    id: "rev_4",
    name: "Food Vlogger",
    rating: 3,
    comment: "Rasanya standar aja.",
    bookingId: "bk_2",
    createdAt: new Date("2025-12-16"),
  },
  {
    id: "rev_5",
    name: "Sinta",
    rating: 5,
    comment: "Recommended seller!",
    bookingId: "bk_3",
    createdAt: new Date("2025-12-21"),
  },
];

// --- 6. MESSAGES ---
export const MOCK_MESSAGES = [
  {
    id: "msg_1",
    name: "Rina Organizer",
    email: "rina@eo.com",
    subject: "Kerjasama Event",
    message:
      "Halo, saya ingin mendaftarkan event besar di BSD. Ada paket khusus?",
    status: "UNREAD",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "msg_2",
    name: "Budi Seller",
    email: "budi@gmail.com",
    subject: "Gagal Upload Bukti",
    message: "Kenapa saya tidak bisa upload gambar ya? Error terus.",
    status: "READ",
    createdAt: new Date("2025-11-28"),
  },
  {
    id: "msg_3",
    name: "Siti",
    email: "siti@yahoo.com",
    subject: "Refund",
    message: "Saya mau cancel booking, bagaimana refundnya?",
    status: "ARCHIVED",
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "msg_4",
    name: "Joko",
    email: "joko@eo.com",
    subject: "Fitur Statistik",
    message: "Fitur statistik sangat membantu, terima kasih!",
    status: "READ",
    createdAt: new Date("2025-12-05"),
  },
  {
    id: "msg_5",
    name: "Anonim",
    email: "no-reply@test.com",
    subject: "Spam Test",
    message: "Just testing.",
    status: "ARCHIVED",
    createdAt: new Date("2025-10-10"),
  },
];

// --- 7. BLOG POSTS ---
export const MOCK_POSTS = [
  {
    id: "post_1",
    title: "5 Tips Booth Ramai Pengunjung",
    slug: "tips-booth-ramai",
    excerpt: "Rahasia psikologi warna dan penataan display.",
    content: "Isi artikel panjang...",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    category: "TIPS",
    published: true,
    author: "Admin",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date("2025-11-01"),
  },
  {
    id: "post_2",
    title: "Highlight: Keseruan CFD Kemarin",
    slug: "highlight-cfd",
    excerpt: "Ribuan orang memadati jalan Sudirman.",
    content: "Foto-foto dokumentasi...",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    category: "HIGHLIGHT",
    published: true,
    author: "Admin",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date("2025-11-16"),
  },
  {
    id: "post_3",
    title: "Tren Kuliner 2026",
    slug: "tren-kuliner-2026",
    excerpt: "Apa yang bakal viral tahun depan?",
    content: "Prediksi makanan...",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    category: "NEWS",
    published: true,
    author: "Sarah (Editor)",
    avatar: "https://i.pravatar.cc/150?u=5",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "post_4",
    title: "Cara Foto Produk Pakai HP",
    slug: "foto-produk-hp",
    excerpt: "Gak perlu kamera mahal untuk hasil pro.",
    content: "Tutorial...",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    category: "TIPS",
    published: false, // Draft
    author: "Admin",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date("2025-12-05"),
  },
  {
    id: "post_5",
    title: "Recap: Jakarta Creative Week",
    slug: "recap-jcw",
    excerpt: "Event terbesar tahun ini sukses digelar.",
    content: "Berita lengkap...",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    category: "HIGHLIGHT",
    published: true,
    author: "Admin",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date("2025-12-21"),
  },
];
