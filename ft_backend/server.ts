/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: armitite <armitite@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/24 16:35:30 by armitite         ###   ########.fr       */
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
import { LoginRoutes } from './Login/Login'; // This is the 'Module' that I made
import { DashboardRoutes } from './Dashboard/Dashboard';
import { FriendsRoutes } from "./Friends/friends";


// here I create the server
const server = fastify();


declare module "@fastify/session" {
  interface FastifySessionObject {
    user?: { id: number; email: string };
  }
}

server.register(fastifyCookie);
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

LoginRoutes(server);
DashboardRoutes(server);
FriendsRoutes(server);


server.listen({ port: 3000 }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("server is running 🚀");
});
