'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
import { redirect } from 'next/navigation';

export async function setAuthCookies(access, refresh) {
  const cookieStore = await cookies();
  
  // Set access token
  cookieStore.set('access_token', access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });

  // Set refresh token
  cookieStore.set('refresh_token', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function activateWalletAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  if (!token) return;
  
  const res = await fetch(`${API_BASE_URL}/auth/didit-url/`, {
      method: 'POST',
      headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  });
  
  const data = await res.json();
  if (res.ok && data.session_url) {
      redirect(data.session_url);
  } else {
      console.error("Failed to generate Didit URL", data);
  }
}

export async function getProfileCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}