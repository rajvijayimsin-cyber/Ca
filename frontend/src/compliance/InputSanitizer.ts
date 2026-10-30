/**
 * Input Sanitizer - XSS Prevention
 * Sanitize/escape user input. DOMPurify equivalent.
 * Includes Content-Security-Policy meta value.
 */

export function sanitize(input: string): string {
  if (typeof input !== "string") return String(input);
  let cleaned = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  cleaned = cleaned.replace(/javascript\s*:/gi, "");
  cleaned = cleaned.replace(/on\w+\s*=/gi, "");
  return cleaned;
}

export function sanitizeHTML(html: string): string {
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  cleaned = cleaned.replace(/href\s*=\s*["']*javascript:/gi, 'href="#"');
  return cleaned;
}

export function sanitizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleaned)) throw new Error("Invalid email format");
  return cleaned;
}

export const CSP_META_CONTENT =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; font-src 'self'; connect-src 'self'";

export default { sanitize, sanitizeHTML, sanitizeEmail, CSP_META_CONTENT };
