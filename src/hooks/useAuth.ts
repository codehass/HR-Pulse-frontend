"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export function useAuth(requireAuth = true) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchApi("/api/v1/auth/status", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
          if (requireAuth && !data.authenticated) {
            router.push("/login");
          }
        } else {
          setIsAuthenticated(false);
          if (requireAuth) router.push("/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        if (requireAuth) router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router]);

  return { isAuthenticated, loading };
}
