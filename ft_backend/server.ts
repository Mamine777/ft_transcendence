/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: armitite <armitite@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/14 17:49:22 by armitite         ###   ########.fr       */
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


interface user {
	id: number;
	username: string;
	email: string;
	password: string;
}

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

// here i created the dabase if it doesnt exist and also I added the tables that conain the pas user...
//big man ting

// here I register the path where the frontend is
server.register(fastifyStatic, {
	root: path.join(__dirname, "../ft_frontend"),
	prefix: "/",
});

server.register(fastifyFormbody);

server.post("/check", async (request, reply) => {
	const {email, password} = request.body as {email : string, password : string};
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;


	if (!email || !emailRegex.test(email))
	{
		return reply.status(400).send({ success: false, message: "Invalid email format" });
	}
	if (!password || !passwordRegex.test(password))
	{
		return reply.status(400).send({
			success: false,
			message: "Password must be at least 8 characters long, include 1 capital letter, and 1 special character.",
		  });	
	}
	
		const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
		const user = sql_stmt_user.get(email) as user;
		console.log(user);
		
		if (!user)
		{
			return reply.status(400).send({ success: false, message: "User not found!" });
		}
		//const bcrypt = require("bcrypt");
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
		{
			return reply.status(400).send({ success: false, message: "credential doesnt match!" });
		}
		else
		{
			request.session.user = { id: user.id, email: user.email };
			return reply.status(200).send({ success: false, message: "You have Succefully logged In", switch: true});

		}
	});

server.get("/me", async (request, reply) =>{
	if (request.session.user)
		return reply.send({ loggedIn: true, user: request.session.user });
	else
		return reply.send({ loggedIn: false });	
});

server.post("/logout", async (request, reply) => {
	request.session.destroy(err => {
		if (err) return reply.status(500).send({ success: false, message: "Logout failed" });
		reply.send({ success: true, message: "Logged out" });
	});
});

server.post("/check-signup", async (request, reply) => {
	const { signupEmail, signupPassword, username } = request.body as {
		signupEmail: string;
		signupPassword: string;
		username: string;
	};
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
	if (!signupEmail || !emailRegex.test(signupEmail))
		{
			return reply.status(400).send({ success: false, message: "Invalid email format" });
		}
		if (!signupPassword || !passwordRegex.test(signupPassword))
		{
			return reply.status(400).send({
				success: false,
				message: "Password must be at least 8 characters long, include 1 capital letter, and 1 special character.",
			  });	
		}
	
	let hashedPassword = "";

		const bcrypt = require("bcrypt");
		const saltrounds = 10;
		hashedPassword = await bcrypt.hash(signupPassword, saltrounds);
		console.log(hashedPassword);

		// Check if the email already exists in the database biG man
		const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?');
		const existingUser = sql_stmt_user.get(signupEmail, username) as user;

		if (existingUser) {
			if (existingUser.email === signupEmail) {
				return reply.status(400).send({ success: false, message: "Email already registered." });
			}
			if (existingUser.username === username) {
				return reply.status(400).send({ success: false, message: "Username already taken." });
			}
		}

		// Insert the new user into the database
		const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
		stmt.run(username, signupEmail, hashedPassword);
		return reply.send({ success: true, message: `User registered successfully!\n\n *import !!! this is your secret phrase incase you trying to change your password we will ask for it ${hashedPassword}` });
	});


server.post("/check-forgot", async (request, reply) => {
	const { email, secretKey, newpassword } = request.body as { email: string; secretKey: string; newpassword: string };

	if (!email || !secretKey || !newpassword) {
		return reply.status(400).send({ success: false, message: "Missing required fields" });
	  }		  
		const sql_stmt_user = db.prepare('SELECT * FROM users WHERE email = ?');
		const user = sql_stmt_user.get(email) as user;

		if (!user) {
			return reply.status(400).send({ success: false, message: "Couldn't find matching email in the server!" });
		}
		console.log(` this the original ${user.password} the new one ${secretKey}`)
		if (user.password === secretKey) {
			const bcrypt = require("bcrypt");
			const saltrounds = 10;
			const hashedPassword = await bcrypt.hash(newpassword, saltrounds);

			const stmt = db.prepare("UPDATE users SET password = ? WHERE email = ?");
			stmt.run(hashedPassword, email);

			return reply.status(200).send({ success: true, message: "Password has been updated!" });
		} else {
			return reply.status(400).send({ success: false, message: "Secret Key is wrong!" });
		}
	});
//here I create a port where we can access the server
server.listen({ port: 3000 }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("server is running 🚀");
});

server.post("/dashboard", async (request, reply) =>{
	
});

// to compile use command "npm install " && then "npx ts-node server.ts"