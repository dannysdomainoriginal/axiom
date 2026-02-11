export const addThousandsSeparator = (num: number) => {
  if (num === null || isNaN(num)) return ""

  const [integer, fraction] = num.toString().split(".")
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return fraction
    ? `${formattedInteger}.${fraction}`
    : formattedInteger
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
