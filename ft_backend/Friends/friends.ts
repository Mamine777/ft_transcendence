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
        const { message } = request.body as { message: string };

        const cookies = request.cookies;
        const user = request.session.user;

        if (!user)
            return reply.status(400).send({ success: false, error: "User disconnected" });

        const sqlStmtUsername = db.prepare('SELECT username FROM users WHERE email = ?');
        const sender = sqlStmtUsername.get(user.email) as { username: string };
        if (!sender)
            return reply.status(400).send({ success: false, error: "Sender not found" });

        if (!message)
            return reply.status(400).send({ success: false, error: "No username provided" });

        if (message === sender.username)
            return reply.status(400).send({ success: false, error: "Cannot add yourself as a friend" });

  
        const sqlStmtUser = db.prepare('SELECT id FROM users WHERE username = ?');
        const receiver = sqlStmtUser.get(message) as { id: number };
        if (!receiver)
            return reply.status(400).send({ success: false, error: "User does not exist" });

        const checkPending = db.prepare(
            'SELECT 1 FROM friends WHERE user_id = ? AND friend = ? AND status = ?'
        );
        const pendingExists = checkPending.get(receiver.id, sender.username, 'pending');
        if (pendingExists)
            return reply.status(400).send({ success: false, error: "Invitation already pending" });

        const checkFriend = db.prepare(
            'SELECT 1 FROM friends WHERE user_id = ? AND friend = ? AND status = ?'
        );
        const alreadyFriends = checkFriend.get(receiver.id, sender.username, 'friend');
        if (alreadyFriends)
            return reply.status(400).send({ success: false, error: "You are already friends" });

        const insertStmt = db.prepare(
            'INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)'
        );
        insertStmt.run(receiver.id, sender.username, 'pending');

        return reply.send({ success: true, received: message });
    });

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