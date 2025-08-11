@echo off
echo Starting simple local server...
echo.
echo Your professional mentoring website is now available at:
echo http://localhost:8000
echo.
echo Features:
echo - Modern, responsive design
echo - Professional mentoring content
echo - Contact form functionality
echo - Mobile-friendly navigation
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause

