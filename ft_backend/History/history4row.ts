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
	server.post("/History/RowHistory", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

		const { color, win, date } = request.body as {
			color: string;
			win: number;
			date: string;
		};
    if (color === null || win > 2 || win < 0) {
      return reply.status(400).send({ success: false, error: "Invalid data" });
    }

    if (color !== "red") {
      if (color !== "yellow") {
        return reply.status(400).send({ success: false, error: "Invalid color" });
      }
    }

    let result;
    
    if (win === 1) {
      result = "win";
    }
    else if (win === 2) {
      result = "draw";
    }
    else {
      result = "lose";
    }

		try {
			db.prepare(`
				INSERT INTO RowHistory (user_id, color, win, playedAt)
				VALUES (?, ?, ?, ?, ?)
			`).run(user.id, color, result, date);
	
			return reply.status(200).send({
				success: true,
				message: "History updated",
			});
		} catch (error) {
			request.log?.error?.(error);
    		return reply.status(500).send({ success: false, message: "Database error" });
		}
	})

	server.get("/History/Row", async (request, reply) => {
		const cookies = request.cookies;
		const user = request.session.user;

		if (!user)
			return reply.status(400).send({ success: false, error: "User disconnected" });

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