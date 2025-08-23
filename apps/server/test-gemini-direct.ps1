# Test Gemini API directly with PowerShell
# Load environment variables
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$apiKey = $env:GEMINI_API_KEY

if (-not $apiKey -or $apiKey -eq "your-gemini-api-key-here") {
    Write-Host "❌ No valid GEMINI_API_KEY found in .env file"
    Write-Host "💡 Add your real API key to apps/server/.env"
    exit 1
}

Write-Host "🤖 Testing Gemini API directly..."
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
                    text = "Generate a simple pasta recipe in JSON format with title, ingredients, and steps"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Gemini API Test Successful!"
    Write-Host "Response:"
    Write-Host $response.candidates[0].content.parts[0].text
    
}
catch {
    Write-Host "❌ Gemini API Test Failed:"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    
    # Try to get more details
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Details: $responseText"
    }
}
