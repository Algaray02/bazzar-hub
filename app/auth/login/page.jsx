"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/auth-layout";
import AuthForm from "@/components/shared/form/auth-form";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Login berhasil!");

        const session = await getSession();

        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else if (session?.user?.role === "SELLER") {
          router.push("/seller");
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk ke dashboard seller Anda"
    >
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        isPending={loading}
      />
    </AuthLayout>
  );
};

export default LoginPage;