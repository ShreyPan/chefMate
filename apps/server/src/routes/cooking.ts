import { Router } from "express";
import { typedPrisma } from "../prisma";
import { authenticateToken } from "../middleware/auth";
import { z } from "zod";

export const cookingRouter = Router();

// Validation schemas
const startCookingSchema = z.object({
    recipeId: z.number().min(1)
});

const updateStepSchema = z.object({
    currentStep: z.number().min(1),
    notes: z.string().optional()
});

// Start a new cooking session
cookingRouter.post("/start", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;
        const { recipeId } = startCookingSchema.parse(req.body);

        // Verify recipe exists and user has access
        const recipe = await typedPrisma.recipe.findFirst({
            where: {
                id: recipeId,
                OR: [
                    { userId },
                    { isPublic: true }
                ]
            },
            include: {
                steps: { orderBy: { stepNumber: "asc" } },
                ingredients: { orderBy: { order: "asc" } }
            }
        });

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // End any existing active sessions for this user
        await typedPrisma.cookingSession.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        });

        // Create new cooking session
        const session = await typedPrisma.cookingSession.create({
            data: {
                userId,
                recipeId,
                currentStep: 1,
                isActive: true
            },
            include: {
                recipe: {
                    include: {
                        steps: { orderBy: { stepNumber: "asc" } },
                        ingredients: { orderBy: { order: "asc" } }
                    }
                }
            }
        });

        res.status(201).json({
            session,
            message: "Cooking session started successfully"
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid data", details: error.issues });
        }
        console.error("Error starting cooking session:", error);
        res.status(500).json({ error: "Failed to start cooking session" });
    }
});

// Get active cooking session
cookingRouter.get("/active", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;

        const session = await typedPrisma.cookingSession.findFirst({
            where: { userId, isActive: true },
            include: {
                recipe: {
                    include: {
                        steps: { orderBy: { stepNumber: "asc" } },
                        ingredients: { orderBy: { order: "asc" } }
                    }
                }
            }
        });

        if (!session) {
            return res.json({ session: null, message: "No active cooking session" });
        }

        res.json({ session });

    } catch (error) {
        console.error("Error fetching active session:", error);
        res.status(500).json({ error: "Failed to fetch cooking session" });
    }
});

// Update current step in cooking session
cookingRouter.patch("/step", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;
        const { currentStep, notes } = updateStepSchema.parse(req.body);

        const session = await typedPrisma.cookingSession.findFirst({
            where: { userId, isActive: true },
            include: {
                recipe: {
                    include: {
                        steps: { orderBy: { stepNumber: "asc" } }
                    }
                }
            }
        });

        if (!session) {
            return res.status(404).json({ error: "No active cooking session found" });
        }

        // Validate step number
        const maxSteps = session.recipe.steps.length;
        if (currentStep > maxSteps || currentStep < 1) {
            return res.status(400).json({
                error: `Invalid step number. Recipe has ${maxSteps} steps.`
            });
        }

        // Update session
        const updatedSession = await typedPrisma.cookingSession.update({
            where: { id: session.id },
            data: {
                currentStep,
                notes: notes || session.notes
            },
            include: {
                recipe: {
                    include: {
                        steps: { orderBy: { stepNumber: "asc" } },
                        ingredients: { orderBy: { order: "asc" } }
                    }
                }
            }
        });

        res.json({
            session: updatedSession,
            message: `Moved to step ${currentStep}`
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid data", details: error.issues });
        }
        console.error("Error updating cooking step:", error);
        res.status(500).json({ error: "Failed to update cooking step" });
    }
});

// Complete cooking session
cookingRouter.post("/complete", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;
        const { notes } = req.body;

        const session = await typedPrisma.cookingSession.findFirst({
            where: { userId, isActive: true }
        });

        if (!session) {
            return res.status(404).json({ error: "No active cooking session found" });
        }

        const completedSession = await typedPrisma.cookingSession.update({
            where: { id: session.id },
            data: {
                isActive: false,
                completedAt: new Date(),
                notes: notes || session.notes
            }
        });

        res.json({
            session: completedSession,
            message: "Cooking session completed successfully!"
        });

    } catch (error) {
        console.error("Error completing cooking session:", error);
        res.status(500).json({ error: "Failed to complete cooking session" });
    }
});

// Cancel cooking session
cookingRouter.delete("/cancel", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;

        const session = await typedPrisma.cookingSession.findFirst({
            where: { userId, isActive: true }
        });

        if (!session) {
            return res.status(404).json({ error: "No active cooking session found" });
        }

        await typedPrisma.cookingSession.update({
            where: { id: session.id },
            data: { isActive: false }
        });

        res.json({ message: "Cooking session cancelled" });

    } catch (error) {
        console.error("Error cancelling cooking session:", error);
        res.status(500).json({ error: "Failed to cancel cooking session" });
    }
});

// Get cooking history
cookingRouter.get("/history", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const sessions = await typedPrisma.cookingSession.findMany({
            where: { userId, isActive: false },
            include: {
                recipe: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        prepTime: true,
                        cookTime: true
                    }
                }
            },
            orderBy: { startedAt: "desc" },
            skip,
            take: limit
        });

        const total = await typedPrisma.cookingSession.count({
            where: { userId, isActive: false }
        });

        res.json({
            sessions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching cooking history:", error);
        res.status(500).json({ error: "Failed to fetch cooking history" });
    }
});
