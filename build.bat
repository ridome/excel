@echo off
echo ===================================================
echo     准备打包 JSON 转 Label Studio 工具
echo ===================================================
echo.

:: 检查是否安装了 Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python，请先安装 Python 并添加到环境变量中！
    pause
    exit /b 1
)

:: 检查并安装 pip 依赖
echo 正在检查/安装打包依赖 pyinstaller...
pip install pyinstaller -i https://pypi.tuna.tsinghua.edu.cn/simple

if %errorlevel% neq 0 (
    echo [错误] 安装 pyinstaller 失败，请检查网络或 pip 设置！
    pause
    exit /b 1
)

echo.
echo ===================================================
echo     开始打包... 这可能需要几分钟时间...
echo ===================================================
echo.

:: 使用 pyinstaller 打包，生成单文件且无控制台窗口
pyinstaller --onefile --noconsole --windowed --clean json_to_ls.py

if %errorlevel% neq 0 (
    echo.
    echo [错误] 打包失败！请检查上方报错信息。
    pause
    exit /b 1
)

echo.
echo ===================================================
echo [成功] 打包完成！
echo [成功] 你可以在当前目录下的 "dist" 文件夹中找到 "json_to_ls.exe"
echo ===================================================
pause
