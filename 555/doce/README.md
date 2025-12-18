# 編輯頁面應用程式

這是一個使用 Next.js + TypeScript + Tailwind CSS 建立的編輯頁面，包含相機拍照、錄音、照片編輯和畫筆繪圖功能。

## 功能特色

- 📸 **自拍相機**：使用 MediaDevices.getUserMedia 開啟相機並拍照
- 🎤 **錄音功能**：使用 MediaRecorder 錄音，錄完後在照片左下角顯示播放器
- 🖼 **照片編輯**：使用 fabric.js 實現照片旋轉和翻轉功能
- 🖌 **畫筆繪圖**：可在編輯區自由繪圖，可調整筆刷粗細與顏色

## 安裝與執行

1. 安裝依賴：
```bash
npm install
```

2. 執行開發伺服器：
```bash
npm run dev
```

3. 開啟瀏覽器訪問 `http://localhost:3000`

## 專案結構

```
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主頁面
│   └── globals.css         # 全域樣式
├── components/
│   ├── Editor.tsx          # 主要編輯組件
│   ├── CameraButton.tsx    # 相機按鈕組件
│   ├── MicrophoneButton.tsx # 錄音按鈕組件
│   ├── ImageEditButton.tsx  # 照片編輯按鈕組件
│   ├── BrushButton.tsx     # 畫筆按鈕組件
│   └── AudioPlayer.tsx     # 音訊播放器組件
├── POT/                    # 圖片資源資料夾
│   └── 5F07DCD9-034F-4825-8E15-F20538DBBEC1.png
└── public/                 # 公開資源（圖片會放在這裡）
```

## 注意事項

- 需要在瀏覽器中允許相機和麥克風權限
- 圖片路徑請放在 `public/POT/` 資料夾中
- Icon 圖片請放在 `public/POT/` 資料夾中












