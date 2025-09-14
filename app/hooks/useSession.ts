"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appcontext";
import { useRouter } from "next/navigation";

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
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await api.get("/profile");
        return { user: response.data.user };
      } catch {
        return { user: null };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.warn("Logout request failed, clearing session anyway:", error);
    } finally {
      // Clear all cached data
      queryClient.clear();
      // Force redirect to signin
      router.push("/auth/signin");
    }
  };

  const isAuthenticated = !!session?.user;

  return {
    user: session?.user || null,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refetch,
  };
};
