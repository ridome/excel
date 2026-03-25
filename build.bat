@echo off
echo ===================================================
echo     Preparing to build JSON to Label Studio Tool
echo ===================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python and add it to PATH.
    pause
    exit /b 1
)

REM Install pyinstaller
echo Installing pyinstaller...
pip install pyinstaller -i https://pypi.tuna.tsinghua.edu.cn/simple

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install pyinstaller!
    pause
    exit /b 1
)

echo.
echo ===================================================
echo     Building... This might take a few minutes...
echo ===================================================
echo.

REM Run pyinstaller
pyinstaller --onefile --noconsole --windowed --clean json_to_ls.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check the errors above.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo [SUCCESS] Build completed!
echo [SUCCESS] You can find "json_to_ls.exe" in the "dist" folder.
echo ===================================================
pause
