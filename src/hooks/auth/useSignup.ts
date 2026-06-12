import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";

export function useSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Isi semua kolom dulu ya!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter ya!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password kamu gak cocok.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setSuccessMsg("Akun kamu berhasil terdaftar! Mengalihkan...");
      setTimeout(() => {
        router.refresh();
        router.push("/");
      }, 1500);
    } catch {
      setErrorMsg("Terjadi masalah saat mendaftar. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errorMsg,
    successMsg,
    handleSignup,
  };
}
