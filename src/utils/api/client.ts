import { clearTokens, getTokens, setTokens } from './storage';

type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? '';

function joinUrl(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_BASE}${path}`;
}

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const res = await fetch(joinUrl('/v1/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.accessToken || !json?.refreshToken) return null;
  return { accessToken: json.accessToken, refreshToken: json.refreshToken };
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth = false, ...requestInit } = init;
  const auth = !skipAuth;
  const tokens = getTokens();

  const headers = new Headers(requestInit.headers);
  if (!headers.has('Content-Type') && requestInit.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth && tokens?.accessToken) {
    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const doRequest = async (): Promise<Response> => {
    return fetch(joinUrl(path), { ...requestInit, headers });
  };

  let res = await doRequest();

  if (auth && res.status === 401 && tokens?.refreshToken) {
    const refreshed = await refreshTokens(tokens.refreshToken);
    if (refreshed) {
      setTokens(refreshed);
      headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
      res = await doRequest();
    } else {
      clearTokens();
    }
  }

  if (!res.ok) {
    const maybe = (await parseJsonSafe(res)) as ApiError | null;
    const message = maybe?.error?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  // 204
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}
