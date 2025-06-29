import fastify, { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { Server } from 'http';
import { send2FACode } from '../emailService';

export const codeStore = new Map<string, { code: string; expiresAt: number }>();

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function twoStepVerificationRoutes(server: FastifyInstance) {
  server.post('/verify-2fa', async (request: FastifyRequest, reply: FastifyReply) => {
    const { code2fa, email2fa } = request.body as { code2fa: string; email2fa: string };

    const stored = codeStore.get(email2fa);
    if (!stored) {
      return reply.status(400).send({ success: false, message: 'No code found for this email.' });
    }

    const now = Date.now();
    if (now > stored.expiresAt) {
      codeStore.delete(email2fa);
      return reply.status(400).send({ success: false, message: 'Code expired.' });
    }

    if (stored.code !== code2fa) {
      return reply.status(400).send({ success: false, message: 'Invalid code.' });
    }

    codeStore.delete(email2fa);

    return reply.send({ success: true, message: '2FA verified successfully.' });
  });
}