@echo off
echo 🚀 Deploying your website changes to GitHub...

echo 📦 Adding all changes...
git add .

echo 💾 Committing changes...
git commit -m "Update website styling and fix CSS loading issues - deploy latest changes"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deployment complete!
echo 🌐 Your website should update in 2-5 minutes at https://mikkelhansen.org
pause

