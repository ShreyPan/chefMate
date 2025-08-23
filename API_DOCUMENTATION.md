# ChefMate API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication Endpoints

### 1. Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "your-password-here"
}
```

### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "your-password-here"
}
```

**Response includes JWT token:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Recipe Endpoints (Require Authentication)

**All recipe endpoints require the Authorization header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Get All Recipes
```http
GET /recipes
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Get Single Recipe
```http
GET /recipes/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Create Recipe
```http
POST /recipes
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Pasta Carbonara",
  "description": "Classic Italian pasta dish",
  "cuisine": "Italian",
  "difficulty": "Medium",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "ingredients": [
    {
      "name": "Spaghetti",
      "amount": "400",
      "unit": "grams",
      "order": 1
    },
    {
      "name": "Eggs",
      "amount": "3",
      "unit": "pieces", 
      "order": 2
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Boil water and cook spaghetti",
      "duration": 600
    },
    {
      "stepNumber": 2,
      "instruction": "Mix eggs with cheese",
      "duration": 180
    }
  ]
}
```

## AI Assistant Endpoints

### 6. Generate Recipe with AI
```http
POST /ai/generate-recipe
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "prompt": "I want to make chicken curry",
  "dietary_restrictions": ["gluten-free"],
  "cuisine_type": "Indian",
  "difficulty": "Medium",
  "prep_time": 30,
  "servings": 4
}
```

### 7. Speech to Text (Coming Soon)
```http
POST /ai/speech-to-text
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "audio_data": "base64_encoded_audio",
  "format": "webm"
}
```

## Cooking Session Endpoints

### 8. Start Cooking Session
```http
POST /cooking/start
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "recipeId": 1
}
```

### 9. Get Active Cooking Session
```http
GET /cooking/active
Authorization: Bearer YOUR_JWT_TOKEN
```

### 10. Update Current Step
```http
PATCH /cooking/step
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentStep": 2,
  "notes": "Added extra spices"
}
```

### 11. Complete Cooking Session
```http
POST /cooking/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "notes": "Turned out great!"
}
```

### 12. Cancel Cooking Session
```http
DELETE /cooking/cancel
Authorization: Bearer YOUR_JWT_TOKEN
```

### 13. Get Cooking History
```http
GET /cooking/history?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

## Testing the API

You can test these endpoints using:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Frontend application**

### Example Test Flow:
1. Sign up a new user
2. Login to get JWT token
3. Use token to create a recipe
4. Start a cooking session with that recipe
5. Navigate through cooking steps
6. Complete the session
