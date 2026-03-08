import { Suspense } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <AuthLayout
      title="Giriş Yap"
      description="E-posta adresinize gönderilen bağlantı ile giriş yapın."
      imageSrc="/verde-garden-001.jpg"
      imageAlt="Verde Garden"
    >
      <Suspense fallback={<div className="text-muted-foreground">Yükleniyor…</div>}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}
