import { FastifyInstance } from "fastify";
import db from '../db/db';
import bcrypt from "bcrypt";
import { user } from '../Login/Login'; 
import { request, Server } from "http";
import '@fastify/session';
import path from 'path';
import fs from 'fs';

declare module "@fastify/session" {
  interface SessionData {
	pending2FA?: {
	  email: string;
	  code: string;
	  expiresAt: number;
	};
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
    console.log("❌ User not logged in");
    return reply.status(400).send({ success: false, message: "User not logged in" });
  }

  try {
    await request.jwtVerify();
  } catch (err) {
    console.log("❌ Unauthorized: JWT verification failed");
    return reply.code(401).send({ success: false, message: "Unauthorized" });
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

  // Check for existing email or username
  const checkStmt = db.prepare('SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?');
  const existingUser = checkStmt.get(newEmail || "", newUsername || "", userId) as { email?: string; username?: string } | undefined;

  if (existingUser) {
    if (existingUser.email === newEmail) {
      console.log("❌ Email already registered");
      return reply.status(400).send({ success: false, message: "Email already registered." });
    }
    if (existingUser.username === newUsername) {
      console.log("❌ Username already taken");
      return reply.status(400).send({ success: false, message: "Username already taken." });
    }
  }

  // Dynamically build update query
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
    console.log("❌ No changes submitted");
    return reply.status(400).send({ success: false, message: "No changes submitted." });
  }

  values.push(userId); // move this AFTER the return

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  console.log("SQL to run:", sql);
  console.log("Values:", values);

  try {
    const updateStmt = db.prepare(sql);
    const info = updateStmt.run(...values);
    console.log("Update result:", info);
    if (info.changes === 0) {
      console.log("❌ No rows updated");
      return reply.status(400).send({ success: false, message: "Update failed. No changes made." });
    }
  } catch (error) {
    console.error("❌ Database update error:", error);
    return reply.status(500).send({ success: false, message: "Database update failed" });
  }

  const updatedUser = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(userId);
  console.log("Updated user:", updatedUser);

  return reply.status(200).send({ success: true, message: "Settings updated successfully", switch: true });
});


server.get('/user', (request, response) => {
  try {
    if (!request.session.user) {
      return response.send({ loggedIn: false });
    }

    const user = request.session.user;
    const dbUser = db.prepare('SELECT avatar FROM users WHERE id = ?').get(user.id) as { avatar?: string } | undefined;
    const avatarE = dbUser?.avatar ?? null;

    return response.send({
      loggedIn: true,
      username: (user as { username?: string }).username ?? null,
      email: (user as { email?: string }).email ?? null,
      avatar: avatarE
        ? `http://localhost:3000${avatarE}`
        : "https://api.dicebear.com/7.x/pixel-art/svg?seed=User"
    });
  } catch (error) {
    console.error("🔥 Error in /user route:", error);
    return response.code(500).send({ success: false, message: "Internal server error" });
  }
});

  server.post('/uploadFile', async (request, reply) => {
  try {
    if (!request.session.user) {
      return reply.code(401).send({ success: false, message: "Unauthorized" });
    }

    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ success: false, message: "No file uploaded" });
    }

    const userId = request.session.user.id;
    const avatarsDir = path.join(__dirname, '../db/avatars');
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }
    const filename = `avatar_${userId}_${Date.now()}.png`;
    const filepath = path.join(avatarsDir, filename);

    console.log("Saving avatar to:", filepath);

    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filepath);
      data.file.pipe(writeStream);
      data.file.on('end', resolve);
      data.file.on('error', reject);
    });

    const updateStmt = db.prepare('UPDATE users SET avatar = ? WHERE id = ?');
    updateStmt.run(`/avatars/${filename}`, userId);

    return reply.send({
      success: true,
      message: "Profile picture updated",
      avatar: `/avatars/${filename}`,
    });

  } catch (error) {
    console.error("🔥 Upload error:", error);
    return reply.code(500).send({ success: false, message: "Upload failed" });
  }
});
}