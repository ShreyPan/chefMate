import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { z } from "zod";
import { AIService, RecipeRequest } from "../services/aiService";

export const aiRouter = Router();

// Validation schemas
const generateRecipeSchema = z.object({
    ingredients: z.array(z.string()).optional(),
    cuisine: z.string().optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    cookingTime: z.number().optional(),
    servings: z.number().optional(),
    description: z.string().optional()
});

const voiceCommandSchema = z.object({
    voiceText: z.string().min(1, "Voice text is required")
});

const cookingTipsSchema = z.object({
    recipeTitle: z.string().min(1, "Recipe title is required"),
    step: z.string().optional()
});

const substitutionSchema = z.object({
    ingredient: z.string().min(1, "Ingredient is required"),
    amount: z.string().min(1, "Amount is required"),
    unit: z.string().min(1, "Unit is required")
});

// Generate recipe using Google Gemini AI
aiRouter.post("/generate-recipe", authenticateToken, async (req, res) => {
    try {
        const validatedData = generateRecipeSchema.parse(req.body);

        console.log('🤖 Generating recipe with AI...', validatedData);

        const recipeRequest: RecipeRequest = {
            ingredients: validatedData.ingredients,
            cuisine: validatedData.cuisine,
            dietaryRestrictions: validatedData.dietaryRestrictions,
            difficulty: validatedData.difficulty,
            cookingTime: validatedData.cookingTime,
            servings: validatedData.servings,
            description: validatedData.description
        };

        const generatedRecipe = await AIService.generateRecipe(recipeRequest);

        res.json({
            success: true,
            recipe: generatedRecipe,
            message: "Recipe generated successfully with AI"
        });

    } catch (error) {
        console.error("❌ Recipe generation error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: error.issues
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to generate recipe",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Process voice commands for recipe requests
aiRouter.post("/voice-command", authenticateToken, async (req, res) => {
    try {
        const { voiceText } = voiceCommandSchema.parse(req.body);

        console.log('🎤 Processing voice command:', voiceText);

        const recipeRequest = await AIService.processVoiceCommand(voiceText);

        // Generate recipe based on voice command
        const generatedRecipe = await AIService.generateRecipe(recipeRequest);

        res.json({
            success: true,
            voiceCommand: voiceText,
            parsedRequest: recipeRequest,
            recipe: generatedRecipe,
            message: "Voice command processed and recipe generated"
        });

    } catch (error) {
        console.error("❌ Voice command processing error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid voice command data",
                errors: error.issues
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to process voice command",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get cooking tips and suggestions
aiRouter.post("/cooking-tips", authenticateToken, async (req, res) => {
    try {
        const { recipeTitle, step } = cookingTipsSchema.parse(req.body);

        console.log('💡 Getting cooking tips for:', recipeTitle);

        const tips = await AIService.getCookingTips(recipeTitle, step);

        res.json({
            success: true,
            recipeTitle,
            step,
            tips,
            message: "Cooking tips generated successfully"
        });

    } catch (error) {
        console.error("❌ Cooking tips error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: error.issues
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to get cooking tips",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get ingredient substitutions
aiRouter.post("/substitutions", authenticateToken, async (req, res) => {
    try {
        const { ingredient, amount, unit } = substitutionSchema.parse(req.body);

        console.log('🔄 Getting substitutions for:', `${amount} ${unit} ${ingredient}`);

        const substitutions = await AIService.getSubstitutions(ingredient, amount, unit);

        res.json({
            success: true,
            original: { ingredient, amount, unit },
            substitutions,
            message: "Substitutions found successfully"
        });

    } catch (error) {
        console.error("❌ Substitutions error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: error.issues
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to get substitutions",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Health check for AI service
aiRouter.get("/health", async (req, res) => {
    try {
        res.json({
            success: true,
            status: "AI service is ready",
            provider: "Google Gemini",
            timestamp: new Date().toISOString(),
            note: "Add GEMINI_API_KEY to environment variables to enable AI features"
        });

    } catch (error) {
        console.error("❌ AI health check failed:", error);

        res.status(503).json({
            success: false,
            status: "AI service unavailable",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString()
        });
    }
});
