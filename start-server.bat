@echo off
echo 正在啟動本地服務器...
echo 請在瀏覽器中訪問: http://localhost:8000
echo 按 Ctrl+C 停止服務器
echo.
python -m http.server 8000
if errorlevel 1 (
    echo Python 未安裝或無法使用，嘗試使用 Node.js...
    npx http-server -p 8000 -c-1
)



