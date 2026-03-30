"use client";

import AuthLayout from "@/components/layout/auth-layout";
import AuthForm from "@/components/shared/form/auth-form";
import { useRegister } from "@/hooks/use-auth";

const RegisterPage = () => {
  const { mutateAsync: register, isPending } = useRegister();

  const handleRegister = async (data) => {
    await register(data);
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Bergabung dengan komunitas seller terbaik"
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