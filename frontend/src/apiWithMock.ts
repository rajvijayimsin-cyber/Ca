import api from './api';
import { saveLocal, loadLocal } from './utils/localStorage';

interface ApiResponse<T = any> { data: T; isMock: boolean; isStale?: boolean; }

function isNetworkDown(err: any): boolean {
  // No response object AND no HTTP status == backend unreachable
  return !err?.response && (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error' || err?.name === 'TypeError');
}

export async function apiGet<T = any>(path: string): Promise<ApiResponse<T>> {
  try {
    const res = await api.get(path);
    // Cache for offline use but ALWAYS return the real response — even if
    // it's an empty array. Empty list is a valid backend answer.
    saveLocal('cache_' + path, res.data);
    return { data: res.data, isMock: false };
  } catch (err: any) {
    if (isNetworkDown(err)) {
      // Offline: the LAST REAL RESPONSE, or nothing.
      //
      // This used to fall back to `getMockData(path)` — invented rows, shown
      // as though the server had sent them. An app that cannot reach its
      // backend then looked like an app that was working, which is the one
      // thing a demo must never do. If there is no cached response, the error
      // is rethrown so the page shows "The request failed" and a Try again.
      const cached = loadLocal<T | null>('cache_' + path, null);
      if (cached !== null && cached !== undefined) {
        return { data: cached, isMock: false, isStale: true };
      }
      throw err;
    }
    // Real HTTP error (404, 500, 401, etc.) — surface it so the UI shows
    // "API unavailable" instead of pretending everything worked.
    // eslint-disable-next-line no-console
    console.error(`[apiGet] ${path} failed:`, err?.response?.status, err?.response?.data);
    throw err;
  }
}

export async function apiPost<T = any>(path: string, body: any): Promise<ApiResponse<T>> {
  try {
    const res = await api.post(path, body);
    return { data: res.data, isMock: false };
  } catch (err: any) {
    if (isNetworkDown(err)) {
      // Never invent a success. This returned `{ ...body, id: Date.now(),
      // status: 'saved' }`, so pressing Approve with the backend down showed
      // a success toast for a write that never happened — and the row was
      // gone on the next load.
      throw err;
    }
    // eslint-disable-next-line no-console
    console.error(`[apiPost] ${path} failed:`, err?.response?.status, err?.response?.data);
    throw err;
  }
}

export default { get: apiGet, post: apiPost };
