var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
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
export function send2FACode(to, code) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            from: '"ft_transcendance" <amine79801kar@gmail.com>',
            to,
            subject: 'Account Validation',
            html: `
      <h2>Your 2FA Code</h2>
      <p style="font-size: 18px;"><strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
        });
    });
}
