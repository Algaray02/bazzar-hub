import { authService } from "@/lib/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Gagal mendaftar. Silakan coba lagi.";
      toast.error(message);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgot_password,
    onSuccess: () => {
      toast.success("Link reset password telah dikirim ke email Anda.");
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal mengirim email.";
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.reset_password,
    onSuccess: () => {
      toast.success("Password berhasil diubah. Silakan login.");
      router.push("/auth/login");
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal mereset password.";
      toast.error(message);
    },
  });
};