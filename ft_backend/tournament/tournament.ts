/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: najeuneh <najeuneh@student.s19.be>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/26 14:04:28 by mokariou          #+#    #+#             */
/*   Updated: 2025/08/05 15:43:19 by najeuneh         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fastify, { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { Server } from 'http';
import { send2FACode } from '../emailService';
import db from '../db/db';

interface Tournament {
  players: string[];
  matches: Match[];
  currentMatchIndex: number;
}

interface Match {
  player1: string;
  player2: string;
  winner?: string;
}

let tournament: Tournament | null = null;

export function tournaments(server: FastifyInstance) {
  server.post("/tournament/start", async (req, reply) =>{
    const { players } = req.body as { players: string[] };
    const user = req.session.user;

    if (!user)
      return reply.status(400).send({ success: false, received: "User disconnected" });

    try {
      await req.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(players) || players.length < 2)
        reply.status(400).send({success : false ,message: "At least 2 players required" });
    const matches : Match[] = [];
    for (let i = 0 ; i < players.length ; i++)
      for (let j = i + 1; j < players.length ; j++)
            matches.push({ player1: players[i], player2: players[j] });
      tournament = {
      players,
      matches,
      currentMatchIndex: 0,
    };
    reply.status(200).send({success : true, message: "Tournament started", totalMatches: matches.length});
  })
  server.get("/tournament/next", async (request, reply) => {
    if (!tournament) return reply.status(400).send({ message : "No tournament active" });
    const user = request.session.user;

    if (!user)
      return reply.status(400).send({ success: false, received: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    
  })

  server.post("/tournament/result", async (request, reply) => {
  const { winner } = request.body as { winner: string };
  const user = request.session.user;

  if (!tournament) return reply.status(400).send({ error: "No tournament active" });
  if (!user)
      return reply.status(400).send({ success: false, received: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

  const match = tournament.matches[tournament.currentMatchIndex];
  if (!match) return reply.status(400).send({ error: "No match in progress" });

  if (![match.player1, match.player2].includes(winner)) {
    return reply.status(400).send({ error: "Invalid winner" });
  }

  match.winner = winner;
  tournament.currentMatchIndex += 1;

  reply.send({ message: "Result recorded" });
});

  server.post("/tournament/reset", async (request, reply) => {
    const user = request.session.user;
    if (!user)
        return reply.status(400).send({ success: false, received: "User disconnected" });

      try {
        await request.jwtVerify();
      } catch (err) {
        console.log("❌ Unauthorized: JWT verification failed");
        return reply.code(401).send({ success: false, message: "Unauthorized" });
      }

    tournament = null;
    reply.send({ message: "Tournament reset" });
  });
}
