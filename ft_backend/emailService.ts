import nodemailer from 'nodemailer';
import { FastifyInstance } from "fastify";
import { user } from './Login/Login'; 
import { request } from "http";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '90917c001@smtp-brevo.com',
    pass: process.env.BREVO_API_KEY,
  },
});

export async function send2FACode(to:string, code: string): Promise<void>
{
    await transporter.sendMail({
        from: '"ft_transcendance" <amine79801kar@gmail.com>',
        to,
        subject: 'Account Validation',
        html: `
      <h2>Your 2FA Code</h2>
      <p style="font-size: 18px;"><strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
    })
}