# Test Gemini API - List Models
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

$apiKey = $env:GEMINI_API_KEY
Write-Host "🔍 Testing API key validity by listing models..."
Write-Host "API Key: $($apiKey.Substring(0,10))..."

$headers = @{
    'X-goog-api-key' = $apiKey
}

try {
    $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models" -Method GET -Headers $headers
    
    Write-Host "✅ API Key is VALID!"
    Write-Host "Available models:"
    foreach ($model in $response.models) {
        Write-Host "  - $($model.name)"
    }
    
} catch {
    Write-Host "❌ API Key validation failed"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Details: $responseText"
    }
}
