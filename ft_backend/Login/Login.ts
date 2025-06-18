import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";


// This interface is because typescript need a typer of user
export interface user {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Here I export the function and you can use it in server.ts as 'LoginRoutes'
export function LoginRoutes(server: FastifyInstance) {
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
}