# Word Cookies Frame Deployment Script (PowerShell)

Write-Host "🍪 Deploying Word Cookies Frame..." -ForegroundColor Green

# Check if environment variables are set
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set" -ForegroundColor Red
    exit 1
}

if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frame URL: $env:NEXT_PUBLIC_APP_URL/api/frame" -ForegroundColor Cyan
    Write-Host "Test URL: $env:NEXT_PUBLIC_APP_URL" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
