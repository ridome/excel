const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const step4Html = `
            <!-- Step 4 Content -->
            <div id="step-4" class="step-content flex-1 flex flex-col h-full overflow-hidden">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 shrink-0">步骤 4：边缘部署与同步</h2>

                <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 relative overflow-hidden">

                    <div class="text-center mb-12">
                        <h3 class="text-lg font-semibold text-gray-800">将您的专属 AI 模型同步至目标摄像机</h3>
                        <p class="text-sm text-gray-500 mt-2">模型文件极小，传输速度快，不消耗摄像机额外算力</p>
                    </div>

                    <!-- Sync Animation Area -->
                    <div class="flex items-center justify-center w-full max-w-2xl px-10 relative h-48">

                        <!-- PC Icon -->
                        <div class="flex flex-col items-center gap-3 z-10 w-24">
                            <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shadow-md border border-blue-100">
                                <svg class="w-10 h-10 text-reoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <span class="text-sm font-semibold text-gray-700">PC 端 (实验室)</span>
                        </div>

                        <!-- Data Stream Line -->
                        <div class="flex-1 mx-4 relative h-1 flex items-center">
                            <!-- Dashed static background -->
                            <div class="absolute inset-0 border-t-2 border-dashed border-gray-300"></div>

                            <!-- Animated data dots (hidden initially) -->
                            <div id="data-stream-container" class="absolute inset-0 overflow-hidden hidden">
                                <div class="w-full h-full flex justify-around items-center animate-[dataStream_1s_linear_infinite]">
                                    <div class="w-2 h-2 rounded-full bg-reoblue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                    <div class="w-2 h-2 rounded-full bg-reoblue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                    <div class="w-2 h-2 rounded-full bg-reoblue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Camera Icon -->
                        <div class="flex flex-col items-center gap-3 z-10 w-24">
                            <div id="camera-icon-bg" class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shadow-md border border-gray-200 transition-colors duration-500">
                                <svg id="camera-icon" class="w-10 h-10 text-gray-400 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </div>
                            <span class="text-sm font-semibold text-gray-700" id="sync-target-name">目标摄像机</span>
                        </div>
                    </div>

                    <!-- Sync Action & Status -->
                    <div class="mt-12 flex flex-col items-center h-24">
                        <button id="sync-btn" onclick="startSync()" class="px-8 py-3 bg-reoblue text-white rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all flex justify-center items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            同步到摄像机
                        </button>

                        <div id="sync-success-msg" class="hidden flex-col items-center mt-4">
                            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2 animate-[bounce_0.5s_ease-out]">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p class="text-lg font-bold text-gray-800">同步成功！</p>
                            <p class="text-sm text-gray-500 mt-1">您的摄像机现在已具备离线识别能力。</p>
                        </div>
                    </div>
                </div>
            </div>
`;

// Add CSS keyframes for data stream animation
const cssUpdate = `
        @keyframes dataStream {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-\\[dataStream_1s_linear_infinite\\] {
            animation: dataStream 1.5s linear infinite;
        }
        .animate-\\[bounce_0\\.5s_ease-out\\] {
            animation: customBounce 0.5s ease-out;
        }
        @keyframes customBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px); }
            60% { transform: translateY(-7px); }
        }
        /* Custom scrollbar for terminals */`;

html = html.replace('/* Custom scrollbar for terminals */', cssUpdate);

// Replace placeholders
html = html.replace('<!-- Step 4 placeholders -->', step4Html);

// Add JS logic for Step 4
const step4JS = `
        function startSync() {
            const btn = document.getElementById('sync-btn');
            const stream = document.getElementById('data-stream-container');
            const camBg = document.getElementById('camera-icon-bg');
            const camIcon = document.getElementById('camera-icon');
            const successMsg = document.getElementById('sync-success-msg');

            // Set device name in UI
            document.getElementById('sync-target-name').innerText = selectedDeviceName || '目标摄像机';

            // Start animation
            btn.classList.add('hidden');
            stream.classList.remove('hidden');

            // Simulate transfer time (3s)
            setTimeout(() => {
                stream.classList.add('hidden');

                // Light up camera icon
                camBg.classList.replace('bg-gray-50', 'bg-green-50');
                camBg.classList.replace('border-gray-200', 'border-green-200');
                camIcon.classList.replace('text-gray-400', 'text-green-500');

                // Show success
                successMsg.classList.remove('hidden');
                successMsg.classList.add('flex');
            }, 3000);
        }
`;

html = html.replace('function updateStepperUI', step4JS + '\n        function updateStepperUI');

fs.writeFileSync('index.html', html);
console.log('Step 4 injected successfully.');
