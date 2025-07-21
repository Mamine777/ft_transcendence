"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = generateCode;
exports.twoStepVerificationRoutes = twoStepVerificationRoutes;
const db_1 = __importDefault(require("../db/db"));
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function twoStepVerificationRoutes(server) {
    server.post('/verify-2fa', async (request, reply) => {
        const { code2fa } = request.body;
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
        const sql_stmt_user = db_1.default.prepare('SELECT * FROM users WHERE email = ?');
        const user = sql_stmt_user.get(pending2FA.email);
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
        return reply.send({ success: true, token, message: '2FA verified successfully.' });
    });
}
