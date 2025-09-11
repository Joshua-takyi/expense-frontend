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
  const cookieString = cookieStore.toString();
  try {
    const response = await fetch(`${apiurl}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // spread cookies if they exist
        ...(cookieString ? { Cookie: cookieString } : {}),
      },
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return { user: null };
    }

    const data = (await response.json()) as { user: SessionResponse["user"] };
    return { user: data.user || null };
  } catch (error) {
    console.error("Error fetching user session:", error);
    return { user: null };
  }
}
