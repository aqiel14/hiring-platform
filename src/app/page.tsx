"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login"); // not logged in → go to login
    } else if (user.role === "admin") {
      router.replace("/admin"); // admin → /admin
    } else if (user.role === "applicant") {
      router.replace("/applicant"); // applicant → /applicant
    }
  }, [user, router]);

  return null; // optional: can show a loading spinner while redirecting
}
