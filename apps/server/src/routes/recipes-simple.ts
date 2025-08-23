import { Router } from "express";
import { prisma } from "../prisma";
import { authenticateToken } from "../middleware/auth";

export const recipesRouter = Router();

// Get all recipes for authenticated user (simplified)
recipesRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;

        // Temporary type assertion until Prisma client refreshes
        const recipes = await (prisma as any).recipe.findMany({
            where: { userId },
            include: {
                ingredients: { orderBy: { order: "asc" } },
                steps: { orderBy: { stepNumber: "asc" } }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ recipes });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

// Get single recipe
recipesRouter.get("/:id", authenticateToken, async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);
        const userId = req.user?.id!;

        // Temporary type assertion until Prisma client refreshes
        const recipe = await (prisma as any).recipe.findFirst({
            where: {
                id: recipeId,
                OR: [
                    { userId },
                    { isPublic: true }
                ]
            },
            include: {
                ingredients: { orderBy: { order: "asc" } },
                steps: { orderBy: { stepNumber: "asc" } },
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json({ recipe });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Failed to fetch recipe" });
    }
});

// Simple POST endpoint to create a basic recipe
recipesRouter.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id!;
        const { title, description, prepTime, cookTime, servings } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Recipe title is required" });
        }

        // Create basic recipe without ingredients/steps for now
        const recipe = await (prisma as any).recipe.create({
            data: {
                title,
                description: description || "",
                prepTime: prepTime || 30,
                cookTime: cookTime || 30,
                servings: servings || 4,
                userId
            }
        });

        res.status(201).json({ recipe, message: "Recipe created successfully" });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ error: "Failed to create recipe" });
    }
});
