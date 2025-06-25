import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";
import { user } from '../Login/Login'; 
import { request } from "http";
import '@fastify/session';

declare module '@fastify/session' {
  interface Session {
    user?: {
      id: number;
      email: string;
      username: string;
    };
  }
}

export function DashboardRoutes(server: FastifyInstance) {
 server.post("/check-settings", async (request, reply) => {
	const { newUsername, newEmail, newPassword } = request.body as {
		newUsername: string;
		newEmail: string;
		newPassword: string;
	};

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

	const userId = request.session.user?.id;
	if (!userId) {
		return reply.status(400).send({ success: false, message: "User not logged in" });
	}

	if (newEmail && !emailRegex.test(newEmail)) {
		return reply.status(400).send({ success: false, message: "Invalid email format" });
	}
	if (newPassword && !passwordRegex.test(newPassword)) {
		return reply.status(400).send({
			success: false,
			message: "Password must be at least 8 characters long, include 1 capital letter, and 1 special character.",
		});
	}
	if (newUsername && newUsername.length < 3) {
		return reply.status(400).send({ success: false, message: "Username must be at least 3 characters long" });
	}

	// Check if email or username is already taken by another user
	const checkStmt = db.prepare('SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?');
	const existingUser = checkStmt.get(newEmail, newUsername, userId) as { email?: string; username?: string } | undefined;
	if (existingUser) {
		if (existingUser.email === newEmail) {
			return reply.status(400).send({ success: false, message: "Email already registered." });
		}
		if (existingUser.username === newUsername) {
			return reply.status(400).send({ success: false, message: "Username already taken." });
		}
	}

	// Prepare dynamic update
	const fields: string[] = [];
	const values: any[] = [];

	if (newUsername) {
		fields.push("username = ?");
		values.push(newUsername);
	}
	if (newEmail) {
		fields.push("email = ?");
		values.push(newEmail);
	}
	if (newPassword) {
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		fields.push("password = ?");
		values.push(hashedPassword);
	}

	if (fields.length === 0) {
		return reply.status(400).send({ success: false, message: "No changes submitted." });
	}

	values.push(userId);
	const updateStmt = db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`);
	updateStmt.run(...values);

	return reply.status(200).send({ success: true, message: "Settings updated successfully", switch: true });

	});
	server.get('/user', (request, response) =>{
		if (!request.session.user) {
			return response.send({ loggedIn: false });
		  }
		  const user = request.session.user;
		  return response.send({
			loggedIn: true,
			//username: user.username,
			email: user.email,
		  });
	})
}