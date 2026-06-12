import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  const supabase = createServerClient(
    supabaseUrl,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refresh session kalo expired (biar cepet ga usah db round-trip)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const url = request.nextUrl.clone();

  // proteksi route / halaman
  if (!user && url.pathname !== "/login" && url.pathname !== "/signup" && !url.pathname.startsWith("/api/")) {
    // belum login? redirect ke page login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (url.pathname === "/login" || url.pathname === "/signup" || url.pathname === "/")) {
    // kalo udh login, redirect ke dashboard (/)
    // biar simple & clean, homepage (/) dijadikan sebagai dashboard
    if (url.pathname !== "/") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Jalankan pembatas untuk semua halaman, kecuali:
     * - _next/static (berkas statis)
     * - _next/image (berkas optimasi gambar)
     * - favicon.ico (berkas ikon situs)
     * Pola ini bisa diubah sesuai kebutuhan halaman baru.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
