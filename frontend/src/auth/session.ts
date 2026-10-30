import api from '../api';

export type Session = { role: string | null };

// The roles that belong to customers of this app rather than to
// the people running it. Derived from the brief's own
// stakeholders; empty when the app serves one audience.
export const CUSTOMER_ROLES: string[] = ["family", "caregiver"];

// The stakeholder list says "clients" and a token says
// "client", so both sides lose a trailing s before they meet.
const norm = (r: unknown): string =>
  String(r ?? '').trim().toLowerCase()
    .replace(/[\s-]+/g, '_').replace(/s$/, '');

/** True unless we positively know this is a customer. */
export function isStaff(role: string | null | undefined): boolean {
  if (!CUSTOMER_ROLES.length) return true;
  const r = norm(role);
  if (!r) return true;
  return !CUSTOMER_ROLES.map(norm).includes(r);
}

// Staff tiers, from the role names the brief uses. Empty when it
// names none, and then every staff member is treated alike.
export const ADMIN_ROLES: string[] = ["admin"];
export const READ_ONLY_ROLES: string[] = [];

/** May open the screens that run the platform. Unknown role: yes. */
export function isAdmin(role: string | null | undefined): boolean {
  if (!ADMIN_ROLES.length) return isStaff(role);
  const r = norm(role);
  if (!r) return true;
  return ADMIN_ROLES.map(norm).includes(r);
}

/** May add, change or delete. False only for a known read-only role.
 *  The backend refuses the write as well; this only stops offering it. */
export function canWrite(role: string | null | undefined): boolean {
  const r = norm(role);
  if (!r) return true;
  return !READ_ONLY_ROLES.map(norm).includes(r);
}

let pending: Promise<Session> | null = null;

/** The signed-in user, fetched once per page load. */
export function loadSession(): Promise<Session> {
  if (!pending) {
    pending = api.get('/api/auth/me')
      .then(r => {
        const d: any = r?.data ?? {};
        const u = d.user ?? d;
        return { role: u?.role ?? u?.user_type ?? u?.type ?? null };
      })
      // An endpoint that does not answer leaves the role unknown,
      // which shows everything rather than hiding everything.
      .catch(() => ({ role: null } as Session));
  }
  return pending;
}
