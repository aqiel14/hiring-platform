"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "applicant";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null"
    );
    if (storedUser) setUser(storedUser);
    setHydrated(true);
  }, [setUser]);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) router.replace("/login");
    else if (role && user.role !== role) router.replace("/");
  }, [hydrated, user, role, router]);

  if (!hydrated || !user || (role && user.role !== role)) return null;
  return <>{children}</>;
}
