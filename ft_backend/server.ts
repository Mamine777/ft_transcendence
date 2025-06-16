/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou>                        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/16 14:38:19 by mokariou         ###   ########.fr       */
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
// How it works, is just you put export before a function, 
// so you do a function that takes the server as parameter,
// Then put all the routes inside so the function handles all the routes and then
// You can export it as a module, but this can be done only if we use

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
server.listen({ port: 3000 }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("server is running 🚀");
});
