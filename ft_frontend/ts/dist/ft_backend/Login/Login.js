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
import bcrypt from "bcrypt";
import fp from 'fastify-plugin';
import 'dotenv/config';
import fastifyOauth2 from '@fastify/oauth2';
import { generateCode } from '../routes/twoFactor';
import { send2FACode } from "../emailService";
export function LoginRoutes(server) {
    server.post("/login-check", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!email || !emailRegex.test(email)) {
            return reply.status(400).send({ success: false, message: "Invalid email format" });
        }
        const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = sql_stmt_user.get(email);
        console.log(user);
        if (!user) {
            return reply.status(400).send({ success: false, message: "credential doesnt match!" });
        }
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return reply.status(400).send({ success: false, message: "credential doesnt match!" });
        }
        const code = generateCode();
        request.session.pending2FA = {
            email,
            code,
            expiresAt: Date.now() + 5 * 60 * 1000,
        };
        try {
            yield send2FACode(email, code);
            console.log(`2FA code sent to ${email}: ${code}`);
            return reply.status(200).send({ success: false, message: "You have Succefully logged In", switch: true, twoFA: true });
        }
        catch (error) {
            console.error("2FA email error:", error);
            return reply.status(500).send({ success: false, message: "Failed to send 2FA code" });
        }
    }));
    server.get('/me', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield request.jwtVerify();
            return reply.send({ loggedIn: true, user: request.user });
        }
        catch (err) {
            if ((_a = request.session) === null || _a === void 0 ? void 0 : _a.pending2FA) {
                return reply.send({ loggedIn: false, needs2FA: true });
            }
            return reply.send({ loggedIn: false });
        }
    }));
    server.post("/logout", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield request.jwtVerify();
            request.session.destroy((err) => {
                if (err)
                    return reply.status(500).send({ success: false, message: "Logout failed" });
                reply.send({ success: true, message: "Logged out" });
            });
        }
        catch (error) {
            return reply.status(500).send({ success: false, message: "Logout failed" });
        }
    }));
    server.post("/check-signup", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { signupEmail, signupPassword, username } = request.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!signupEmail || !emailRegex.test(signupEmail)) {
            return reply.status(400).send({ success: false, message: "Invalid email format" });
        }
        if (!signupPassword || !passwordRegex.test(signupPassword)) {
            return reply.status(400).send({
                success: false,
                message: "Password must be at least 8 characters long, include 1 capital letter, and 1 special character.",
            });
        }
        let hashedPassword = "";
        const bcrypt = require("bcrypt");
        const saltrounds = 10;
        hashedPassword = yield bcrypt.hash(signupPassword, saltrounds);
        console.log(hashedPassword);
        const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?');
        const existingUser = sql_stmt_user.get(signupEmail, username);
        if (existingUser) {
            if (existingUser.email === signupEmail) {
                return reply.status(400).send({ success: false, message: "Email already registered." });
            }
            if (existingUser.username === username) {
                return reply.status(400).send({ success: false, message: "Username already taken." });
            }
        }
        const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        stmt.run(username, signupEmail, hashedPassword);
        return reply.send({ success: true, message: `User registered successfully!\n\n *import !!! this is your secret phrase incase you trying to change your password we will ask for it`, secret: hashedPassword });
    }));
    //cenceling2FA
    server.post('/auth/cancel-2fa', (request, reply) => {
        request.session.pending2FA = undefined;
        request.session.user = undefined;
        reply.send({ success: true, message: '2FA session canceled' });
    });
    server.post("/check-forgot", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { email, secretKey, newpassword } = request.body;
        if (!email || !secretKey || !newpassword) {
            return reply.status(400).send({ success: false, message: "Missing required fields" });
        }
        const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = sql_stmt_user.get(email);
        if (!user) {
            return reply.status(400).send({ success: false, message: "Couldn't find matching email in the server!" });
        }
        console.log(` this the original ${user.password} the new one ${secretKey}`);
        if (user.password === secretKey) {
            const bcrypt = require("bcrypt");
            const saltrounds = 10;
            const hashedPassword = yield bcrypt.hash(newpassword, saltrounds);
            const stmt = db.prepare("UPDATE users SET password = ? WHERE email = ?");
            stmt.run(hashedPassword, email);
            return reply.status(200).send({ success: true, message: "Password has been updated!" });
        }
        else {
            return reply.status(400).send({ success: false, message: "Secret Key is wrong!" });
        }
    }));
}
function generateRandomUsername() {
    const adjectives = [
        "Swift", "Silent", "Brave", "Clever", "Lucky", "Mighty", "Happy", "Fuzzy", "Chill", "Witty"
    ];
    const nouns = [
        "Tiger", "Falcon", "Otter", "Wolf", "Panda", "Eagle", "Shark", "Lion", "Bear", "Fox"
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${adjective}${noun}${number}`;
}
export default fp((fastify) => __awaiter(void 0, void 0, void 0, function* () {
    const FORTYTWO_CONFIGURATION = {
        authorizeHost: 'https://api.intra.42.fr',
        authorizePath: '/oauth/authorize',
        tokenHost: 'https://api.intra.42.fr',
        tokenPath: '/oauth/token'
    };
    fastify.register(fastifyOauth2, {
        name: 'fortytwoOAuth2',
        scope: ['public'],
        credentials: {
            client: {
                id: process.env.FT_CLIENT_ID,
                secret: process.env.FT_CLIENT_SECRET
            },
            auth: FORTYTWO_CONFIGURATION
        },
        startRedirectPath: '/auth/42',
        callbackUri: 'http://localhost:3000/auth/42/callback'
    });
    fastify.get('/auth/42/callback', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield fastify.fortytwoOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
        const userInfoRes = yield fetch('https://api.intra.42.fr/v2/me', {
            headers: {
                'Authorization': `Bearer ${token.token.access_token}`
            }
        });
        const userInfo = yield userInfoRes.json();
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(userInfo.email);
        if (!user) {
            const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
            stmt.run(userInfo.login, userInfo.email, '42-oauth');
            user = db.prepare('SELECT * FROM users WHERE email = ?').get(userInfo.email);
        }
        const code = generateCode();
        request.session.pending2FA = {
            email: userInfo.email,
            code,
            expiresAt: Date.now() + 5 * 60 * 1000
        };
        try {
            yield send2FACode(userInfo.email, code);
            console.log(`2FA code sent to ${userInfo.email}: ${code}`);
            return reply.redirect('http://localhost:5173/#twoFAView');
        }
        catch (error) {
            console.error("2FA email error:", error);
            return reply.status(500).send({ success: false, message: "Failed to send 2FA code" });
        }
    }));
    fastify.register(fastifyOauth2, {
        name: 'googleOAuth2',
        scope: ['profile', 'email'],
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID,
                secret: process.env.GOOGLE_CLIENT_SECRET
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION
        },
        startRedirectPath: '/auth/google',
        callbackUri: 'http://localhost:3000/auth/google/callback'
    });
    fastify.get('/auth/google/callback', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
        const userInfoRes = yield fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${token.token.access_token}`
            }
        });
        const userInfo = yield userInfoRes.json();
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(userInfo.email);
        if (!user) {
            const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
            stmt.run(userInfo.name || userInfo.email, userInfo.email, 'google-oauth');
            user = db.prepare('SELECT * FROM users WHERE email = ?').get(userInfo.email);
        }
        const code = generateCode();
        request.session.pending2FA = {
            email: userInfo.email,
            code,
            expiresAt: Date.now() + 5 * 60 * 1000
        };
        try {
            yield send2FACode(userInfo.email, code);
            console.log(`2FA code sent to ${userInfo.email}: ${code}`);
            return reply.redirect('http://localhost:5173/#twoFAView');
        }
        catch (error) {
            console.error("2FA email error:", error);
            return reply.status(500).send({ success: false, message: "Failed to send 2FA code" });
        }
    }));
}));
