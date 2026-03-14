export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M Ft`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}e Ft`;
  }
  return `${amount} Ft`;
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft";
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short" });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB",
  "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC", "#81C784",
  "#AED581", "#DCE775", "#FFD54F", "#FFB74D", "#FF8A65",
  "#A1887F", "#90A4AE", "#7E57C2", "#5C6BC0", "#42A5F5",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
