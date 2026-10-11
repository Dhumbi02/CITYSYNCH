@echo off
echo ========================================================
echo        Starting CitySync Smart Urban Portal
echo ========================================================
echo.
echo Checking port availability...
start "" http://localhost:5055
python app.py
pause
