export interface ApiErrorShape {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  // Next.js caching extensions — only take effect in Server Components /
  // Route Handlers. Silently ignored in Client Components ("use client").
  // Decide these per-function, not here.
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

function getBaseUrl() {
  // Client-side: relative URLs work fine, browser fills in the origin
  if (typeof window !== "undefined") return "";

  // Server-side: need an absolute URL
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // Vercel sets this automatically in deployed environments
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Local dev fallback
  return "http://localhost:3000";
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { params, headers, body, ...rest } = options;

  let url = getBaseUrl() + path;  // ← changed
  if (params) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) query.set(key, String(value));
    }
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
  }
  
  const isFormData = body instanceof FormData;

  const res = await fetch(url, {
    ...rest,
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const errorData = data as ApiErrorShape;
    throw new ApiError(errorData.message || "Something went wrong", res.status, errorData.errors);
  }

  return data as T;
}