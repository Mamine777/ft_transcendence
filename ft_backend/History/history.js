"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRoutes = HistoryRoutes;
const db_1 = __importDefault(require("../db/db"));
require("dotenv/config");
function HistoryRoutes(server) {
    server.get("/AllHistory", async (request, reply) => {
        const user = request.session.user;
        if (!user)
            return reply.status(401).send({ success: false, error: "User disconnected" });
        try {
            await request.jwtVerify();
        }
        catch (err) {
            console.log("❌ Unauthorized: JWT verification failed");
            return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
        try {
            const pongStmt = db_1.default.prepare("SELECT * FROM PongHistory WHERE user_id = ?");
            const pongHistory = pongStmt.get(user.id);
            const rowStmt = db_1.default.prepare("SELECT * FROM RowHistory WHERE user_id = ?");
            const rowHistory = rowStmt.get(user.id);
            const defaultPongHistory = {
                user_id: user.id,
                played: 0,
                wins: 0,
                scored: 0
            };
            const defaultRowHistory = {
                user_id: user.id,
                played: 0,
                YellowWins: 0,
                RedWins: 0
            };
            return reply.status(200).send({
                success: true,
                message: "Combined history available",
                pong: pongHistory || defaultPongHistory,
                row: rowHistory || defaultRowHistory
            });
        }
        catch (error) {
            console.error("Error fetching AllHistory:", error);
            return reply.status(500).send({ success: false, error: "Server error" });
        }
    });
    server.get("/PongHistory", async (request, reply) => {
        const cookies = request.cookies;
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, error: "User disconnected" });
        console.log("Cookies : ", cookies);
        console.log("User : ", user);
        console.log("User : ", user?.email);
        const sql_stmt_id = db_1.default.prepare('SELECT played FROM PongHistory WHERE user_id = ?');
        const sender_id = sql_stmt_id.get(user?.id);
        if (!sender_id)
            return reply.status(400).send({ success: false, error: "Never played Pong" });
        const stmt = db_1.default.prepare("SELECT * FROM PongHistory WHERE user_id = ?");
        const History = stmt.all(user.id);
        console.log("Username sender : ", sender_id);
        console.log("All stats : ", History);
        return reply.status(200).send({
            success: true,
            message: "History available",
            data: History
        });
    });
    server.post("/PongUpdate", async (request, reply) => {
        const cookies = request.cookies;
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, error: "User disconnected" });
        const { NewPlayed, NewWin, NewScored } = request.body;
        console.log("Cookies : ", cookies);
        console.log("User : ", user);
        console.log("User : ", user?.email);
        const stmt_update = db_1.default.prepare(`UPDATE PongHistory SET played = ?, wins = ?, scored = ? WHERE user_id = ?`);
        stmt_update.run(NewPlayed, NewWin, NewScored, user.id);
        return reply.status(200).send({
            success: true,
            message: "History updated",
        });
    });
    server.get("/RowHistory", async (request, reply) => {
        const cookies = request.cookies;
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, error: "User disconnected" });
        console.log("Cookies : ", cookies);
        console.log("User : ", user);
        console.log("User : ", user?.email);
        const sql_stmt_id = db_1.default.prepare('SELECT played FROM RowHistory WHERE user_id = ?');
        const sender_id = sql_stmt_id.get(user?.id);
        if (!sender_id)
            return reply.status(400).send({ success: false, error: "Never played 4 in a row" });
        const stmt = db_1.default.prepare("SELECT * FROM RowHistory WHERE user_id = ?");
        const History = stmt.all(user.id);
        console.log("Username sender : ", sender_id);
        console.log("All stats : ", History);
        return reply.status(200).send({
            success: true,
            message: "History available",
            data: History
        });
    });
    server.post("/RowUpdate", async (request, reply) => {
        const cookies = request.cookies;
        const user = request.session.user;
        if (!user)
            return reply.status(400).send({ success: false, error: "User disconnected" });
        const { NewPlayed, NewYellowWins, NewRedWins } = request.body;
        console.log("Cookies : ", cookies);
        console.log("User : ", user);
        console.log("User : ", user?.email);
        const stmt_update = db_1.default.prepare(`UPDATE RowHistory SET played = ?, YellowWins = ?, RedWins = ? WHERE user_id = ?`);
        stmt_update.run(NewPlayed, NewYellowWins, NewRedWins, user.id);
        return reply.status(200).send({
            success: true,
            message: "History updated",
        });
    });
}
