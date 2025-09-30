import fastify, { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { Server } from 'http';
import { send2FACode } from '../emailService';
import db from '../db/db';

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function twoStepVerificationRoutes(server: FastifyInstance) {
  server.post('/verify-2fa', async (request: FastifyRequest, reply: FastifyReply) => {
    const { code2fa } = request.body as { code2fa: string };
    const pending2FA = request.session.pending2FA;
    
    if (!pending2FA) {
      return reply.status(400).send({ success: false, message: 'No 2FA code pending.' });
    }
    if (Date.now() > pending2FA.expiresAt) {
      delete request.session.pending2FA;
      return reply.status(400).send({ success: false, message: 'Code expired.' });
    }

    if (pending2FA.code !== code2fa) {
      return reply.status(400).send({ success: false, message: 'Invalid code.' });
    }

    interface User {
      id: number;
      email: string;
      username: string;
      [key: string]: any;
    }
    const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = sql_stmt_user.get(pending2FA.email) as User | undefined;
    if (!user) {
      return reply.status(400).send({ success: false, message: "User not found!" });
    }
    // @ts-ignore: Extend session user to include username
    
    request.session.user = { id: user.id, email: user.email, username: user.username };
    delete request.session.pending2FA;
    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      username: user.username
    });

    return reply.send({ success: true, token ,message: '2FA verified successfully.' });
  });
}