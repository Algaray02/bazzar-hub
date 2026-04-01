"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/auth-layout";
import AuthForm from "@/components/shared/form/auth-form";
import { useRegister } from "@/hooks/use-auth";

const RegisterPage = () => {
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegister();

  const handleRegister = async (data) => {
    await register(data);
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Bergabung dengan komunitas seller terbaik"
      onBack={() => router.push("/")}
    >
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        isPending={isPending}
      />
    </AuthLayout>
  );
};

export default RegisterPage;