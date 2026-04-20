export function lighten(hex: string, amount: number = 40): string {
  return '#' + hex.slice(1).match(/.{2}/g)!
    .map(c => Math.min(255, parseInt(c, 16) + amount).toString(16).padStart(2, '0'))
    .join('');
}

export function darken(hex: string, amount: number = 40): string {
  return '#' + hex.slice(1).match(/.{2}/g)!
    .map(c => Math.max(0, parseInt(c, 16) - amount).toString(16).padStart(2, '0'))
    .join('');
}