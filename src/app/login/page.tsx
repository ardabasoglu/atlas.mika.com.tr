import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh bg-slate-50 dark:bg-slate-950/50 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Center this div horizontally*/}
        <div className="flex justify-center gap-2 md:justify-center">
          <a href="/dashboard" className="flex items-center gap-2 font-large">
            <span className="text-5xl font-semibold tracking-tight md:text-5xl">
              ATLAS
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://naturalistverde.com/wp-content/uploads/2025/12/naturalist-verde-gallery-P-019.webp"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
