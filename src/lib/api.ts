// src/lib/api.ts

/* =========================
   API ERROR
========================= */

export class ApiError extends Error {
  status: number;
  info?: any;

  constructor(
    message: string,
    status: number,
    info?: any
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

/* =========================
   TOKEN STORAGE
========================= */

const TOKEN_KEY = 'talentgrind_jwt';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (
  token: string
): void => {
  localStorage.setItem(
    TOKEN_KEY,
    token
  );
};

export const clearToken = (): void => {
  localStorage.removeItem(
    TOKEN_KEY
  );
};

/* =========================
   BASE URL
========================= */

export const BASE_URL =
  'http://3.88.229.15:8080' ;
  // 'http://localhost:8080';

/* =========================
   API FETCH
========================= */

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  const headers = new Headers(
    options?.headers || {}
  );

  // JSON content type
  if (
    options?.body &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  // JWT
  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`
    );
  }

  const cleanPath =
    path.startsWith('/')
      ? path.substring(1)
      : path;

  const url = `${BASE_URL}/${cleanPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    /* =========================
       AUTO LOGOUT
    ========================= */

    if (response.status === 401) {
      clearToken();

      window.dispatchEvent(
        new Event('auth_logout')
      );

      throw new ApiError(
        'Session expired. Please login again.',
        401
      );
    }

    /* =========================
       HANDLE ERRORS
    ========================= */

    if (!response.ok) {
      let errorData: any = null;

      try {
        errorData =
          await response.json();
      } catch {
        errorData = null;
      }

      throw new ApiError(
        errorData?.message ||
          `Request failed with ${response.status}`,
        response.status,
        errorData
      );
    }

    /* =========================
       EMPTY RESPONSE
    ========================= */

    const text =
      await response.text();

    if (!text) {
      return {} as T;
    }

    const data = JSON.parse(text);

    return normalizeResponse(
      data
    ) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    // network/server offline
    throw new ApiError(
      error?.message ||
        'Unable to connect to server.',
      500
    );
  }
}

/* =========================
   RESPONSE NORMALIZER
========================= */

function normalizeResponse(
  data: any
) {
  if (!data) return data;

  // spring pageable
  if (
    typeof data === 'object' &&
    'content' in data &&
    Array.isArray(data.content)
  ) {
    return {
      ...data,
      content: data.content || [],
    };
  }

  return data;
}