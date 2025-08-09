# PowerShell script to push changes to GitHub
Write-Host "🚀 Deploying your website changes to GitHub..." -ForegroundColor Green

Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Update website styling and fix CSS loading issues - deploy latest changes"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your website should update in 2-5 minutes at https://mikkelhansen.org" -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

