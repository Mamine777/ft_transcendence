/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mokariou <mokariou@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/04 12:50:57 by mokariou          #+#    #+#             */
/*   Updated: 2025/06/06 12:08:18 by mokariou         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fastify from "fastify";
import path from 'path'
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import { request } from 'http';
import { register } from 'module';
import sqlite3 from "sqlite3";


// here I create the server
const server = fastify();

// here I register the path where the frontend is
server.register(fastifyStatic, {
	root: path.join(__dirname, "../../ft_frontend"),
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
	//TEMPerrory until we have a database
	return reply.send({ success: true, message: "Validation successful." });
	//armand here check the password and the email if they exists in the dabase if not return "no matching credntials"
	// else I already return a success message its in comments and make sure you send the right status codes
	//return reply.send({ success: true, message: "Login successful", user: user[0] });
});

//lets create a database

server.post("/check-signup", async (request, reply) => {
	// Add your logic for handling sign-up here
	reply.send({ success: true, message: "Sign-up endpoint reached." });
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