"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou>                        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/07/14 13:03:22 by mokariou         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const session_1 = __importDefault(require("@fastify/session"));
const Login_1 = require("./Login/Login");
const Dashboard_1 = require("./Dashboard/Dashboard");
const Login_2 = __importDefault(require("./Login/Login"));
const friends_1 = require("./Friends/friends");
const twoFactor_1 = require("./routes/twoFactor");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const history_1 = require("./History/history");
const server = (0, fastify_1.default)();
server.register(cookie_1.default);
server.register(jwt_1.default, {
    secret: 'Black-White',
    verify: {
        extractToken: (request) => {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                return authHeader.slice(7);
            }
            return undefined;
        }
    }
});
server.register(session_1.default, {
    secret: 'a-very-secret-key-must-be-32-characters',
    cookie: { secure: false }, // set to true if using HTTPS
    saveUninitialized: false,
});
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '/avatars'),
    prefix: '/avatars/',
    decorateReply: false
});
server.register(static_1.default, {
    root: path_1.default.join(__dirname, "../ft_frontend"),
    prefix: "/",
});
server.register(cors_1.default, {
    origin: ["http://localhost:5173"],
    credentials: true,
});
server.register(formbody_1.default);
server.register(Login_2.default);
(0, history_1.HistoryRoutes)(server);
(0, friends_1.FriendsRoutes)(server);
(0, Login_1.LoginRoutes)(server);
(0, Dashboard_1.DashboardRoutes)(server);
(0, twoFactor_1.twoStepVerificationRoutes)(server);
server.register(multipart_1.default);
server.listen({ port: 3000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("server is running 🚀");
});
