const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const photoCanvas = document.getElementById('photoCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const helperFrame = document.getElementById('helperFrame');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const colorPicker = document.getElementById('colorPicker');
const penTool = document.getElementById('penTool');
const clearTool = document.getElementById('clearTool');
const signatureTool = document.getElementById('signatureTool');
const flipHorizontal = document.getElementById('flipHorizontal');
const flipVertical = document.getElementById('flipVertical');
const rotateBtn = document.getElementById('rotateBtn');
const recordBtn = document.getElementById('recordBtn');
const playBtn = document.getElementById('playBtn');
const waveCanvas = document.getElementById('waveCanvas');

// 檢查元素是否存在後再獲取 context
let ctx = null;
let waveCtx = null;

if (photoCanvas) {
    ctx = photoCanvas.getContext('2d');
}

if (waveCanvas) {
    waveCtx = waveCanvas.getContext('2d');
}

// 如果元素不存在，提前返回
if (!photoCanvas || !ctx) {
    console.warn('photoCanvas 元素不存在，跳過初始化');
} else {

let currentImage = null;
let isDrawing = false;
let currentTool = 'pen';
let currentRotation = 0;
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioUrl = null;
let isRecording = false;
let recordingTimer = null;
let recordingTime = 0;

// 上傳照片功能
if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案！');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            // 設定畫布大小為約300x150px（可調整）
            photoCanvas.width = 300;
            photoCanvas.height = 150;
            ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
            ctx.drawImage(img, 0, 0, photoCanvas.width, photoCanvas.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 繪畫功能
if (brushSize && brushSizeValue) {
    brushSize.addEventListener('input', (e) => {
        brushSizeValue.textContent = e.target.value;
    });
}

if (penTool) {
    penTool.addEventListener('click', () => {
        currentTool = 'pen';
        updateToolButtons();
    });
}

if (clearTool && ctx && photoCanvas) {
    clearTool.addEventListener('click', () => {
        if (currentImage) {
            ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
            ctx.drawImage(currentImage, 0, 0, photoCanvas.width, photoCanvas.height);
        } else {
            ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        }
    });
}

if (signatureTool) {
    signatureTool.addEventListener('click', () => {
        currentTool = 'signature';
        updateToolButtons();
    });
}

function updateToolButtons() {
    [penTool, signatureTool].forEach(btn => btn.classList.remove('active'));
    if (currentTool === 'pen') penTool.classList.add('active');
    if (currentTool === 'signature') signatureTool.classList.add('active');
}

if (photoCanvas) {
    photoCanvas.addEventListener('mousedown', startDrawing);
    photoCanvas.addEventListener('mousemove', draw);
    photoCanvas.addEventListener('mouseup', stopDrawing);
    photoCanvas.addEventListener('mouseout', stopDrawing);

    // 觸控支援
    photoCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        photoCanvas.dispatchEvent(mouseEvent);
    });

    photoCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        photoCanvas.dispatchEvent(mouseEvent);
    });

    photoCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        photoCanvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    if (currentTool === 'pen' || currentTool === 'signature') {
        isDrawing = true;
        const rect = photoCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

function draw(e) {
    if (!isDrawing) return;
    if (!photoCanvas || !ctx || !brushSize || !colorPicker) return;
    const rect = photoCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = parseInt(brushSize.value);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();
    }
}

// 照片編輯功能
if (flipHorizontal) {
    flipHorizontal.addEventListener('click', () => {
        if (!currentImage) return;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(photoCanvas, -photoCanvas.width, 0);
        ctx.restore();
        const imageData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height);
        ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        ctx.putImageData(imageData, 0, 0);
    });
}

if (flipVertical) {
    flipVertical.addEventListener('click', () => {
        if (!currentImage) return;
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(photoCanvas, 0, -photoCanvas.height);
        ctx.restore();
        const imageData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height);
        ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        ctx.putImageData(imageData, 0, 0);
    });
}

if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        if (!currentImage) return;
        currentRotation = (currentRotation + 90) % 360;
        const imageData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height);
        ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        
        ctx.save();
        ctx.translate(photoCanvas.width / 2, photoCanvas.height / 2);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.drawImage(photoCanvas, -photoCanvas.width / 2, -photoCanvas.height / 2);
        ctx.restore();
    });
}

// 錄音功能
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    isRecording = false;
    if (recordBtn) {
        recordBtn.textContent = '開始錄音';
        recordBtn.classList.remove('recording');
    }
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

if (recordBtn) {
    recordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioUrl = URL.createObjectURL(audioBlob);
                    if (playBtn) {
                        playBtn.disabled = false;
                    }
                    drawWaveform();
                };

                mediaRecorder.start();
                isRecording = true;
                recordBtn.textContent = '停止錄音';
                recordBtn.classList.add('recording');
                recordingTime = 0;
                recordingTimer = setInterval(() => {
                    recordingTime++;
                    if (recordingTime >= 30) {
                        stopRecording();
                    }
                }, 1000);
            } catch (error) {
                alert('無法存取麥克風，請檢查權限設定。');
            }
        } else {
            stopRecording();
        }
    });
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    });
}

function drawWaveform() {
    if (!waveCtx || !waveCanvas) return;
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    if (audioChunks.length > 0) {
        waveCtx.fillStyle = '#ff9800';
        const barWidth = 4;
        const barSpacing = 2;
        const maxHeight = waveCanvas.height;
        
        for (let i = 0; i < 50; i++) {
            const barHeight = Math.random() * maxHeight * 0.8 + maxHeight * 0.1;
            const x = i * (barWidth + barSpacing);
            waveCtx.fillRect(x, (maxHeight - barHeight) / 2, barWidth, barHeight);
        }
    }
}

// 初始化波形顯示
if (waveCtx && waveCanvas) {
    drawWaveform();
}

// 上傳按鈕點擊事件
const uploadBtn = document.querySelector('.upload-btn');
if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

} // 關閉 else 區塊（第 34 行的 else）




