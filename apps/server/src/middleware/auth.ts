import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        if (!decoded.sub || typeof decoded.sub !== "number") {
            return res.status(401).json({ error: "Invalid token format" });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
