"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appcontext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Login mutation
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user queries after successful login
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], data.data);
      toast.success("Login successful");
    },
  });

  // Register mutation
  const register = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await api.post("/register", userData);
      return response.data;
    },
  });

  // Logout function (client-side only for cookie-based auth)
  const logout = useMutation({
    mutationFn: async () => {
      const response = await api.post("/logout");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/auth/signin");
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message?: string })?.message ||
          "Logout failed"
      );
    },
  });

  return {
    login,
    register,
    logout,
    isLoading: login.isPending || register.isPending,
    isError: login.isError || register.isError,
    error: login.error || register.error,
  };
};
