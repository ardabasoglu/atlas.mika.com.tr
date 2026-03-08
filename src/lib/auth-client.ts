"use client";

import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? undefined : process.env.BETTER_AUTH_URL,
  plugins: [
    magicLinkClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

export function useSession() {
  return authClient.useSession();
}

export const signIn = {
  magicLink: authClient.signIn.magicLink,
};

export const signOut = authClient.signOut;
