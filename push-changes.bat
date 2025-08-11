@echo off
echo Adding all changes...
git add .
echo Committing changes...
git commit -m "Clean slate: Remove all website content and start fresh"
echo Pushing to GitHub...
git push origin master
echo Done!
pause

