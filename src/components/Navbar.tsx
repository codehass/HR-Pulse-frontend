"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Briefcase, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetchApi("/api/v1/auth/status", {
          // ensure credentials are sent
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchApi("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all bg-opacity-70 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-text-primary hover:text-primary transition-colors duration-300">
          <Briefcase className="text-primary animate-pulse" size={32} />
          <span>HR <span className="text-primary font-bold">Pulse</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated === null ? (
            <div className="w-20 h-8 bg-border rounded-md animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-text-secondary hover:text-primary font-medium transition duration-200 uppercase text-sm tracking-wider">Dashboard</Link>
              <Link href="/predict" className="text-text-secondary hover:text-primary font-medium transition duration-200 uppercase text-sm tracking-wider">Predict Salary</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-text-secondary hover:text-red-600 font-medium transition duration-200 uppercase text-sm tracking-wider ml-4">
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-text-secondary hover:text-primary font-semibold transition duration-200 px-4 py-2">Sign In</Link>
              <Link href="/register" className="bg-primary text-white font-semibold py-2 px-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1">Post a Job / Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
