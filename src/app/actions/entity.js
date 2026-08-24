'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function submitEntityAction(formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  if (!token) return { success: false, error: 'Not authenticated' };

  try {
    const res = await fetch(`${API_BASE_URL}/records/submissions/`, {
      method: 'POST',
      headers: { 
          'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (res.ok) {
        const data = await res.json();
        return { success: true, data };
    } else {
        const errorData = await res.json();
        console.error("Backend returned error:", errorData);
        return { success: false, error: errorData };
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getMySubmissions() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/records/submissions/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) return await res.json();
    if (res.status === 401 || res.status === 403) return null;
  } catch {}
  return [];
}

export async function getAdminSubmissions() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/records/admin-submissions/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) return await res.json();
    if (res.status === 401 || res.status === 403) return null;
  } catch {}
  return [];
}

export async function updateSubmissionStatus(id, status, notes = "") {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE_URL}/records/admin-submissions/${id}/change_status/`, {
      method: 'PATCH',
      headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    });
    if (res.ok) {
        return { success: true };
    }
  } catch {}
  return { success: false };
}
