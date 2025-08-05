var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from '../db/db';
export function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export function twoStepVerificationRoutes(server) {
    server.post('/verify-2fa', (request, reply) => __awaiter(this, void 0, void 0, function* () {
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
        const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = sql_stmt_user.get(pending2FA.email);
        if (!user) {
            return reply.status(400).send({ success: false, message: "User not found!" });
        }
        // @ts-ignore: Extend session user to include username
        request.session.user = { id: user.id, email: user.email, username: user.username };
        delete request.session.pending2FA;
        const token = yield reply.jwtSign({
            id: user.id,
            email: user.email,
            username: user.username
        });
        return reply.send({ success: true, token, message: '2FA verified successfully.' });
    }));
}
