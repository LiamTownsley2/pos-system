import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const hoverShadowClass = {
  0: 'hover:shadow-[0_0_15px_#9E9D24]',
  1: 'hover:shadow-[0_0_15px_#5C4033]',
  2: 'hover:shadow-[0_0_15px_#4CAF50]',
  3: 'hover:shadow-[0_0_15px_#8B5E3C]',
  4: 'hover:shadow-[0_0_15px_#D4A373]',
  5: 'hover:shadow-[0_0_15px_#C62828]'
}
