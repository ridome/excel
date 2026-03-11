const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const step3Html = `
            <!-- Step 3 Content -->
            <div id="step-3" class="step-content flex-1 flex flex-col h-full overflow-hidden">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 shrink-0">步骤 3：定义您的专属 AI 视觉任务</h2>

                <div class="flex-1 flex gap-6 min-h-0">

                    <!-- Left: Video & ROI Area -->
                    <div class="w-[60%] flex flex-col gap-4">
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
                            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4 text-reoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                实时画面与检测区域 (ROI)
                            </h3>
                            <div class="relative flex-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                <!-- Placeholder Image -->
                                <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Camera Feed" class="w-full h-full object-cover select-none">

                                <!-- Canvas overlay simulated -->
                                <div class="absolute inset-0 z-10" id="canvas-overlay">
                                    <div class="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500/20 border-2 border-dashed border-reoblue flex items-center justify-center cursor-move" style="box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);">
                                        <div class="text-white text-sm font-semibold drop-shadow-md text-center bg-black/50 px-3 py-1 rounded">
                                            监控区域 (ROI)
                                        </div>
                                        <div class="resize-handle -top-1.5 -left-1.5 cursor-nwse-resize"></div>
                                        <div class="resize-handle -top-1.5 -right-1.5 cursor-nesw-resize"></div>
                                        <div class="resize-handle -bottom-1.5 -left-1.5 cursor-nesw-resize"></div>
                                        <div class="resize-handle -bottom-1.5 -right-1.5 cursor-nwse-resize"></div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-3 text-center">提示：请拖动并调整蓝色框线，圈出需要重点监控的区域。</p>
                        </div>
                    </div>

                    <!-- Right: Configuration & Training -->
                    <div class="w-[40%] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative" id="training-panel">

                        <!-- Configuration View -->
                        <div id="config-view" class="flex-1 flex flex-col p-5 overflow-y-auto">
                            <!-- 3.1 Task Type -->
                            <div class="mb-6">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">任务类型</h3>
                                <div class="space-y-2">
                                    <label class="flex items-center gap-2 p-2.5 border border-reoblue bg-blue-50 rounded-lg cursor-pointer">
                                        <input type="radio" name="task_type" class="text-reoblue focus:ring-reoblue" checked>
                                        <span class="text-sm font-medium text-gray-800">固定区域状态检测</span>
                                    </label>
                                    <label class="flex items-center gap-2 p-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <input type="radio" name="task_type" class="text-reoblue focus:ring-reoblue">
                                        <span class="text-sm text-gray-600">新增移动目标检测</span>
                                    </label>
                                </div>
                            </div>

                            <!-- 3.2 Define Classes -->
                            <div class="mb-6">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">定义检测状态</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs text-gray-500 mb-1">状态 A 名称</label>
                                        <input type="text" id="class-a-name" value="Garage_Closed" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-reoblue focus:border-reoblue outline-none transition-shadow">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-gray-500 mb-1">状态 B 名称</label>
                                        <input type="text" id="class-b-name" value="Garage_Open" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-reoblue focus:border-reoblue outline-none transition-shadow">
                                    </div>
                                </div>
                            </div>

                            <!-- 3.3 Collect Samples -->
                            <div class="flex-1">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">采集训练样本</h3>

                                <div class="space-y-4">
                                    <!-- Class A Samples -->
                                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm font-medium text-gray-700" id="label-a-display">Garage_Closed</span>
                                            <span class="text-xs text-gray-500 font-mono" id="count-a">0/5</span>
                                        </div>
                                        <button onclick="captureSample('A')" class="w-full py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 mb-2 shadow-sm">
                                            📸 截取当前画面
                                        </button>
                                        <div class="grid grid-cols-5 gap-1.5 h-10" id="gallery-a">
                                            <!-- Samples will go here -->
                                        </div>
                                    </div>

                                    <!-- Class B Samples -->
                                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm font-medium text-gray-700" id="label-b-display">Garage_Open</span>
                                            <span class="text-xs text-gray-500 font-mono" id="count-b">0/5</span>
                                        </div>
                                        <button onclick="captureSample('B')" class="w-full py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 mb-2 shadow-sm">
                                            📸 截取当前画面
                                        </button>
                                        <div class="grid grid-cols-5 gap-1.5 h-10" id="gallery-b">
                                            <!-- Samples will go here -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 3.4 Train Button Area -->
                            <div class="mt-6 pt-4 border-t border-gray-100">
                                <button id="start-train-btn" disabled onclick="startTraining()" class="w-full py-3 bg-reoblue text-white rounded-lg font-bold shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2">
                                    🚀 开始本地轻量化训练
                                </button>
                                <p class="text-[10px] text-gray-400 text-center mt-2">每个状态至少需要 5 张样本才能开始训练</p>
                            </div>
                        </div>

                        <!-- Training Simulator View (Hidden Initially) -->
                        <div id="training-view" class="absolute inset-0 bg-gray-900 flex flex-col hidden z-20">
                            <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
                                <h3 class="text-white font-semibold text-sm">模型训练中...</h3>
                                <div class="flex gap-1.5">
                                    <div class="w-2 h-2 bg-reoblue rounded-full animate-ping"></div>
                                </div>
                            </div>

                            <div class="flex-1 p-5 overflow-y-auto term-scroll font-mono text-xs text-gray-300 space-y-1.5" id="train-logs">
                                <div>[SYS] Initializing local training pipeline...</div>
                            </div>

                            <div class="p-5 bg-gray-800/80 border-t border-gray-800">
                                <div class="flex justify-between text-xs mb-1.5 font-mono">
                                    <span class="text-blue-400">Epoch Progress</span>
                                    <span class="text-white" id="train-progress-text">0%</span>
                                </div>
                                <div class="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div class="bg-blue-500 h-full w-0 transition-all duration-300" id="train-progress-bar"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
`;

// Add step 3 to HTML placeholders
html = html.replace('<!-- Step 3, 4 placeholders -->', step3Html + '\n            <!-- Step 4 placeholders -->');

// Add JS logic for Step 3
const step3JS = `
        let sampleCountA = 0;
        let sampleCountB = 0;
        let trainingComplete = false;

        // Sync input names to labels
        document.getElementById('class-a-name').addEventListener('input', (e) => {
            document.getElementById('label-a-display').innerText = e.target.value || 'Class A';
        });
        document.getElementById('class-b-name').addEventListener('input', (e) => {
            document.getElementById('label-b-display').innerText = e.target.value || 'Class B';
        });

        function captureSample(type) {
            const galleryId = type === 'A' ? 'gallery-a' : 'gallery-b';
            const countId = type === 'A' ? 'count-a' : 'count-b';
            const gallery = document.getElementById(galleryId);
            const countSpan = document.getElementById(countId);

            // Limit to 5 visually for demo (though they could add more)
            let count = type === 'A' ? ++sampleCountA : ++sampleCountB;

            if (count <= 5) {
                // Add tiny thumbnail placeholder
                const thumb = document.createElement('div');
                thumb.className = 'w-full h-10 bg-gray-300 rounded bg-cover bg-center border border-gray-400/30 shadow-inner animate-[fadeIn_0.2s_ease-out]';
                // Use random unsplash image crop as thumbnail
                thumb.style.backgroundImage = \`url('https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=\${100+count}&q=80')\`;
                gallery.appendChild(thumb);
            }

            // Update counter
            countSpan.innerText = \`\${count}/5\`;
            if (count >= 5) countSpan.classList.add('text-green-600', 'font-bold');

            checkTrainingReady();
        }

        function checkTrainingReady() {
            const btn = document.getElementById('start-train-btn');
            if (sampleCountA >= 5 && sampleCountB >= 5) {
                btn.disabled = false;
            }
        }

        function startTraining() {
            document.getElementById('config-view').classList.add('hidden');
            const trainView = document.getElementById('training-view');
            trainView.classList.remove('hidden');

            const logsBox = document.getElementById('train-logs');
            const progressText = document.getElementById('train-progress-text');
            const progressBar = document.getElementById('train-progress-bar');

            const logs = [
                "Loading dataset (A: " + sampleCountA + ", B: " + sampleCountB + ")...",
                "Extracting MobileNet Features...",
                "Configuring Classification Head...",
                "Epoch 1/10 - Loss: 0.842 - Acc: 0.42",
                "Epoch 3/10 - Loss: 0.511 - Acc: 0.68",
                "Epoch 6/10 - Loss: 0.234 - Acc: 0.89",
                "Epoch 10/10 - Loss: 0.024 - Acc: 0.98",
                "Quantizing to INT8 format...",
                "Exporting ONNX model..."
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    const logEl = document.createElement('div');
                    logEl.innerText = \`> \${logs[i]}\`;
                    logsBox.appendChild(logEl);
                    logsBox.scrollTop = logsBox.scrollHeight;

                    const percent = Math.floor(((i + 1) / logs.length) * 100);
                    progressBar.style.width = \`\${percent}%\`;
                    progressText.innerText = \`\${percent}%\`;
                    i++;
                } else {
                    clearInterval(interval);

                    const successLog = document.createElement('div');
                    successLog.className = "text-green-400 mt-4 font-bold p-2 bg-green-900/30 rounded border border-green-800";
                    successLog.innerText = "✅ 训练完成！生成独立权重文件，大小：2.4 KB。";
                    logsBox.appendChild(successLog);
                    logsBox.scrollTop = logsBox.scrollHeight;

                    trainingComplete = true;
                    maxUnlockedStep = Math.max(maxUnlockedStep, 3);
                    updateStepperUI();
                }
            }, 400); // 400ms per step * 9 steps ~ 3.6 seconds total
        }
`;

// Insert the new JS logic before `updateStepperUI()`
html = html.replace('function updateStepperUI', step3JS + '\n        function updateStepperUI');

// Update `updateStepperUI` to handle Step 3 Next Button unlocking
const updateStepperUIRegex = /if \(currentStep === 1\) \{[\s\S]*?\/\/ Logic for Step 3 will be added later/m;
const updatedNextLogic = `if (currentStep === 1) {
                nextBtn.disabled = !deviceSelected;
            } else if (currentStep === 2) {
                nextBtn.disabled = !initDone;
            } else if (currentStep === 3) {
                nextBtn.disabled = !trainingComplete;
            } else if (currentStep === 4) {
                nextBtn.style.display = 'none';
            }`;

html = html.replace(updateStepperUIRegex, updatedNextLogic);

fs.writeFileSync('index.html', html);
console.log('Step 3 injected successfully.');
