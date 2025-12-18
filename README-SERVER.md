# 如何解決 CORS 錯誤

## 問題說明
當直接從文件系統打開 HTML 文件時（雙擊打開），瀏覽器會因為安全政策（CORS）阻止載入本地圖片。

## 解決方案：使用本地服務器

### 方法 1：使用 Python（推薦）

1. 打開命令提示字元（CMD）或 PowerShell
2. 切換到專案目錄：
   ```bash
   cd "C:\Users\tina\Desktop\最好的"
   ```
3. 執行以下命令：
   ```bash
   python -m http.server 8000
   ```
4. 在瀏覽器中訪問：`http://localhost:8000`

### 方法 2：使用 Node.js

1. 安裝 Node.js（如果還沒安裝）
2. 在專案目錄執行：
   ```bash
   npx http-server -p 8000 -c-1
   ```
3. 在瀏覽器中訪問：`http://localhost:8000`

### 方法 3：使用雙擊啟動（Windows）

直接雙擊 `start-server.bat` 文件，它會自動嘗試使用 Python 或 Node.js 啟動服務器。

## 注意事項

- 服務器運行時，不要關閉命令提示字元窗口
- 要停止服務器，按 `Ctrl+C`
- 使用服務器後，所有功能都能正常工作，包括圖片載入和相機功能



