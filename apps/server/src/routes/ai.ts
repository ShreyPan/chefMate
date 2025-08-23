import { Router } from "express";
import axios from "axios";
import { authenticateToken } from "../middleware/auth";
import { z } from "zod";

export const aiRouter = Router();

// Validation schemas
const generateRecipeSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    dietary_restrictions: z.array(z.string()).optional(),
    cuisine_type: z.string().optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    prep_time: z.number().optional(),
    servings: z.number().optional()
});

const speechToTextSchema = z.object({
    audio_data: z.string(), // base64 encoded audio
    format: z.enum(["wav", "mp3", "webm"]).default("webm")
});

// Generate recipe using Perplexity AI
aiRouter.post("/generate-recipe", authenticateToken, async (req, res) => {
    try {
        const validatedData = generateRecipeSchema.parse(req.body);

        // Construct the prompt for Perplexity AI
        const systemPrompt = `You are a professional chef and cooking assistant. Generate a detailed recipe based on the user's request. Always respond in JSON format with the following structure:
    {
      "title": "Recipe Name",
      "description": "Brief description",
      "cuisine": "Cuisine type",
      "difficulty": "Easy/Medium/Hard",
      "prepTime": number (in minutes),
      "cookTime": number (in minutes),
      "servings": number,
      "ingredients": [
        {
          "name": "ingredient name",
          "amount": "quantity",
          "unit": "unit of measurement",
          "notes": "optional notes",
          "order": number
        }
      ],
      "steps": [
        {
          "stepNumber": number,
          "instruction": "detailed instruction",
          "duration": number (in seconds, optional),
          "temperature": "temperature info (optional)",
          "notes": "optional tips"
        }
      ]
    }`;

        let userPrompt = `Create a recipe for: ${validatedData.prompt}`;

        if (validatedData.dietary_restrictions?.length) {
            userPrompt += `\nDietary restrictions: ${validatedData.dietary_restrictions.join(", ")}`;
        }
        if (validatedData.cuisine_type) {
            userPrompt += `\nCuisine type: ${validatedData.cuisine_type}`;
        }
        if (validatedData.difficulty) {
            userPrompt += `\nDifficulty level: ${validatedData.difficulty}`;
        }
        if (validatedData.prep_time) {
            userPrompt += `\nPrep time should be around: ${validatedData.prep_time} minutes`;
        }
        if (validatedData.servings) {
            userPrompt += `\nServings: ${validatedData.servings}`;
        }

        userPrompt += "\n\nPlease provide a complete recipe with exact measurements and step-by-step instructions. Include cooking times for each step where applicable.";

        const response = await axios.post(
            "https://api.perplexity.ai/chat/completions",
            {
                model: "llama-3.1-sonar-large-128k-online",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.2,
                return_citations: false,
                return_images: false
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        // Try to parse JSON from AI response
        let recipeData;
        try {
            // Extract JSON from response (in case AI adds extra text)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                recipeData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            return res.status(500).json({
                error: "Failed to parse recipe from AI response",
                raw_response: aiResponse
            });
        }

        res.json({
            success: true,
            recipe: recipeData,
            message: "Recipe generated successfully"
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid request data", details: error.issues });
        }

        if (axios.isAxiosError(error)) {
            console.error("Perplexity API error:", error.response?.data);
            return res.status(500).json({
                error: "Failed to generate recipe",
                details: error.response?.data?.error || "AI service unavailable"
            });
        }

        console.error("Generate recipe error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Convert speech to text (placeholder for future implementation)
aiRouter.post("/speech-to-text", authenticateToken, async (req, res) => {
    try {
        const validatedData = speechToTextSchema.parse(req.body);

        // For now, return a placeholder response
        // In the future, integrate with OpenAI Whisper or similar service
        res.json({
            success: true,
            text: "Speech to text functionality coming soon!",
            confidence: 0.95
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid request data", details: error.issues });
        }

        console.error("Speech to text error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Text to speech (placeholder for future implementation)
aiRouter.post("/text-to-speech", authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        // For now, return a placeholder response
        res.json({
            success: true,
            audio_url: null,
            message: "Text to speech functionality coming soon!"
        });

    } catch (error) {
        console.error("Text to speech error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
