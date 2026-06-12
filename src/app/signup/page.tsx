"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSignup } from "@/hooks/auth/useSignup";
import { Container } from "@/components/dashboard/layout/Container";

export default function SignupPage() {
  const {
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
  } = useSignup();

  return (
    <Container variant="auth">
      <div className="w-full max-w-md">
        <Card variant="auth">
          <CardHeader>
            <CardTitle>Buat Akun</CardTitle>
            <CardDescription>
              Daftar untuk mulai mengelola kasbonmu
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <CardContent className="space-y-4">
              {errorMsg && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              {successMsg && (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMsg}</AlertDescription>
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
                <Label htmlFor="password" className="text-fg">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-fg">Konfirmasi Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                Daftar Sekarang
              </Button>
              <div className="text-center text-body-md text-fg-muted mt-2 pb-4 leading-normal">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-brand hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Container>
  );
}
