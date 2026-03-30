"use client";

import AuthLayout from "@/components/layout/auth-layout";
import AuthForm from "@/components/shared/form/auth-form";
import { useForgotPassword } from "@/hooks/use-auth";

const ForgotPasswordPage = () => {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const handleForgotPassword = async (data) => {
    await forgotPassword(data);
  };

  return (
    <AuthLayout
      title="Lupa Password?"
      subtitle="Masukkan email Anda untuk reset password"
    >
      <AuthForm
        type="forgot"
        onSubmit={handleForgotPassword}
        isPending={isPending}
      />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;