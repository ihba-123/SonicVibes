import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// it combines multiple css classnames into one string
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
