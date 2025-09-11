"use client";

import { createContext, useMemo, useContext } from "react";
import axios, { AxiosInstance } from "axios";

const apiurl =
  process.env.NODE_ENV == "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_DEVELOPMENT_URL;

interface AppContextType {
  api: AxiosInstance;
}

export const AppContext = createContext<AppContextType | null>(null);

// Function to get CSRF token from the backend
const getCsrfToken = async (
  instance: AxiosInstance
): Promise<string | null> => {
  try {
    const response = await instance.get(`${apiurl}/csrf-token`);
    return response.data.csrf_token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: apiurl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add request interceptor to include CSRF token for mutations
    instance.interceptors.request.use(async (config) => {
      const method = config.method?.toLowerCase();
      const mutationMethods =
        method && ["post", "put", "delete", "patch"].includes(method);

      // Skip CSRF token for signin/login and register requests
      const isAuthRequest =
        config.url?.includes("/login") ||
        config.url?.includes("/register") ||
        config.url?.includes("/csrf-token");

      if (mutationMethods && !isAuthRequest) {
        const csrfToken = await getCsrfToken(instance);
        if (csrfToken) {
          config.headers["X-CSRF-Token"] = csrfToken;
        }
      }

      return config;
    });

    // Add response interceptor to handle CSRF token errors
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If we get a 403 CSRF error and haven't already retried
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Get a fresh CSRF token and retry the request
          const csrfToken = await getCsrfToken(instance);
          if (csrfToken) {
            originalRequest.headers["X-CSRF-Token"] = csrfToken;
            return instance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  const contextValue = useMemo(
    () => ({
      api,
    }),
    [api]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
