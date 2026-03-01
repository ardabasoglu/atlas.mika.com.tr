import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "@/components/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Tekrar Hoş Geldiniz"
      description="Hesabınıza erişmek için bilgilerinizi girin"
      showImage={true}
    >
      <LoginForm />
    </AuthLayout>
  );
}

