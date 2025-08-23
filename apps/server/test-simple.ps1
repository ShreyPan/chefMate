# Simple API Key Test
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$apiKey = $env:GEMINI_API_KEY
Write-Host "🔍 Testing API key by listing models..."
Write-Host "API Key: $($apiKey.Substring(0,10))..."

$headers = @{
    'X-goog-api-key' = $apiKey
}

try {
    $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models" -Method GET -Headers $headers
    Write-Host "✅ API Key WORKS!"
    Write-Host "Found $($response.models.Count) models"
    
} catch {
    Write-Host "❌ API Key not working yet"
    Write-Host "Error: $($_.Exception.Message)"
}
