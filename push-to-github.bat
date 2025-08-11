@echo off
echo Adding all files to Git...
git add .

echo Committing changes...
git commit -m "Update website with men's mentoring content"

echo Pushing to GitHub...
git push origin master

echo Done! Your site should now be updated on GitHub.
pause
