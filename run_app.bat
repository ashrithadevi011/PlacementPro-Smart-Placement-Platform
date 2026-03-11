@echo off
echo Starting PlacementPro Development Server...
echo Please wait... The browser will open automatically in a few seconds.

:: This command waits a few seconds in the background and then opens the browser
start "" /B cmd /c "ping 127.0.0.1 -n 4 > nul & start http://localhost:4500"

:: Start the actual server
npm run dev
pause
