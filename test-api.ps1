# Test ChefMate API

# Test 1: Check server status
Write-Host "🧪 Testing ChefMate API..." -ForegroundColor Green
Write-Host ""

# Test root endpoint
Write-Host "1. Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000" -Method GET
    Write-Host "✅ Root endpoint working:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Root endpoint failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""

# Test signup
Write-Host "2. Testing user signup..." -ForegroundColor Yellow
$signupData = @{
    name = "Test User"
    email = "test@chefmate.com"
    password = "testpassword123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/signup" -Method POST -Body $signupData -ContentType "application/json"
    Write-Host "✅ Signup successful:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json
    $token = $signupResponse.token
} catch {
    Write-Host "❌ Signup failed (might already exist):" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    # Try login instead
    Write-Host ""
    Write-Host "3. Trying login instead..." -ForegroundColor Yellow
    $loginData = @{
        email = "test@chefmate.com"
        password = "testpassword123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ Login successful:" -ForegroundColor Green
        $loginResponse | ConvertTo-Json
        $token = $loginResponse.token
    } catch {
        Write-Host "❌ Login failed:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        return
    }
}

Write-Host ""

# Test protected endpoint
Write-Host "4. Testing protected recipes endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $recipesResponse = Invoke-RestMethod -Uri "http://localhost:4000/recipes" -Method GET -Headers $headers
    Write-Host "✅ Recipes endpoint working:" -ForegroundColor Green
    $recipesResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Recipes endpoint failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "🎉 API testing complete!" -ForegroundColor Green
Write-Host "💡 Your JWT token for further testing: $token" -ForegroundColor Cyan
