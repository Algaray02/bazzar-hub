"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageLoader } from "@/components/ui/page-loader";

export default function RedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Redirect berdasarkan role
    if (session.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (session.user?.role === "SELLER") {
      router.push("/seller");
    } else {
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <PageLoader message="Redirecting..." />
  );
}
