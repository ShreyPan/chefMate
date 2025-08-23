import { PrismaClient, Prisma } from "@prisma/client";

// Global prisma instance for development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ["query"],
});

// Create a typed version for better intellisense (temporary solution)
export const typedPrisma = prisma as PrismaClient & {
    recipe: any;
    user: any;
    ingredient: any;
    recipeStep: any;
    cookingSession: any;
};

if (process.env.NODE_ENV !== "production") {
    // Debug: Log available models to help diagnose type issues
    console.log("Prisma models available:", Object.keys(prisma).filter(key =>
        !key.startsWith('$') && !key.startsWith('_') && typeof (prisma as any)[key] === 'object'
    ));
    globalForPrisma.prisma = prisma;
}

// Clean shutdown
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});
