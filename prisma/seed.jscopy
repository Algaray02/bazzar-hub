const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// --- 1. Helper: Unsplash Collections ---
const UNSPLASH_BASE = "https://images.unsplash.com";
const CONFIG = "?w=800&q=80&auto=format&fit=crop";

const ASSETS = {
  avatars: [
    "/photo-1535713875002-d1d0cf377fde", // Pria kacamata
    "/photo-1494790108377-be9c29b29330", // Wanita tersenyum
    "/photo-1599566150163-29194dcaad36", // Pria modern
    "/photo-1438761681033-6461ffad8d80", // Wanita potret
    "/photo-1472099645785-5658abf4ff4e", // Pria casual
  ],
  events: [
    "/photo-1492684223066-81342ee5ff30", // Konser/Crowd
    "/photo-1540039155733-5bb30b53aa14", // Concert Hall
    "/photo-1511578314322-379afb476865", // Creative market
    "/photo-1531058020387-3be344556be6", // Meeting/Event
    "/photo-1505373877841-8d25f7d46678", // Tech conference
  ],
  banners: [
    "/photo-1556742046-806950914120", // Storefront
    "/photo-1441986300917-64674bd600d8", // Clothing store
    "/photo-1528698827591-e19ccd7bc23d", // Market stall
    "/photo-1601598851547-4302969d061b", // Coffee shop
    "/photo-1472851294608-415522f96385", // Luxury display
  ],
  logos: [
    "/photo-1629367494173-c78a56567877", // Abstract shape
    "/photo-1611162617474-5b21e879e113", // Digital art
    "/photo-1599305445671-ac291c95aaa9", // Minimalist logo
    "/photo-1560415755-bd80d7555eb8", // Graphic design
  ],
  payments: [
    "/photo-1554224155-8d04cb21cd6c", // Financial/Paper
    "/photo-1580048915913-4f8f5cb481c4", // Invoice pile
    "/photo-1634733988685-a91a719c2c92", // Digital payment screen
  ],
  posts: [
    "/photo-1504711434969-e33886168f5c", // News/Reading
    "/photo-1518770660439-4636190af475", // Technology
    "/photo-1432821596592-e2c18b78144f", // Blog writing
    "/photo-1557804506-669a67965ba0", // Corporate
  ],
  gallery: [
    "/photo-1511512578047-dfb367046420", // Product 1
    "/photo-1523275335684-37898b6baf30", // Product 2
    "/photo-1505740420928-5e560c06d30e", // Product 3
    "/photo-1572635196237-14b3f281e960", // Product 4
    "/photo-1560343090-f0409e92791a", // Product 5
  ],
};

// Fungsi helper untuk mengambil URL lengkap random
const getAsset = (type) => {
  const arr = ASSETS[type];
  const path = arr[Math.floor(Math.random() * arr.length)];
  return `${UNSPLASH_BASE}${path}${CONFIG}`;
};

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) =>
  arr.sort(() => 0.5 - Math.random()).slice(0, count);

// --- Constants ---
const USERS_COUNT = 10;
const EVENTS_COUNT = 6; // Perbanyak event
const POSTS_COUNT = 8;

const STORE_CATEGORIES = [
  "FOOD_BEVERAGE",
  "FASHION",
  "CRAFT",
  "BEAUTY_CARE",
  "ELECTRONICS",
  "HOME_LIVING",
  "TOYS_HOBBY",
];

const REVIEW_COMMENTS = [
  "Event nya sangat seru dan ramai!",
  "Booth ini produknya bagus-bagus.",
  "Pelayanan ramah, tapi tempat agak panas.",
  "Makanan enak banget, wajib coba!",
  "Harga terjangkau, kualitas oke.",
  "Semoga event selanjutnya lebih baik lagi.",
  "Suka banget sama dekorasi booth nya.",
  "Antrian panjang tapi worth it.",
];

async function main() {
  console.log("🌱 Starting enhanced seeding...");

  // 1. CLEANUP
  await prisma.review.deleteMany();
  await prisma.gallery.deleteMany(); // Cleanup Gallery
  await prisma.bookingScan.deleteMany(); // Cleanup Scans
  await prisma.booking.deleteMany();
  await prisma.booth.deleteMany();
  await prisma.event.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.post.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleaned.");

  // 2. CREATE USERS
  const usersData = [
    {
      name: "Super Admin",
      email: "admin@example.com",
      password: "$2b$10$iIjfBpEdMzWCjMRFCPopu.w1eeabwWJUaCsh46zRhp0xOS6dXciu6",
      role: "ADMIN",
      phone: "081234567890",
      avatar: getAsset("avatars"),
    },
    {
      name: "Seller Utama",
      email: "seller@example.com",
      password: "$2b$10$lv0mtBsrsWJ7rB8ZfMyzzeGV0JAW9Ypx4sQBofS/trs0DXpzticOO",
      role: "SELLER",
      phone: "081234567891",
      avatar: getAsset("avatars"),
    },
  ];

  for (let i = 0; i < USERS_COUNT; i++) {
    usersData.push({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: "$2b$10$JFxNo7XGgodrKR/9Ed9SHu7Z.HCN1JLPkQhwJg2Bj7m4EBmwfnTeG",
      role: "SELLER",
      phone: `081${getRandomInt(10000000, 99999999)}`,
      avatar: getAsset("avatars"),
    });
  }

  await prisma.user.createMany({ data: usersData });
  const allUsers = await prisma.user.findMany();
  console.log(`👤 Created ${allUsers.length} users.`);

  // 3. CREATE PROMOS
  await prisma.promo.createMany({
    data: [
      { code: "EARLYBIRD", amount: 50000, quota: 100, isActive: true },
      { code: "DISKON10", amount: 10000, quota: 50, isActive: true },
      { code: "FLASHSALE", amount: 20000, quota: 20, isActive: true },
    ],
  });
  const promos = await prisma.promo.findMany();

  // 4. CREATE EVENTS & BOOTHS
  const eventTypes = ["WEEKLY", "SPECIAL"];

  for (let i = 0; i < EVENTS_COUNT; i++) {
    const isPast = i % 2 === 0;
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + (isPast ? -30 : 30));

    const event = await prisma.event.create({
      data: {
        title: `Festival Kreatif ${i + 1}`,
        description: `Deskripsi event ke-${
          i + 1
        } dengan berbagai tenant menarik dan hiburan seru.`,
        location: getRandomElement([
          "JCC Senayan",
          "ICE BSD",
          "Grand Indonesia",
          "Central Park",
        ]),
        city: "Jakarta",
        date: eventDate,
        time: "10:00 - 22:00",
        type: getRandomElement(eventTypes),
        organizer: { name: "EO Pro", email: "eo@test.com" },
        image: getAsset("events"),
        highlights: ["LIVE_MUSIC", "FOOD_STALLS", "GIVEAWAY"],
      },
    });

    // Create Booths
    const boothCount = 15;
    const boothsData = [];
    for (let b = 0; b < boothCount; b++) {
      boothsData.push({
        code: crypto.randomUUID(),
        price: getRandomInt(500000, 2000000),
        eventId: event.id,
      });
    }
    await prisma.booth.createMany({ data: boothsData });
    const eventBooths = await prisma.booth.findMany({
      where: { eventId: event.id },
    });

    // 5. BOOKINGS, REVIEWS, GALLERY, SCANS
    for (const booth of eventBooths) {
      if (Math.random() > 0.3) {
        // 70% booth terisi
        const randomUser = getRandomElement(allUsers);
        const bookingStatus = getRandomElement(["PENDING", "PAID", "REJECTED"]);

        // Buat Booking
        const booking = await prisma.booking.create({
          data: {
            name: `${randomUser.name}'s Shop`,
            description: `Kami menjual produk ${getRandomElement(
              STORE_CATEGORIES
            ).toLowerCase()} berkualitas tinggi.`,
            category: getRandomElement(STORE_CATEGORIES),
            banner: getAsset("banners"),
            logo: getAsset("logos"),
            paymentProof:
              bookingStatus !== "PENDING" ? getAsset("payments") : null,
            status: bookingStatus,
            userId: randomUser.id,
            boothId: booth.id,
            promoId: Math.random() > 0.8 ? getRandomElement(promos).id : null,
            isCheckedIn: bookingStatus === "PAID" && isPast,
            checkInTime: bookingStatus === "PAID" && isPast ? new Date() : null,
          },
        });

        // 5a. Create Gallery (Jika status PAID)
        if (bookingStatus === "PAID") {
          const galleryCount = getRandomInt(3, 6);
          const galleryData = [];
          for (let g = 0; g < galleryCount; g++) {
            galleryData.push({
              bookingId: booking.id,
              url: getAsset("gallery"),
            });
          }
          await prisma.gallery.createMany({ data: galleryData });
        }

        // 5b. Create Booking Scans (Jika sudah Check-in)
        if (booking.isCheckedIn) {
          await prisma.bookingScan.create({
            data: {
              bookingId: booking.id,
              ipAddress: "192.168.1.1",
              userAgent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
              createdAt: booking.checkInTime || new Date(),
            },
          });
        }

        // 5c. Create Reviews (Diperbanyak)
        // Jika event sudah lewat dan status PAID, tambahkan review
        if (isPast && bookingStatus === "PAID") {
          const reviewCount = getRandomInt(1, 5); // 1-5 review per booking
          for (let r = 0; r < reviewCount; r++) {
            await prisma.review.create({
              data: {
                rating: getRandomInt(3, 5),
                comment: getRandomElement(REVIEW_COMMENTS),
                bookingId: booking.id,
                name: `Pengunjung ${getRandomInt(1, 100)}`, // Nama random
                createdAt: new Date(
                  new Date().getTime() - getRandomInt(0, 1000000000)
                ), // Random date
              },
            });
          }
        }
      }
    }
  }
  console.log(`🎪 Events, Bookings, Gallery & Reviews seeded.`);

  // 6. CREATE POSTS
  const postCategories = ["TIPS", "NEWS", "HIGHLIGHT", "STORY"];
  const postsData = [];

  for (let i = 0; i < POSTS_COUNT; i++) {
    postsData.push({
      title: `Tips Sukses Bazar #${i + 1}`,
      slug: `tips-sukses-${i + 1}-${Date.now()}`,
      excerpt: "Pelajari cara meningkatkan penjualan di event bazar.",
      content: "Isi artikel yang sangat informatif dan bermanfaat...",
      category: getRandomElement(postCategories),
      published: true,
      author: "Admin Content",
      avatar: getAsset("avatars"),
      image: getAsset("posts"),
    });
  }
  await prisma.post.createMany({ data: postsData });
  console.log(`📰 ${POSTS_COUNT} Posts created.`);

  // 7. CREATE CONTACT MESSAGES
  const contactMessages = [
    {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      subject: "Tanya Harga Booth",
      message: "Halo admin, apakah ada diskon untuk sewa 2 booth sekaligus?",
    },
    {
      name: "Siti Aminah",
      email: "siti@yahoo.com",
      subject: "Kerjasama Sponsorship",
      message: "Kami dari brand X ingin mengajukan proposal sponsorship.",
    },
    {
      name: "Rudi Hartono",
      email: "rudi@outlook.com",
      subject: "Kendala Login",
      message: "Saya tidak bisa login ke dashboard seller, mohon bantuannya.",
    },
    {
      name: "Dewi Lestari",
      email: "dewi@gmail.com",
      subject: "Saran Event",
      message: "Sebaiknya diadakan area khusus anak-anak di event selanjutnya.",
    },
  ];

  await prisma.contactMessage.createMany({ data: contactMessages });
  console.log(`📩 Contact messages seeded.`);

  console.log("✅ All seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
