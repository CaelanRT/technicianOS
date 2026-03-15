// In dev, use relative URL so Vite proxy forwards to backend (avoids CORS)
// In prod, use VITE_API_URL or fallback
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'http://localhost:3000') + '/api/v1';

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, config);

  if (!res.ok) {
    let msg = 'Something went wrong';
    try {
      const data = await res.json();
      if (data?.msg) msg = data.msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res.json();
}

export { API_BASE, request };
