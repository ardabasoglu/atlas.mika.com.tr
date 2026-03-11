export interface SplitPhoneState {
  phoneCountryCode: string;
  phoneLocalPart: string;
}

export function formatTurkeyLocalPhone(digits: string): string {
  const limitedDigits = digits.slice(0, 10);

  if (limitedDigits.length <= 3) {
    return limitedDigits;
  }

  if (limitedDigits.length <= 6) {
    return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
  }

  if (limitedDigits.length <= 8) {
    return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
  }

  return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6, 8)} ${limitedDigits.slice(8)}`;
}

export function normalizePhoneToE164(
  phoneCountryCode: string,
  phoneLocalPart: string,
): string | null {
  const fullInput = `${phoneCountryCode}${phoneLocalPart}`;
  const trimmedInput = fullInput.trim();
  if (!trimmedInput) {
    return null;
  }

  const alreadyNormalizedMatch = trimmedInput.match(/^\+[1-9]\d{1,14}$/);
  if (alreadyNormalizedMatch) {
    return trimmedInput;
  }

  const hasPlusPrefix = trimmedInput.startsWith("+");
  let digitsOnly = trimmedInput.replace(/\D/g, "");

  if (!digitsOnly) {
    return null;
  }

  if (hasPlusPrefix) {
    if (digitsOnly.startsWith("90")) {
      if (digitsOnly.length === 12) {
        return `+${digitsOnly}`;
      }
      return null;
    }

    if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
      return `+${digitsOnly}`;
    }

    return null;
  }

  if (digitsOnly.startsWith("00")) {
    const internationalDigits = digitsOnly.slice(2);
    if (internationalDigits.length >= 8 && internationalDigits.length <= 15) {
      return `+${internationalDigits}`;
    }
  }

  let normalizedDigits = digitsOnly;

  if (normalizedDigits.startsWith("90") && normalizedDigits.length === 12) {
    normalizedDigits = normalizedDigits.slice(2);
  }

  if (normalizedDigits.startsWith("0") && normalizedDigits.length === 11) {
    normalizedDigits = normalizedDigits.slice(1);
  }

  if (normalizedDigits.length === 10) {
    return `+90${normalizedDigits}`;
  }

  if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`;
  }

  return null;
}

export function splitPhoneForState(phone: string | null | undefined): SplitPhoneState {
  if (!phone) {
    return {
      phoneCountryCode: "+90",
      phoneLocalPart: "",
    };
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return {
      phoneCountryCode: "+90",
      phoneLocalPart: "",
    };
  }

  if (trimmed.startsWith("+90")) {
    const digits = trimmed.replace(/\D/g, "");
    const localDigits = digits.slice(2);
    return {
      phoneCountryCode: "+90",
      phoneLocalPart: formatTurkeyLocalPhone(localDigits),
    };
  }

  if (trimmed.startsWith("+")) {
    const digitsWithoutPlus = trimmed.slice(1).replace(/\D/g, "");
    const match = digitsWithoutPlus.match(/^(\d{1,3})(.*)$/);
    if (match) {
      return {
        phoneCountryCode: `+${match[1]}`,
        phoneLocalPart: (match[2] ?? "").trim(),
      };
    }

    return {
      phoneCountryCode: "+90",
      phoneLocalPart: "",
    };
  }

  const localDigits = trimmed.replace(/\D/g, "");
  const limitedLocalDigits = localDigits.slice(-10);
  return {
    phoneCountryCode: "+90",
    phoneLocalPart: formatTurkeyLocalPhone(limitedLocalDigits),
  };
}

