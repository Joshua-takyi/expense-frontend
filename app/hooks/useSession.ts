"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../context/appcontext";
import { AxiosError } from "axios";

export interface SessionUser {
  user_id: string;
  name: string;
  email: string;
}

export interface SessionResponse {
  user: SessionUser | null;
}

export const useSession = () => {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["session"],
    queryFn: async (): Promise<SessionResponse> => {
      try {
        const response = await api.get("/profile");
        return { user: response.data.user || null };
      } catch (error) {
        // If 401 (unauthorized), user is not logged in - this is normal
        if (error instanceof AxiosError && error.response?.status === 401) {
          return { user: null };
        }
        // For other errors, still return null but log for debugging
        console.error("Session check failed:", error);
        return { user: null };
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
};
