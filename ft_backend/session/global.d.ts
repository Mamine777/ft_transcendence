
export declare module '@fastify/session' {
  interface SessionData {
    pending2FA?: {
      email: string;
      code: string;
      expiresAt: number;
    };
    user?: {
      id: number;
      email: string;
      username: string;
    };
  }
}