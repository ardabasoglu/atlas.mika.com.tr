"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth-layout";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AuthLayout
      title="Kayıt Ol"
      description="Hesap oluşturmak için bilgilerinizi girin"
      showImage={true}
    >
      <div className="w-full max-w-sm">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FieldLabel htmlFor="first-name">Ad</FieldLabel>
              <Input
                id="first-name"
                placeholder="Max"
                required
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel htmlFor="last-name">Soyad</FieldLabel>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="email">E-posta</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="password">Şifre</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Şifre"
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="password_confirmation">
              Şifreyi Onayla
            </FieldLabel>
            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              autoComplete="new-password"
              placeholder="Şifreyi onaylayın"
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="image">Profil Resmi (isteğe bağlı)</FieldLabel>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Profil önizlemesi"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                image: image ? await convertImageToBase64(image) : "",
                role: "MEMBER",
                callbackURL: "/dashboard",
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (context) => {
                    toast.error(context.error.message);
                  },
                  onSuccess: () => {
                    router.push("/dashboard");
                  },
                },
              });
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Hesabınızı oluşturun"
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

