@echo off
echo ---------------------------------------
echo  WEBSITE UPDATE DEPLOYMENT SCRIPT
echo ---------------------------------------
echo.

echo [1/4] Adding all changes to Git...
git add index.html
git add default-mode-landing.html
git add about.html

echo.
echo [2/4] Committing changes...
git commit -m "Update website messaging: Stop running from yourself"

echo.
echo [3/4] Pushing to GitHub...
git push origin main

echo.
echo [4/4] Done! Your site will be updated in a few minutes.
echo.
echo Visit https://mikkelhansen.org to see your changes.
echo ---------------------------------------
pause
