import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showImage?: boolean;
}

export function AuthLayout({
  children,
  title,
  description,
  showImage = true,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh bg-slate-50 dark:bg-slate-950/50 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo/Brand Section */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-large">
            <span className="text-3xl font-semibold tracking-tight md:text-4xl">
              ATLAS
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {title}
              </h1>
              <p className="text-muted-foreground mt-2">{description}</p>
            </div>

            <div className="w-full">{children}</div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                {title === "Giriş Yap"
                  ? "Hesabınız yok mu?"
                  : "Zaten hesabınız var mı?"}{" "}
                <Link
                  href={title === "Giriş Yap" ? "/sign-up" : "/sign-in"}
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  {title === "Giriş Yap" ? "Kayıt ol" : "Giriş yap"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section - Only shown on larger screens */}
      {showImage && (
        <div className="bg-muted relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop"
            alt="Kimlik doğrulama arka planı"
            className="size-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
    </div>
  );
}
