import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";
import fp from 'fastify-plugin';
import 'dotenv/config';
import fastifyOauth2, { OAuth2Namespace } from '@fastify/oauth2';
import { request } from "https";
import { user } from '../Login/Login'; 

type FriendsRow = { friend: string };

export function FriendsRoutes(server: FastifyInstance) {

  server.post("/AddFriend", async (request, reply) => {
    const { message } = request.body as { message: string };
    const user = request.session.user;

    if (!user)
      return reply.status(400).send({ success: false, received: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const senderStmt = db.prepare('SELECT username FROM users WHERE email = ?');
    const sender = senderStmt.get(user.email) as { username: string };
    if (!sender)
      return reply.status(400).send({ success: false, received: "Sender not found" });

    if (!message)
      return reply.status(400).send({ success: false, received: "No username provided" });

    if (message === sender.username)
      return reply.status(400).send({ success: false, received: "Cannot add yourself as a friend" });

    const receiverStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const receiver = receiverStmt.get(message) as { id: number };
    if (!receiver)
      return reply.status(400).send({ success: false, received: "User does not exist" });

    const checkPending = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend = ? AND status = ?');
    const pendingExists = checkPending.get(receiver.id, sender.username, 'pending');
    if (pendingExists)
      return reply.status(400).send({ success: false, received: "Invitation already pending" });

    const checkFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend = ? AND status = ?');
    const alreadyFriends = checkFriend.get(receiver.id, sender.username, 'friend');
    if (alreadyFriends)
      return reply.status(400).send({ success: false, received: "You are already friends" });

    const insertStmt = db.prepare('INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)');
    insertStmt.run(receiver.id, sender.username, 'pending');       // receiver sees incoming
    insertStmt.run(user.id, message, 'pending_sent');              // sender sees outgoing

    return reply.send({ success: true, received: message });
  });

  server.post("/AcceptRequest", async (request, reply) => {
    const { message } = request.body as { message: string };
    const user = request.session.user;

    if (!user)
      return reply.status(400).send({ success: false, error: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const pendingStmt = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ? AND friend = ?');
    const senderUsername = pendingStmt.get(user.id, 'pending', message) as { friend: string };
    if (!senderUsername)
      return reply.status(400).send({ success: false, error: "No such pending request" });

    const currentUsernameStmt = db.prepare('SELECT username FROM users WHERE id = ?');
    const currentUsername = currentUsernameStmt.get(user.id) as { username: string };

    const senderIdStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const senderId = senderIdStmt.get(message) as { id: number };

    const insertFriend = db.prepare('INSERT INTO friends (user_id, friend, status) VALUES (?, ?, ?)');
    insertFriend.run(user.id, message, 'friend');
    insertFriend.run(senderId.id, currentUsername.username, 'friend');

    const deletePending1 = db.prepare('DELETE FROM friends WHERE user_id = ? AND friend = ? AND status = ?');
    deletePending1.run(user.id, message, 'pending');

    const deletePending2 = db.prepare('DELETE FROM friends WHERE user_id = ? AND friend = ? AND status = ?');
    deletePending2.run(senderId.id, currentUsername.username, 'pending_sent');

    return reply.send({ succes: true, received: message });
  });

  server.post("/RemoveFriend", async (request, reply) => {
    const { message } = request.body as { message: string };
    const user = request.session.user;

    if (!user)
      return reply.status(400).send({ success: false, error: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const senderStmt = db.prepare('SELECT username FROM users WHERE email = ?');
    const sender = senderStmt.get(user.email) as { username: string };
    const receiverStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const receiver = receiverStmt.get(message) as { id: number };

    if (!sender || !receiver)
      return reply.status(400).send({ success: false, error: "User not found" });

    const deleteStatuses = ['friend', 'pending', 'pending_sent'];

    for (const status of deleteStatuses) {
      db.prepare('DELETE FROM friends WHERE user_id = ? AND friend = ? AND status = ?')
        .run(user.id, message, status);
      db.prepare('DELETE FROM friends WHERE user_id = ? AND friend = ? AND status = ?')
        .run(receiver.id, sender.username, status);
    }

    return reply.send({ success: true, removed: message });
  });

  server.get("/GetFriends", async (request, reply) => {
    const user = request.session.user;

    if (!user)
      return reply.status(400).send({ success: false, error: "User disconnected" });

    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("❌ Unauthorized: JWT verification failed");
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const friendStmt = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ?');
    const friendsRows = friendStmt.all(user.id, 'friend') as { friend: string }[];
    const friendsList = friendsRows.map(r => r.friend);

    const pendingIncomingRows = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ?')
      .all(user.id, 'pending') as { friend: string }[];
    const pendingOutgoingRows = db.prepare('SELECT friend FROM friends WHERE user_id = ? AND status = ?')
      .all(user.id, 'pending_sent') as { friend: string }[];

    return reply.send({
      success: true,
      friends: friendsList,
      pendingRequests: [
        ...pendingIncomingRows.map(r => ({ username: r.friend, type: 'incoming' })),
        ...pendingOutgoingRows.map(r => ({ username: r.friend, type: 'outgoing' })),
      ]
    });
  });
}
