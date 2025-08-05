/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: najeuneh <najeuneh@student.s19.be>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/26 14:04:28 by mokariou          #+#    #+#             */
/*   Updated: 2025/08/05 14:55:26 by najeuneh         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let tournament = null;
export function tournaments(server) {
    server.post("/tournament/start", (req, reply) => __awaiter(this, void 0, void 0, function* () {
        const { players } = req.body;
        const user = req.session.user;
        if (!user) {
            console.log("❌ User disconnected");
            return reply.status(400).send({ success: false, received: "User disconnected" });
        }
        try {
            yield req.jwtVerify();
        }
        catch (err) {
            return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
        if (!Array.isArray(players) || players.length < 2) {
            reply.status(400).send({ success: false, message: "At least 2 players required" });
        }
        const matches = [];
        for (let i = 0; i < players.length; i++)
            for (let j = i + 1; j < players.length; j++)
                matches.push({ player1: players[i], player2: players[j] });
        tournament = {
            players,
            matches,
            currentMatchIndex: 0,
        };
        reply.status(200).send({
            success: true,
            message: "Tournament started",
            totalMatches: matches.length,
            tournament,
        });
    }));
    server.get("/tournament/next", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        if (!tournament)
            return reply.status(400).send({ message: "No tournament active" });
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, received: "User disconnected" });
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            console.log("❌ Unauthorized: JWT verification failed");
            return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
    }));
    server.post("/tournament/result", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const { winner } = request.body;
        const user = request.session.user;
        if (!tournament)
            return reply.status(400).send({ error: "No tournament active" });
        if (!user)
            return reply.status(400).send({ success: false, received: "User disconnected" });
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            console.log("❌ Unauthorized: JWT verification failed");
            return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
        const match = tournament.matches[tournament.currentMatchIndex];
        if (!match)
            return reply.status(400).send({ error: "No match in progress" });
        if (![match.player1, match.player2].includes(winner)) {
            return reply.status(400).send({ error: "Invalid winner" });
        }
        match.winner = winner;
        tournament.currentMatchIndex += 1;
        reply.send({ message: "Result recorded" });
    }));
    server.post("/tournament/reset", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, received: "User disconnected" });
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            console.log("❌ Unauthorized: JWT verification failed");
            return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
        tournament = null;
        reply.send({ message: "Tournament reset" });
    }));
}
