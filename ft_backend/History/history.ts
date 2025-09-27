import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";
import fp from 'fastify-plugin';
import 'dotenv/config';
import fastifyOauth2, { OAuth2Namespace } from '@fastify/oauth2';
import { request } from "https";
import { user } from '../Login/Login'; 

export interface PongHistory {
  user_id: number;
  played: number;
  wins: number;
  scored: number;
}

export interface TournamentHistory {
  user_id: number;
  wins: number;
  loses: number;
}

export interface RowHistory {
  user_id: number;
  played: number;
  YellowWins: number;
  RedWins: number;
}

export function HistoryRoutes(server: FastifyInstance) {

	server.post("/TournamentWinner", async (request, reply) => {

		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });
		try {
			await request.jwtVerify();
		} catch (err) {
			console.log("❌ Unauthorized: JWT verification failed");
			return reply.code(401).send({ success: false, message: "Unauthorized" });
		}
		const { Result } = request.body as {
			Result: number;
		};

		if (Result === undefined || typeof Result !== "number" || Result > 1 || Result < 0) {
			return reply.status(400).send({ success: false, error: "Result must be 0 or 1" });
		}

		try {
			let sender_id = db.prepare(`
				SELECT user_id, wins, loses
				FROM TournamentHistory
				WHERE user_id = ?
			`).get(user.id) as TournamentHistory | undefined;
	
			if (!sender_id) {
				sender_id = {
					user_id: user.id,
					wins: 0,
					loses: 0
				}
					db.prepare(`
					INSERT INTO TournamentHistory (user_id, wins, loses)
					VALUES (?, ?, ?)
				`).run(user.id, 0, 0);
			}
			if (Result === 1) {
				 db.prepare(`
					UPDATE TournamentHistory
					SET wins = wins + 1
					WHERE user_id = ?
				`).run(user.id);
			}
			else {
				db.prepare(`
					UPDATE TournamentHistory
					SET loses = loses + 1
					WHERE user_id = ?
				`).run(user.id);
			}
	
			return reply.status(200).send({
				success: true,
				message: "History updated",
			});
		} catch (err) {
			request.log?.error?.(err);
			return reply.status(500).send({ success: false, error: "Database error" });
		}
	})

	server.get("/TournamentHistory", async (request, reply) => {

		const user = request.session.user
		if (!user) {
			return reply.status(400).send({ success: false, error: "User disconnected" });
		}
		try {
			await request.jwtVerify();
		} catch (err) {
			console.log("❌ Unauthorized: JWT verification failed");
			return reply.code(401).send({ success: false, message: "Unauthorized" });
		}
		try {
			const row = db.prepare(`
				SELECT user_id, wins, loses
				FROM TournamentHistory
				WHERE user_id = ?
			`).get(user.id) as { user_id: number; wins: number; loses: number } | undefined;

			if (!row) {
				return reply.status(200).send({
					success: true,
					user_id: user.id,
					wins: 0,
					loses: 0
				});
			}

			return reply.status(200).send({
				success: true,
				user_id: row.user_id,
				wins: row.wins ?? 0,
				loses: row.loses ?? 0
			});
			} catch (err) {
				request.log?.error?.(err);
				return reply.status(500).send({ success: false, error: "Database error" });
			}
		});

	server.get("/PlayerUsername", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;
		
		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });
		try {
			await request.jwtVerify();
		} catch (err) {
			console.log("❌ Unauthorized: JWT verification failed");
			return reply.code(401).send({ success: false, message: "Unauthorized" });
		}
		try {
			const row = db.prepare('SELECT username FROM users WHERE id = ?').get(user.id) as { username: string };
			const username = row.username;
			return reply.status(200).send({
				success: true,
				username: username
			});
		} catch (err) {
			request.log?.error?.(err);
			return reply.status(500).send({ success: false, error: "Database error" });
		}
	
	})

	server.post("/History/PongHistory", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		try {
			await request.jwtVerify();
		} catch (err) {
			console.log("❌ Unauthorized: JWT verification failed");
			return reply.code(401).send({ success: false, message: "Unauthorized" });
		}

		const { scoreleft, scoreright, mode, date } = request.body as {
			scoreleft: number;
			scoreright: number;
			mode: string;
			date: string;
		};
		if (scoreleft === null || scoreleft === undefined) {
			return reply.status(400).send({ success: false, error: "Missing scoreleft" });
		}

		try {
			db.prepare(`
				INSERT INTO PongHistory (user_id, scoreLeft, scoreRight, mode, playedAt)
				VALUES (?, ?, ?, ?, ?)
			`).run(user.id, scoreleft, scoreright, mode, date);
	
			return reply.status(200).send({
				success: true,
				message: "History updated",
			});
		} catch (error) {
			request.log?.error?.(error);
    		return reply.status(500).send({ success: false, message: "Database error" });
		}
	})

	server.get("/History/Pong", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		try {
			await request.jwtVerify();
		} catch (err) {
			console.log("❌ Unauthorized: JWT verification failed");
			return reply.code(401).send({ success: false, message: "Unauthorized" });
		}

		const getUserAllStmt = db.prepare(`SELECT * FROM PongHistory WHERE user_id = ?`);
		const matches = getUserAllStmt.all(user.id);

		if (!matches) {
			return reply.status(404).send({ success: false, error: "No matches played yet" });
		}
		return reply.status(200).send({
			success: true,
			matches
		});
	})

}