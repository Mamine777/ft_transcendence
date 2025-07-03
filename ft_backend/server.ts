/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou>                        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/07/03 17:16:47 by mokariou         ###   ########.fr       */
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


const server = fastify();


declare module "@fastify/session" {
  interface FastifySessionObject {
    user?: { id: number; email: string };
  }
}
server.register(fastifyJwt, { secret: 'Black-White' });
server.register(fastifySession, {
  secret: 'a-very-secret-key-must-be-32-characters',
  cookie: { secure: false }, // set to true if using HTTPS
  saveUninitialized: false,
});

server.register(fastifyStatic, {
	root: path.join(__dirname, "../ft_frontend"),
	prefix: "/",
});

server.register(fastifyFormbody);
server.register(loginPlugin);
FriendsRoutes(server);
LoginRoutes(server);
DashboardRoutes(server);
 db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT`);
twoStepVerificationRoutes(server);
server.register(fastifyMultipart);


server.listen({ port: 3000 }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("server is running 🚀");
});
