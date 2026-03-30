export const CATEGORY_OPTIONS = [
  { value: "FOOD_BEVERAGE", label: "Makanan dan Minuman" },
  { value: "FASHION", label: "Fashion" },
  { value: "CRAFT", label: "Kerajinan" },
  { value: "BEAUTY_CARE", label: "Perawatan Kecantikan" },
  { value: "ELECTRONICS", label: "Elektronik" },
  { value: "SERVICES", label: "Layanan" },
  { value: "HOME_LIVING", label: "Perlengkapan Rumah" },
  { value: "ART_DESIGN", label: "Seni dan Desain" },
  { value: "TOYS_HOBBY", label: "Mainan dan Hobi" },
  { value: "BOOKS_STATIONERY", label: "Buku dan Alat Tulis" },
  { value: "PET_SUPPLIES", label: "Perlengkapan Hewan" },
  { value: "SPORTS_OUTDOOR", label: "Olahraga dan Outdoor" },
  { value: "AUTOMOTIVE", label: "Otomotif" },
  { value: "HEALTH_WELLNESS", label: "Kesehatan" },
  { value: "DIGITAL_PRODUCTS", label: "Produk Digital" },
  { value: "ACCESSORIES", label: "Aksesori" },
  { value: "GADGETS", label: "Gadget" },
  { value: "JEWELRY", label: "Perhiasan" },
  { value: "PLANTS_GARDEN", label: "Tanaman dan Taman" },
  { value: "KIDS_BABY", label: "Anak dan Bayi" },
  { value: "LOCAL_BRANDS", label: "Brand Lokal" },
  { value: "OTHERS", label: "Lainnya" },
];

export const getCategoryLabel = (value) => {
  const found = CATEGORY_OPTIONS.find((c) => c.value === value);
  return found ? found.label : "";
};