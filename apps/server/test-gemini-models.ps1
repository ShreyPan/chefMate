# Test Multiple Gemini Models
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$apiKey = $env:GEMINI_API_KEY

if (-not $apiKey -or $apiKey -eq "your-gemini-api-key-here") {
    Write-Host "❌ No valid GEMINI_API_KEY found"
    exit 1
}

Write-Host "🤖 Testing Gemini API with multiple models..."
Write-Host "API Key: $($apiKey.Substring(0,10))..."

$headers = @{
    'Content-Type'   = 'application/json'
    'X-goog-api-key' = $apiKey
}

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Hello! Can you generate a simple pasta recipe?"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 5

# Try different model endpoints
$models = @(
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-pro",
    "gemini-1.0-pro"
)

foreach ($model in $models) {
    Write-Host "`n🧪 Testing model: $model"
    
    try {
        $uri = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent"
        $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
        
        Write-Host "✅ SUCCESS with $model!"
        Write-Host "Response: $($response.candidates[0].content.parts[0].text.Substring(0,100))..."
        break
        
    }
    catch {
        Write-Host "❌ Failed with $model"
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "   Status: $statusCode"
            
            if ($statusCode -eq 404) {
                Write-Host "   (Model not found - trying next)"
            }
            elseif ($statusCode -eq 400) {
                Write-Host "   (Bad request - API key or format issue)"
            }
        }
    }
}

Write-Host "`n💡 If all models fail, the API key may need a few more minutes to activate."
