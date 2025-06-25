import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";
import fp from 'fastify-plugin';
import 'dotenv/config';
import fastifyOauth2, { OAuth2Namespace } from '@fastify/oauth2';
import { request } from "https";
import { user } from '../Login/Login'; 

export function FriendsRoutes(server: FastifyInstance) {

	server.post("/AddFriend", async (request, reply) => {
		// faire protection au cas ou username = sender username
		const { message } = request.body as { message: string};

		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		console.log("Cookies : ", cookies);
		console.log("User : ", user);
		console.log("User : ", user?.email);

		const sql_stmt_username = db.prepare('SELECT username FROM users WHERE email = ?');
		const sender_username = sql_stmt_username.get(user?.email) as user;
		
		console.log("Username sender : ", sender_username);

		if (!message) {
			return reply.status(400).send({ success: false, error: "No msg provided" });
		}

		const sql_stmt_user = db.prepare('SELECT id FROM users WHERE username = ?');
		const id_recv = sql_stmt_user.get(message) as user;
		console.log("Le id :", id_recv);
		if (!id_recv)
			return reply.status(400).send({ success: false, error: "User does not exists" });

		const stmt = db.prepare("INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)");
		stmt.run(id_recv.id, sender_username.username, "pending");
	
		console.log("Msg recu :", message);
		return reply.send({ succes: true, received: message});
	})

	server.get("/FriendRequest", async (request, reply) => {

		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		console.log("Cookies : ", cookies);
		console.log("User : ", user);
		console.log("User id : ", user?.id);

		const sql_stmt_username = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ?');
		const sender_username = sql_stmt_username.all(user?.id, 'pending');
		
		console.log("Result sql : ", sender_username);

		// const sql_stmt_user = db.prepare('SELECT id FROM users WHERE username = ?');
		// const id_recv = sql_stmt_user.get(message) as user;
		// console.log("Le id :", id_recv);
		// if (!id_recv)
		// 	return reply.status(400).send({ success: false, error: "User does not exists" });

		// const stmt = db.prepare("INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)");
		// stmt.run(id_recv.id, sender_username.username, "pending");
	
		// console.log("Msg recu :", message);
		return reply.send({ succes: true, received: sender_username});
	})
}