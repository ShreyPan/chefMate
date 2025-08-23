# ChefMate - AI-Powered Voice Cooking Assistant 🍳🤖

A voice-controlled cooking assistant that uses AI to generate recipes, provides step-by-step cooking guidance, and tracks your cooking sessions.

## 🎯 Project Vision
- **Voice-controlled cooking assistant**
- **AI recipe generation** from text or voice commands
- **Step-by-step cooking guidance** with timers
- **Ingredient management** and shopping lists
- **Personal recipe storage** and history

## ✅ Completed Features (Step 1)

### Backend API (Express.js + TypeScript)
- ✅ **User Authentication** - JWT-based signup/login
- ✅ **Recipe Management** - Full CRUD with ingredients & steps
- ✅ **Cooking Sessions** - Start, track progress, navigate steps
- ✅ **Database Integration** - Prisma ORM with SQLite
- ✅ **Type Safety** - Complete TypeScript implementation

### API Endpoints
```
Authentication:
- POST /auth/signup
- POST /auth/login

Recipes:
- GET /recipes (with ingredients & steps)
- GET /recipes/:id
- POST /recipes (create with ingredients & steps)
- PUT /recipes/:id (update complete recipe)
- DELETE /recipes/:id

Cooking Sessions:
- POST /cooking/start
- GET /cooking/active
- PATCH /cooking/step (navigate between steps)
- POST /cooking/complete
- DELETE /cooking/cancel
- GET /cooking/history
```

## 🗄️ Database Schema
- **Users** - Authentication and profiles
- **Recipes** - Complete recipes with metadata
- **Ingredients** - Recipe ingredients with amounts
- **RecipeSteps** - Step-by-step instructions with timers
- **CookingSessions** - Track cooking progress

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd chefMate

# Install dependencies
pnpm install

# Setup database
cd apps/server
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables
Create `.env` in `apps/server/`:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-jwt-secret-key"
PORT=4000
```

## 🧪 Testing
- **Server**: http://localhost:4000
- **Database Studio**: http://localhost:5555 (run `npx prisma studio`)
- **API Health**: GET http://localhost:4000

## 📋 Next Steps (Planned)

### Step 2: AI Integration 🤖
- [ ] Google Gemini API integration
- [ ] Recipe generation from ingredients
- [ ] AI-powered cooking instructions
- [ ] Ingredient substitution suggestions

### Step 3: Voice Control 🎙️
- [ ] Speech-to-text integration
- [ ] Voice command processing
- [ ] Text-to-speech responses
- [ ] Voice navigation (next/previous/repeat)

### Step 4: Frontend Development 💻
- [ ] Next.js cooking interface
- [ ] Recipe browsing and search
- [ ] Real-time cooking session UI
- [ ] Voice control interface

### Step 5: Advanced Features ⚡
- [ ] Step timers and alerts
- [ ] Shopping list generation
- [ ] Nutritional information
- [ ] Social recipe sharing

## 🛠️ Tech Stack
- **Backend**: Express.js, TypeScript, Prisma
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT with bcrypt
- **Frontend**: Next.js 15, React 19
- **AI**: Google Gemini (planned)
- **Voice**: Web Speech API (planned)

## 📊 Current Status
**✅ Step 1 Complete**: Full backend API with recipe and cooking session management
**🔄 Next**: AI integration for intelligent recipe generation

---
*Built with ❤️ for cooking enthusiasts who want AI-powered assistance in the kitchen!*
