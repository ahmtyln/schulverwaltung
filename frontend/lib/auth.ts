// lib/auth.ts
import { jwtDecode } from 'jwt-decode';

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

interface JWTPayload {
  role: Role;
  sub: string;
}

const TOKEN_KEY = 'token';
const COOKIE_MAX_AGE_DAYS = 1;

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const fromStorage = localStorage.getItem(TOKEN_KEY);
  if (fromStorage) return fromStorage;
  const fromCookie = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  return fromCookie ?? null;
}

export function setToken(token: string): void {
  if (typeof document === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * COOKIE_MAX_AGE_DAYS}; SameSite=Lax`;
}

export function clearToken(): void {
  if (typeof document === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'token=; path=/; max-age=0';
}

export function useRole(): Role | null {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: JWTPayload = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export function getDashboardPath(role: string): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN': return '/admin';
    case 'TEACHER': return '/teachers';
    case 'STUDENT': return '/students';
    case 'PARENT': return '/parents';
    default: return '/admin';
  }
}
