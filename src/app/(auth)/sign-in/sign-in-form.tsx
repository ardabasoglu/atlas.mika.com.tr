"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";

export function SignInForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? "Giriş bağlantısı geçersiz veya süresi dolmuş. Lütfen tekrar deneyin." : null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsPending(true);
    const errorSearch = callbackUrl !== "/" ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
    const { error } = await signIn.magicLink({
      email,
      callbackURL: callbackUrl,
      newUserCallbackURL: callbackUrl,
      errorCallbackURL: `/sign-in?error=1${errorSearch}`,
    });
    setIsPending(false);
    if (error) {
      setErrorMessage(error.message ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-center text-muted-foreground">
        E-posta adresinize giriş bağlantısı gönderildi. Lütfen gelen kutunuzu
        kontrol edin.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldSet>
        <FieldGroup>
          <Field>
            <label htmlFor="email">E-posta</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isPending}
            />
          </Field>
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Gönderiliyor…" : "Giriş bağlantısı gönder"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
