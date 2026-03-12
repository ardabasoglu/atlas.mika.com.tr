"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { z } from "zod";
import type { Person } from "../types";
import { createPersonPayloadSchema } from "../schemas";
import { createPersonAction, updatePersonDetailsAction } from "../server-actions";
import {
  formatTurkeyLocalPhone,
  normalizePhoneToE164,
  splitPhoneForState,
} from "../phone-utils";

type PersonFormMode = "create" | "edit";

interface PersonFormProps {
  mode: PersonFormMode;
  initialPerson?: Person;
  personId?: string;
}

interface PersonFormState {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneLocalPart: string;
  notes: string;
}

interface PersonFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  general?: string;
}

const initialFormState: PersonFormState = {
  name: "",
  email: "",
  phoneCountryCode: "+90",
  phoneLocalPart: "",
  notes: "",
};

function PersonForm({ mode, initialPerson, personId }: PersonFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<PersonFormState>(() => {
    if (!initialPerson) {
      return initialFormState;
    }
    return {
      name: initialPerson.name,
      email: initialPerson.email,
      ...splitPhoneForState(initialPerson.phone ?? ""),
      notes: initialPerson.notes ?? "",
    };
  });
  const [errors, setErrors] = useState<PersonFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const trimmedCountryCode = formState.phoneCountryCode.trim();
      if (!trimmedCountryCode || !/^\+[1-9]\d{0,2}$/.test(trimmedCountryCode)) {
        setErrors({
          phone: "Geçerli bir ülke kodu girin (örn. +90, +44, +1)",
        });
        return;
      }

      const normalizedPhone = normalizePhoneToE164(
        formState.phoneCountryCode,
        formState.phoneLocalPart,
      );
      if (!normalizedPhone) {
        setErrors({
          phone:
            "Geçerli bir telefon numarası girin (örn. +905327778899 veya +447911123456)",
        });
        return;
      }

      const payload: z.input<typeof createPersonPayloadSchema> = {
        name: formState.name,
        email: formState.email,
        phone: normalizedPhone,
        notes: formState.notes || undefined,
      };

      let generalError: string | undefined;
      if (mode === "create") {
        const result = await createPersonAction(payload);

        if (result.success && result.personId) {
          window.location.href = `/crm/persons/${result.personId}`;
          return;
        }

        const newErrors: PersonFormErrors = {};
        if (result.fieldErrors?.name) {
          newErrors.name = result.fieldErrors.name;
        }
        if (result.fieldErrors?.email) {
          newErrors.email = result.fieldErrors.email;
        }
        if (result.fieldErrors?.phone) {
          newErrors.phone = result.fieldErrors.phone;
        }
        if (result.message) {
          generalError = result.message;
        }

        setErrors(newErrors);
      } else if (mode === "edit" && personId) {
        const result = await updatePersonDetailsAction(personId, payload);

        if (result.success) {
          window.location.href = `/crm/persons/${personId}`;
          return;
        }

        const newErrors: PersonFormErrors = {};
        if (result.fieldErrors?.name) {
          newErrors.name = result.fieldErrors.name;
        }
        if (result.fieldErrors?.email) {
          newErrors.email = result.fieldErrors.email;
        }
        if (result.fieldErrors?.phone) {
          newErrors.phone = result.fieldErrors.phone;
        }
        if (result.message) {
          generalError = result.message;
        }

        setErrors(newErrors);
      }

      if (generalError) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          general: generalError,
        }));
      }
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Kişi kaydedilirken beklenmeyen bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Yeni kişi oluştur" : "Kişiyi düzenle"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <p className="text-sm text-destructive">{errors.general}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((previousState) => ({
                    ...previousState,
                    name: event.target.value,
                  }))
                }
                placeholder="Ad Soyad"
                required
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((previousState) => ({
                    ...previousState,
                    email: event.target.value,
                  }))
                }
                placeholder="ornek@firma.com"
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="flex">
                <Input
                  id="phoneCountryCode"
                  className="w-24 rounded-r-none"
                  value={formState.phoneCountryCode}
                  onChange={(event) => {
                    let value = event.target.value.replace(/[^0-9+]/g, "");
                    if (!value.startsWith("+")) {
                      value = `+${value.replace(/\+/g, "")}`;
                    } else {
                      value = `+${value.slice(1).replace(/\+/g, "")}`;
                    }
                    if (value.length > 4) {
                      value = value.slice(0, 4);
                    }
                    setFormState((previousState) => ({
                      ...previousState,
                      phoneCountryCode: value,
                    }));
                    if (errors.phone) {
                      setErrors((previousErrors) => ({
                        ...previousErrors,
                        phone: undefined,
                      }));
                    }
                  }}
                  placeholder="+90"
                  required
                />
                <Input
                  id="phoneLocalPart"
                  className="flex-1 rounded-l-none"
                  value={formState.phoneLocalPart}
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    const digitsOnly = rawValue.replace(/\D/g, "");
                    const limitedDigits =
                      formState.phoneCountryCode === "+90"
                        ? digitsOnly.slice(0, 10)
                        : digitsOnly;
                    const formattedValue =
                      formState.phoneCountryCode === "+90"
                        ? formatTurkeyLocalPhone(limitedDigits)
                        : limitedDigits;
                    setFormState((previousState) => ({
                      ...previousState,
                      phoneLocalPart: formattedValue,
                    }));
                    if (errors.phone) {
                      setErrors((previousErrors) => ({
                        ...previousErrors,
                        phone: undefined,
                      }));
                    }
                  }}
                  placeholder="532 777 88 99"
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={formState.notes}
              onChange={(event) =>
                setFormState((previousState) => ({
                  ...previousState,
                  notes: event.target.value,
                }))
              }
              placeholder="Not ekleyin"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Kaydediliyor…"
                : mode === "create"
                  ? "Oluştur"
                  : "Güncelle"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.back()}
            >
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function PersonCreateForm() {
  return <PersonForm mode="create" />;
}

export { PersonForm };
