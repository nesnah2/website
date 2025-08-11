Write-Host "Adding all changes..." -ForegroundColor Green
git add .

Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Clean slate: Remove all website content and start fresh"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin master

Write-Host "Done! Changes pushed to GitHub." -ForegroundColor Green
Read-Host "Press Enter to continue"

