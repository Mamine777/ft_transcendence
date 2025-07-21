"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send2FACode = send2FACode;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: '90917c001@smtp-brevo.com',
        pass: process.env.BREVO_API_KEY,
    },
});
async function send2FACode(to, code) {
    await transporter.sendMail({
        from: '"ft_transcendance" <amine79801kar@gmail.com>',
        to,
        subject: 'Account Validation',
        html: `
      <h2>Your 2FA Code</h2>
      <p style="font-size: 18px;"><strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
    });
}
