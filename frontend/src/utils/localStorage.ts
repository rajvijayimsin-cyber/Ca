/**
 * localStorage utility with JSON serialization and type safety.
 */
const PREFIX = 'app_';

export function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

export function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function removeLocal(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clearAllLocal(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k));
}
