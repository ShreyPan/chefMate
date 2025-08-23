import { prisma } from "./prisma";

// Test if Prisma client has the new models
async function testPrismaModels() {
    try {
        console.log("Testing Prisma models...");

        // Test User model (this should work)
        const userCount = await prisma.user.count();
        console.log("✅ User model works, count:", userCount);

        // Test Recipe model (this might fail)
        try {
            const recipeCount = await (prisma as any).recipe.count();
            console.log("✅ Recipe model works, count:", recipeCount);
        } catch (err) {
            console.log("❌ Recipe model failed:", err);
        }

        // Test Ingredient model
        try {
            const ingredientCount = await (prisma as any).ingredient.count();
            console.log("✅ Ingredient model works, count:", ingredientCount);
        } catch (err) {
            console.log("❌ Ingredient model failed:", err);
        }

    } catch (error) {
        console.error("❌ Prisma test failed:", error);
    }
}

export { testPrismaModels };
