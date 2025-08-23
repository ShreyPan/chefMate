import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        service: "ChefMate API Minimal",
        version: "1.0.0"
    });
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ChefMate API (minimal) running on http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
    console.error('❌ Server error:', err);
});
