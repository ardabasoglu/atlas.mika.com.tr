import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ZodError, ZodIssue } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format Zod validation errors into a single user-facing message. */
export function formatZodError(error: ZodError): string {
  const issues: readonly ZodIssue[] =
    "issues" in error && Array.isArray(error.issues) ? error.issues : []
  const messages = issues.map(
    (entry: ZodIssue) =>
      (entry.path.length ? `${entry.path.join(".")}: ` : "") + entry.message
  )
  return messages.length > 0 ? messages.join("; ") : "Validation failed."
}
