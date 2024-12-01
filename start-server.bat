@echo off
cd /d C:\Cartoon\Projects\Checklist

:: Uruchomić serwer json-server
json-server --watch db.json --port 3000

:: Wstrzymać proces, czekając na zamknięcie okna CMD
pause