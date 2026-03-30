import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRupiahShort(value) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "jt";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "rb";
  }
  return String(value);
}
