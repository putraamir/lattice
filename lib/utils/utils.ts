export function getUserInitials(title: string): string {
  return title
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatTimestamp(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins < 1 ? "now" : `${diffMins}m`;
  } else if (diffDays < 1) {
    return `${Math.floor(diffHours)}h`;
  } else if (diffDays < 7) {
    return `${Math.floor(diffDays)}d`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export function cn(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
