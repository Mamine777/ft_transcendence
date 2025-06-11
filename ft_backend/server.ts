/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/11 18:01:31 by mokariou         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fastify from "fastify";
import path from 'path'
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import { request } from 'http';
import { register } from 'module';
import sqlite3 from "sqlite3";
import { error } from "console";
import bcrypt from "bcrypt";


// here I create the server
const server = fastify();

// here i created the dabase if it doesnt exist and also I added the tables that conain the pas user...
//big man ting
sqlite3.verbose();

const db = new sqlite3.Database("db/database.db", (err) =>{
	if (err)
		console.log("couldn't connect to the databse", err);
	else
		console.log("Succefully connected to dabase sqLite")
});

db.run(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL
	)
`);

// here I register the path where the frontend is
server.register(fastifyStatic, {
	root: path.join(__dirname, "../ft_frontend"),
	prefix: "/",
});

server.register(fastifyFormbody);

server.post("/check", async (request, reply) =>{
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
	try
	{
		const user =  await new Promise<any>((resolve, reject) =>{
			db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
				if (err) return reject(err);
				resolve(row);
			});
		});
		if (!user)
		{
			return reply.status(400).send({ success: false, message: "credential doesnt match!" });
		}
		const bcrypt = require("bcrypt");
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch)
		{
			return reply.status(400).send({ success: false, message: "credential doesnt match!" });
		}
		else
		{
			return reply.status(400).send({ success: false, message: "You have Succefully logged In" });

		}
	}
	catch (err) {
		console.error("Database error:", err);
		return reply.status(500).send({ success: false, message: "Internal server error." });
	}
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
	
	let hashedPassword = ""; // Define hashedPassword outside the try block

	try {
		const bcrypt = require("bcrypt");
		const saltrounds = 10;
		hashedPassword = await bcrypt.hash(signupPassword, saltrounds);
		console.log(hashedPassword);

		// Check if the email already exists in the database biG man
		const existingUser = await new Promise<any>((resolve, reject) => {
			db.get("SELECT * FROM users WHERE email = ? OR username = ?", [signupEmail, username], (err, row) => {
				if (err) return reject(err);
				resolve(row);
			});
		});

		if (existingUser) {
			if (existingUser.email === signupEmail) {
				return reply.status(400).send({ success: false, message: "Email already registered." });
			}
			if (existingUser.username === username) {
				return reply.status(400).send({ success: false, message: "Username already taken." });
			}
		}

		// Insert the new user into the database
		await new Promise<void>((resolve, reject) => {
			db.run(
				"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
				[username, signupEmail, hashedPassword],
				(err) => {
					if (err) return reject(err);
					resolve();
				}
			);
		});
		return reply.send({ success: true, message: `User registered successfully!\n\n *import !!! this is your secret phrase incase you trying to change your password we will ask for it ${hashedPassword}` });
	} catch (err) {
		return reply.status(500).send({ 
			success: false, 
			message: "Failed to register user.",   
			importantNote: "*Important!!! This is your secret phrase. In case you're trying to change your password, we will ask for it:",
			secret: `${hashedPassword}`,
			});
	}
});


server.post("/check-forgot", async (request, reply) => {
	const { email, secretKey, newpassword } = request.body as { email: string; secretKey: string; newpassword: string };

	try {
		const user = await new Promise<any>((resolve, reject) => {
			db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
				if (err) return reject(err);
				resolve(row);
			});
		});

		if (!user) {
			return reply.status(400).send({ success: false, message: "Couldn't find matching email in the server!" });
		}

		if (user.password === secretKey) {
			const bcrypt = require("bcrypt");
			const saltrounds = 10;
			const hashedPassword = await bcrypt.hash(newpassword, saltrounds);

			await new Promise<void>((resolve, reject) => {
				db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
					if (err) return reject(err);
					resolve();
				});
			});

			return reply.status(200).send({ success: true, message: "Password has been updated!" });
		} else {
			return reply.status(400).send({ success: false, message: "Secret Key is wrong!" });
		}
	} catch (err) {
		console.error("Database error:", err);
		return reply.status(500).send({ success: false, message: "Internal server error." });
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


// to compile use command "npm install " && then "npx ts-node server.ts"