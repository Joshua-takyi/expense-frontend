"use server";

import { cookies } from "next/headers";

const apiurl =
  process.env.NODE_ENV == "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_DEVELOPMENT_URL;

type SessionResponse = {
  user: {
    user_id: string;
    name: string;
    email: string;
  } | null;
};

export async function Session(): Promise<SessionResponse> {
  if (!apiurl) {
    console.error("API URL is not defined");
    return { user: null };
  }

  const cookieStore = await cookies();

  // Get individual cookies instead of toString() which might not work reliably in production
  const authToken = cookieStore.get("auth_token")?.value;
  const csrfToken = cookieStore.get("csrf_token")?.value;

  // If no auth token, user is not logged in
  if (!authToken) {
    return { user: null };
  }

  // Build cookie string manually for more reliable cross-environment behavior
  const cookieString = [
    authToken ? `auth_token=${authToken}` : null,
    csrfToken ? `csrf_token=${csrfToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  try {
    const response = await fetch(`${apiurl}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Always include cookies if we have them
        ...(cookieString ? { Cookie: cookieString } : {}),
      },
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      // Don't log errors for 401 (unauthorized) as this is expected for non-logged-in users
      if (response.status !== 401) {
        console.error(`Session check failed with status: ${response.status}`);
      }
      return { user: null };
    }

    const data = (await response.json()) as { user: SessionResponse["user"] };
    return { user: data.user || null };
  } catch (error) {
    console.error("Error fetching user session:", error);
    return { user: null };
  }
}
