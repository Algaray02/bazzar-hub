export const CITIES_OPTIONS = [
  { value: "BANDA_ACEH", label: "Banda Aceh" },
  { value: "MEDAN", label: "Medan" },
  { value: "PADANG", label: "Padang" },
  { value: "PEKANBARU", label: "Pekanbaru" },
  { value: "BENGKULU", label: "Bengkulu" },
  { value: "PALEMBANG", label: "Palembang" },
  { value: "TANJUNG_PINANG", label: "Tanjung Pinang" },
  { value: "JAMBI", label: "Jambi" },
  { value: "BANDAR_LAMPUNG", label: "Bandar Lampung" },
  { value: "PANGKAL_PINANG", label: "Pangkal Pinang" },
  { value: "PONTIANAK", label: "Pontianak" },
  { value: "SAMARINDA", label: "Samarinda" },
  { value: "PALANGKARAYA", label: "Palangkaraya" },
  { value: "BANJARBARU", label: "Banjarbaru" },
  { value: "TANJUNG_SELOR", label: "Tanjung Selor" },
  { value: "SERANG", label: "Serang" },
  { value: "JAKARTA", label: "Jakarta" },
  { value: "BANDUNG", label: "Bandung" },
  { value: "SEMARANG", label: "Semarang" },
  { value: "YOGYAKARTA", label: "Yogyakarta" },
  { value: "SURABAYA", label: "Surabaya" },
  { value: "DENPASAR", label: "Denpasar" },
  { value: "MATARAM", label: "Mataram" },
  { value: "KUPANG", label: "Kupang" },
  { value: "MAMUJU", label: "Mamuju" },
  { value: "MAKASSAR", label: "Makassar" },
  { value: "KENDARI", label: "Kendari" },
  { value: "PALU", label: "Palu" },
  { value: "GORONTALO", label: "Gorontalo" },
  { value: "MANADO", label: "Manado" },
  { value: "AMBON", label: "Ambon" },
  { value: "SOFIFI", label: "Sofifi" },
  { value: "MANOKWARI", label: "Manokwari" },
  { value: "SORONG", label: "Sorong" },
  { value: "NABIRE", label: "Nabire" },
  { value: "JAYAWIJAYA", label: "Jayawijaya" },
  { value: "JAYAPURA", label: "Jayapura" },
  { value: "MERAUKE", label: "Merauke" },
];

export const getCityLabel = (value) => {
  const found = CITIES_OPTIONS.find((c) => c.value === value);
  return found ? found.label : "";
};

export const getCityValue = (label) => {
  if (!label) return "";

  const normalized = label.toLowerCase();

  const found = CITIES_OPTIONS.find(
    (c) => c.label.toLowerCase() === normalized
  );

  return found ? found.value : "";
};