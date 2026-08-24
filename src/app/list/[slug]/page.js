import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ListAssetClient from "./ListAssetClient";


async function getProfile(token) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();

  } catch {
    return null;
  }
}


export default async function List({
  params,
}) {
  const resolvedParams =
    await params;

  const slug =
    resolvedParams.slug;


  const cookieStore =
    await cookies();


  const token =
    cookieStore.get(
      "access_token"
    )?.value;


  // ==========================================================
  // AUTH
  // ==========================================================

  if (!token) {
    redirect(
      `/login?callbackUrl=/list/${slug}`
    );
  }


  const profile =
    await getProfile(token);


  if (!profile) {
    redirect(
      `/login?callbackUrl=/list/${slug}`
    );
  }


  // ==========================================================
  // BLOCK REVENUE OFFICIAL
  // ==========================================================

  if (
    profile.role ===
    "REVENUE_OFFICIAL"
  ) {
    redirect(
      "/admin-dashboard"
    );
  }


  /*
   * slug is now NFT tokenId.
   *
   * NO Django property fetch here.
   */


  return (
    <ListAssetClient
      tokenId={slug}
    />
  );
}