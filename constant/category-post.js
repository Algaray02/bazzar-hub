export const POST_CATEGORIES = [
  { value: "TIPS", label: "Tips Seller" },
  { value: "NEWS", label: "Berita" },
  { value: "HIGHLIGHT", label: "Sorotan" },
  { value: "STORY", label: "Cerita" },
];

export const getCategoryPost = (value) => {
  const found = POST_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : "";
};