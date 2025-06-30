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

	server.get("/FriendList", async (request, reply) => {

		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		console.log("Cookies : ", cookies);
		console.log("User : ", user);
		console.log("User id : ", user?.id);

		const sql_stmt_username = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ?');
		const sender_username = sql_stmt_username.all(user?.id, 'friend');
		
		return reply.send({ succes: true, received: sender_username});
	})

	server.post("/AcceptRequest", async (request, reply) => {

		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		const { message } = request.body as { message: string};

		if (!message) {
			return reply.status(400).send({ success: false, error: "No msg provided" });
		}

		console.log("Cookies : ", cookies);
		console.log("User : ", user);
		console.log("User id : ", user?.id);

		console.log("ici");
		
		type FriendRow = { friend: string };
		type UsernameRow = { username: string };
		type IdRow = { id: number };

		const sql_stmt_username_request = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ? AND friend = ?');
		const sender_username = sql_stmt_username_request.get(user?.id, 'pending', message) as FriendRow;

		const sql_stmt_username = db.prepare('SELECT username FROM users WHERE id = ?');
		const username = sql_stmt_username.get(user?.id)  as UsernameRow;

		const sql_stmt_id = db.prepare('SELECT id FROM users WHERE username = ?');
		const accepted_id = sql_stmt_id.get(message) as IdRow;
		
		console.log("La personne qui va etre add : ", sender_username);
		console.log("Son id : ", accepted_id);
		console.log("type de user.id :", typeof user?.id);
		console.log("type de sender_username :", typeof sender_username);


		try {
			const sql_stmt_create_friend = db.prepare('INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)');
			sql_stmt_create_friend.run(user?.id, sender_username?.friend, 'friend');
			sql_stmt_create_friend.run(accepted_id?.id, username?.username, 'friend');

			const sql_stmt_delete_pending = db.prepare('DELETE FROM friends WHERE user_id = ? AND friend = ? AND status = ?');
			sql_stmt_delete_pending.run(user?.id, sender_username?.friend, 'pending');

			console.log("id user : ", user?.id);
			console.log("sender username friend: ", sender_username?.friend);
		}
		catch (error) {
			console.log("Error during insert friend");
		}

		return reply.send({ succes: true, received: sender_username});
	})
}