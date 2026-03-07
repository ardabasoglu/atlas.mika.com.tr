/**
 * Auth stub – Better Auth has been removed for now.
 * Session is always null. Replace with real auth when needed.
 */
export type Session = { user: { role: string } } | null;

export const auth = {
  api: {
    getSession: async (_options?: { headers?: Headers }): Promise<Session> =>
      null,
  },
};
