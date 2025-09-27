/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: najeuneh <najeuneh@student.s19.be>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/09/27 16:45:55 by najeuneh         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fastify from "fastify";
import path from 'path'
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { request } from 'http';
import { register } from 'module';
import db from './db/db'
import { error } from "console";
import bcrypt from "bcrypt";
import { REPLServer } from "repl";
import { LoginRoutes } from './Login/Login';
import { DashboardRoutes } from './Dashboard/Dashboard';
import loginPlugin from './Login/Login';
import crypto from 'crypto';
import { FriendsRoutes } from "./Friends/friends";
import { twoStepVerificationRoutes } from "./routes/twoFactor";
import fastifyMultipart from '@fastify/multipart';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { HistoryRoutes } from "./History/history";
import { History4RowRoutes } from "./History/history4row";
import { tournaments } from "./tournament/tournament";


const server = fastify();

server.register(fastifyCookie);

declare module "@fastify/session" {
  interface FastifySessionObject {
    user?: { id: number; email: string };
  }
}
server.register(fastifyJwt, {
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

server.register(fastifySession, {
  secret: 'a-very-secret-key-must-be-32-characters',
  cookie: { secure: false }, // set to true if using HTTPS
  saveUninitialized: false,
});

server.register(fastifyStatic, {
  root: path.join(__dirname, '/avatars'),
  prefix: '/avatars/',
  decorateReply: false
});
server.register(fastifyStatic, {
  root: path.join(__dirname, "../ft_frontend"),
  prefix: "/",
});

server.register(fastifyCors, {
	origin: ["http://localhost:5173"],
	credentials: true,
});

server.register(fastifyFormbody);
server.register(loginPlugin);
HistoryRoutes(server);
History4RowRoutes(server);
FriendsRoutes(server);
LoginRoutes(server);
DashboardRoutes(server);
twoStepVerificationRoutes(server);
tournaments(server);
server.register(fastifyMultipart);



server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("server is running 🚀");
});
