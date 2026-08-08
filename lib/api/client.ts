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

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { params, headers, body, ...rest } = options;

  let url = path;
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