export const HIGHLIGHT_OPTIONS = [
  { value: "LIVE_MUSIC", label: "Live Music" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "FOOD_STALLS", label: "Food Stalls" },
  { value: "FASHION_MARKET", label: "Fashion Market" },
  { value: "HANDICRAFT", label: "Kerajinan Tangan" },
  { value: "TALKSHOW", label: "Talkshow" },
  { value: "COMMUNITY_EVENT", label: "Komunitas" },
  { value: "PHOTOBOOTH", label: "Photobooth" },
  { value: "GIVEAWAY", label: "Giveaway" },
  { value: "DISCOUNT", label: "Diskon Spesial" },
  { value: "KIDS_AREA", label: "Kids Area" },
  { value: "MERCH_SALE", label: "Merchandise" },
  { value: "ART_EXHIBITION", label: "Pameran Seni" },
  { value: "CULINARY_FEST", label: "Festival Kuliner" },
  { value: "SPORT_ACTIVITY", label: "Aktivitas Olahraga" },
  { value: "COOKING_DEMO", label: "Demo Memasak" },
  { value: "MEET_CREATOR", label: "Meet & Greet" },
  { value: "PETS_AREA", label: "Pet Area" },
  { value: "CAR_FREE_DAY", label: "Car Free Day" },
  { value: "MARKETPLACE", label: "Marketplace UMKM" },
];

export const getHighlightLabel = (value) => {
  const found = HIGHLIGHT_OPTIONS.find((c) => c.value === value);
  return found ? found.label : "";
};