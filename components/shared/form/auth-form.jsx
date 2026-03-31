import React from "react";
import { Mail, Lock, User, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/input-field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "@/lib/validators/auth";

const AuthForm = ({ type = "login", onSubmit, isPending, schema }) => {
  const formSchema =
    schema ||
    (type === "login"
      ? loginSchema
      : type === "register"
      ? registerSchema
      : forgotPasswordSchema);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "login"
        ? { email: "", password: "" }
        : type === "register"
        ? { name: "", email: "", phone: "", password: "" }
        : { email: "" },
  });

  const handleGoogleLogin =
    type === "login"
      ? () => signIn("google", { callbackUrl: "/auth/redirect" })
      : null;

  const renderFields = () => {
    switch (type) {
      case "register":
        return (
          <>
            <InputField
              label="Nama Lengkap"
              name="name"
              placeholder="Nama Bisnis / Owner"
              icon={User}
              control={form.control}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="nama@gmail.com"
              icon={Mail}
              control={form.control}
            />
            <InputField
              label="Nomor Telepon"
              name="phone"
              type="tel"
              placeholder="081234567890"
              icon={Phone}
              control={form.control}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Buat password kuat"
              icon={Lock}
              control={form.control}
            />
          </>
        );
      case "forgot":
        return (
          <InputField
            control={form.control}
            label="Email"
            name="email"
            type="email"
            placeholder="nama@gmail.com"
            icon={Mail}
          />
        );
      case "login":
      default:
        return (
          <>
            <InputField
              control={form.control}
              label="Email"
              name="email"
              type="email"
              placeholder="nama@gmail.com"
              icon={Mail}
            />
            <div className="space-y-2">
              <InputField
                control={form.control}
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
              />
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
            </div>
          </>
        );
    }
  };

  const getButtonText = () => {
    switch (type) {
      case "register":
        return "Buat Akun";
      case "forgot":
        return "Kirim Link Reset";
      case "login":
      default:
        return "Masuk Sekarang";
    }
  };

  const getAdditionalContent = () => {
    switch (type) {
      case "login":
        return (
          <>
            {handleGoogleLogin && (
              <>
                <div className="my-8 flex items-center gap-4">
                  <Separator className="flex-1 bg-zinc-700" />
                  <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                    ATAU LANJUT DENGAN
                  </span>
                  <Separator className="flex-1 bg-zinc-700" />
                </div>

                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full py-5 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 rounded-xl"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                </div>
              </>
            )}
          </>
        );
      case "forgot":
        return (
          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Link>
          </div>
        );
      case "register":
        return null;
      default:
        return null;
    }
  };

  const getFooterText = () => {
    switch (type) {
      case "login":
        return {
          text: "Belum punya akun?",
          link: "/auth/register",
          linkText: "Daftar Gratis",
        };
      case "register":
        return {
          text: "Sudah punya akun?",
          link: "/auth/login",
          linkText: "Masuk di sini",
        };
      default:
        return null;
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {renderFields()}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-fuchsia-600 to-pink-600 text-white font-semibold h-12 rounded-xl hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-0"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              getButtonText()
            )}
          </Button>
        </form>
      </Form>

      {getAdditionalContent()}

      {getFooterText() && (
        <p className="text-center text-sm text-zinc-400 mt-6">
          {getFooterText().text}{" "}
          <Link
            href={getFooterText().link}
            className="text-fuchsia-400 font-semibold hover:text-fuchsia-300 transition-colors"
          >
            {getFooterText().linkText}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
