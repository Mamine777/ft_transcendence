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

export function History4RowRoutes(server: FastifyInstance) {
	server.post("/History/UpdateRow", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		const { color, date } = request.body as {
			color: string;
			date: string;
		};
    if (color === null) {
      return reply.status(400).send({ success: false, error: "Invalid data" });
    }

    if (color !== "red") {
      if (color !== "yellow") {
        return reply.status(400).send({ success: false, error: "Invalid color" });
      }
    }

		try {
			db.prepare(`
				INSERT INTO RowHistory (user_id, color, playedAt)
				VALUES (?, ?, ?, ?)
			`).run(user.id, color, date);
	
			return reply.status(200).send({
				success: true,
				message: "History updated",
			});
		} catch (error) {
			request.log?.error?.(error);
    		return reply.status(500).send({ success: false, message: "Database error" });
		}
	})

	server.get("/History/RowHistory", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		const getUserAllStmt = db.prepare(`SELECT * FROM RowHistory WHERE user_id = ?`);
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