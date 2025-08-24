import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { recipesRouter } from "./routes/recipes";
import { cookingRouter } from "./routes/cooking";
import { aiRouter } from "./routes/ai";
import { testPrismaModels } from "./test-prisma";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Enhanced CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get("/", (_req, res) => {
    console.log("Root endpoint hit!");
    res.json({
        ok: true,
        service: "ChefMate API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        status: "Full recipe and cooking session management working!",
        endpoints: {
            auth: "/auth (✅ Working)",
            recipes: "/recipes (✅ Full CRUD with ingredients & steps)",
            cooking: "/cooking (✅ Session management)",
            ai: "/ai (✅ Working with Google Gemini)"
        }
    });
});

// API routes
app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);
app.use("/cooking", cookingRouter);
app.use("/ai", aiRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
});

// 404 handler
app.use("*", (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Start server with proper error handling
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ChefMate API running on http://localhost:${PORT}`);
    console.log(`🌐 Server binding to 0.0.0.0:${PORT}`);
    console.log(`📚 Available endpoints:`);
    console.log(`   • ✅ Authentication: http://localhost:${PORT}/auth`);
    console.log(`   • ✅ Recipes (Full): http://localhost:${PORT}/recipes`);
    console.log(`   • ✅ Cooking Sessions: http://localhost:${PORT}/cooking`);
    console.log(`   • ✅ AI Assistant: http://localhost:${PORT}/ai (Google Gemini working)`);
    console.log(``);
    console.log(`🍳 Recipe Features: Create, Read, Update, Delete with ingredients & steps`);
    console.log(`👨‍🍳 Cooking Features: Start sessions, track progress, timers, navigation`);

    // Test Prisma models after server starts
    testPrismaModels();
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
