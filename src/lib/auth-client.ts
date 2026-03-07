"use client";

/**
 * Auth client stub – Better Auth has been removed for now.
 * No session, sign-in/sign-up/sign-out are no-ops. Replace with real auth when needed.
 */

export function useSession() {
  return {
    data: null as { user?: { role?: string } } | null,
    isPending: false,
  };
}

async function signInNoOp(): Promise<void> {
  // No-op
}

async function signOutNoOp(): Promise<void> {
  // No-op
}

async function signUpEmailNoOp(_options?: unknown): Promise<void> {
  // No-op – registration disabled
}

export const signIn = {
  email: signInNoOp,
};

export const signOut = signOutNoOp;

export const signUp = {
  email: signUpEmailNoOp,
};
