import { clearTokens, getTokens, setTokens } from './storage';

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

type ApiError = {
  error?: {
    message?: string;
  };
};

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const tokens = await getTokens();
  if (!tokens) return null;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(`${API_BASE}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });

      if (!res.ok) {
        await clearTokens();
        return null;
      }

      const data = await res.json();
      if (!data?.accessToken || !data?.refreshToken) {
        await clearTokens();
        return null;
      }

      await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.accessToken as string;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function apiFetch(path: string, init?: RequestInit & { skipAuth?: boolean }): Promise<any> {
  if (!API_BASE && !path.startsWith('http')) {
    throw new Error('Missing EXPO_PUBLIC_API_BASE_URL. Create mobile/.env and set EXPO_PUBLIC_API_BASE_URL to your backend base URL (e.g. https://your-deployment.vercel.app). Then restart Expo.');
  }

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json');

  if (!init?.skipAuth) {
    const tokens = await getTokens();
    if (tokens?.accessToken) headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && !init?.skipAuth) {
    const newAccess = await refreshAccessToken();
    if (!newAccess) {
      const errBody = (await parseJsonSafe(res)) as ApiError | null;
      const message = errBody?.error?.message || 'Unauthorized';
      throw new Error(message);
    }

    const retryHeaders = new Headers(init?.headers ?? {});
    if (!retryHeaders.has('Content-Type') && init?.body) retryHeaders.set('Content-Type', 'application/json');
    retryHeaders.set('Authorization', `Bearer ${newAccess}`);

    const retryRes = await fetch(url, { ...init, headers: retryHeaders });
    const retryData = await parseJsonSafe(retryRes);
    if (!retryRes.ok) {
      const message = (retryData as ApiError | null)?.error?.message || `Request failed (${retryRes.status})`;
      throw new Error(message);
    }
    return retryData;
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const message = (data as ApiError | null)?.error?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
