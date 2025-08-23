# Test ChefMate API with Recipe Endpoints

Write-Host "🧪 Testing ChefMate API with Recipe Management..." -ForegroundColor Green
Write-Host ""

# Function to test endpoint with retries
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    $maxRetries = 3
    $retryDelay = 2
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $params = @{
                Uri = $Url
                Method = $Method
                TimeoutSec = 10
            }
            
            if ($Headers.Count -gt 0) {
                $params.Headers = $Headers
            }
            
            if ($Body) {
                $params.Body = $Body
                $params.ContentType = "application/json"
            }
            
            return Invoke-RestMethod @params
        } catch {
            Write-Host "Attempt $i failed: $($_.Exception.Message)" -ForegroundColor Yellow
            if ($i -lt $maxRetries) {
                Write-Host "Retrying in $retryDelay seconds..." -ForegroundColor Yellow
                Start-Sleep $retryDelay
            }
        }
    }
    throw "All attempts failed"
}

# Test 1: Check if server is accessible
Write-Host "1. Testing server accessibility..." -ForegroundColor Yellow

# Check if port is in use
$portInUse = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "✅ Port 4000 is in use by process ID: $($portInUse.OwningProcess)" -ForegroundColor Green
} else {
    Write-Host "❌ Port 4000 is not in use - server may not be running" -ForegroundColor Red
}

# Test different URLs
$testUrls = @(
    "http://localhost:4000",
    "http://127.0.0.1:4000"
)

$serverResponse = $null
foreach ($url in $testUrls) {
    Write-Host "Testing $url..." -ForegroundColor Cyan
    try {
        $serverResponse = Test-Endpoint -Url $url
        Write-Host "✅ Server accessible at $url" -ForegroundColor Green
        $serverResponse | ConvertTo-Json -Depth 3
        break
    } catch {
        Write-Host "❌ Failed to connect to $url" -ForegroundColor Red
    }
}

if (-not $serverResponse) {
    Write-Host "❌ Server is not accessible. Please check:" -ForegroundColor Red
    Write-Host "   1. Is the server running? (check terminal output)" -ForegroundColor Yellow
    Write-Host "   2. Is Windows Firewall blocking the connection?" -ForegroundColor Yellow
    Write-Host "   3. Try a different port in .env file" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: User authentication
Write-Host "2. Testing user authentication..." -ForegroundColor Yellow
$signupData = @{
    name = "Test Chef"
    email = "chef@chefmate.com"
    password = "chefpassword123"
} | ConvertTo-Json

try {
    $authResponse = Test-Endpoint -Url "http://localhost:4000/auth/signup" -Method POST -Body $signupData
    Write-Host "✅ Signup successful!" -ForegroundColor Green
    $token = $authResponse.token
} catch {
    Write-Host "⚠️ Signup failed (user might exist), trying login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "chef@chefmate.com"
        password = "chefpassword123"
    } | ConvertTo-Json
    
    try {
        $authResponse = Test-Endpoint -Url "http://localhost:4000/auth/login" -Method POST -Body $loginData
        Write-Host "✅ Login successful!" -ForegroundColor Green
        $token = $authResponse.token
    } catch {
        Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Test 3: Get recipes (should be empty initially)
Write-Host "3. Testing recipe retrieval..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $recipesResponse = Test-Endpoint -Url "http://localhost:4000/recipes" -Headers $headers
    Write-Host "✅ Recipes endpoint working:" -ForegroundColor Green
    Write-Host "Number of recipes: $($recipesResponse.recipes.Count)"
} catch {
    Write-Host "❌ Recipes endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 4: Create a test recipe
Write-Host "4. Testing recipe creation..." -ForegroundColor Yellow
$recipeData = @{
    title = "Test Pasta Recipe"
    description = "A simple test recipe for our API"
    prepTime = 15
    cookTime = 20
    servings = 4
} | ConvertTo-Json

try {
    $createResponse = Test-Endpoint -Url "http://localhost:4000/recipes" -Method POST -Body $recipeData -Headers $headers
    Write-Host "✅ Recipe creation successful:" -ForegroundColor Green
    $createdRecipe = $createResponse.recipe
    Write-Host "Created recipe ID: $($createdRecipe.id) - $($createdRecipe.title)"
} catch {
    Write-Host "❌ Recipe creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get recipes again
Write-Host "5. Testing recipe retrieval after creation..." -ForegroundColor Yellow
try {
    $recipesResponse2 = Test-Endpoint -Url "http://localhost:4000/recipes" -Headers $headers
    Write-Host "✅ Updated recipes list:" -ForegroundColor Green
    Write-Host "Number of recipes: $($recipesResponse2.recipes.Count)"
    if ($recipesResponse2.recipes.Count -gt 0) {
        Write-Host "Latest recipe: $($recipesResponse2.recipes[0].title)"
    }
} catch {
    Write-Host "❌ Recipes retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Recipe API testing complete!" -ForegroundColor Green
Write-Host "💡 Your JWT token for further testing: $token" -ForegroundColor Cyan
