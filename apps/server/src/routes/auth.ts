import { Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

function signAccessToken(userId: number) {
    const secret = process.env.JWT_SECRET!;
    return jwt.sign({ sub: userId }, secret, { expiresIn: "15m" });
}

authRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body as {
            name?: string;
            email?: string;
            password?: string;
        };

        if (!name || !email || !password) {
            return res.status(400).json({ error: "name, email, password are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "password must be at least 8 characters" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: "email already in use" });
        }

        const hash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, password: hash },
        });

        const token = signAccessToken(user.id);
        return res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            access_token: token,
            token_type: "Bearer",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };
        if (!email || !password) {
            return res.status(400).json({ error: "email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                error: "email not registered",
                code: "EMAIL_NOT_FOUND",
                message: "This email address is not registered. Would you like to create an account?"
            });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        const token = signAccessToken(user.id);
        return res.json({
            user: { id: user.id, name: user.name, email: user.email },
            access_token: token,
            token_type: "Bearer",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    }
});
