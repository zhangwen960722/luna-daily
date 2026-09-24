@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动 Luna 文档服务器...
start "Luna文档服务器" cmd /c "node serve.js"
timeout /t 1 >nul
start "" http://localhost:8090/
echo.
echo 已为你打开浏览器。若浏览器没自动打开，请手动访问：
echo   http://localhost:8090/
echo.
echo 关闭服务器：在「Luna文档服务器」窗口按 Ctrl+C，或直接关闭该窗口。
pause
