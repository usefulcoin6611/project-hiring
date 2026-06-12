"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/hooks/auth/useLogin";
import { Container } from "@/components/dashboard/layout/Container";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errorMsg,
    handleLogin,
  } = useLogin();

  return (
    <Container variant="auth">
      <div className="w-full max-w-md">
        <Card variant="auth">
          <CardHeader>
            <CardTitle>Kasbon</CardTitle>
            <CardDescription>
              Masuk untuk mencatat utang piutangmu
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <CardContent className="space-y-4">
              {errorMsg && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-fg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="budi@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-fg">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                loadingText="Memproses..."
              >
                Masuk Sekarang
              </Button>
              <div className="text-center text-body-md text-fg-muted mt-2 pb-4 leading-normal">
                Belum punya akun?{" "}
                <Link href="/signup" className="text-brand hover:underline">
                  Daftar di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Container>
  );
}
