import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const currencyRates: Record<string, number> = {
  EUR: 1,
  USD: 1.17,
  GBP: 0.87,
  CHF: 0.94,
  JPY: 172.26,
};

export const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
  JPY: "¥",
};