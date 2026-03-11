const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Step 1 logic is already mostly there, let's just make sure the selectDevice function is fully defined and working with the Next button.
// The nextStep logic needs to hide the current step and show the next step.
// The base setup is already good for Step 1.

// I will create Step 2 placeholder to ensure transition works.
const step2Html = `
            <!-- Step 2 Content -->
            <div id="step-2" class="step-content flex-1 flex flex-col h-full">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">步骤 2：初始化本地训练引擎</h2>

                <div class="flex-1 bg-gray-900 rounded-xl shadow-inner border border-gray-800 flex flex-col overflow-hidden relative font-mono">
                    <div class="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                        <div class="flex space-x-2">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div class="text-xs text-gray-400">reolink-ai-core-cli</div>
                    </div>

                    <div class="p-6 flex-1 overflow-y-auto term-scroll text-sm text-green-400" id="terminal-output">
                        <div class="text-gray-500 mb-4"># Ready to initialize local AI environment for selected device.</div>
                    </div>

                    <div class="p-4 bg-gray-800/50 border-t border-gray-700 flex items-center gap-4">
                        <button id="init-env-btn" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-sans text-sm font-medium transition-colors" onclick="startInitEnv()">开始初始化</button>
                        <div class="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden hidden" id="init-progress-bg">
                            <div class="bg-blue-500 h-full w-0 transition-all duration-300" id="init-progress-bar"></div>
                        </div>
                        <span id="init-status-text" class="text-xs text-gray-400 hidden">0%</span>
                    </div>
                </div>
            </div>
`;

html = html.replace('<!-- Step 2, 3, 4 placeholders -->', step2Html + '\n            <!-- Step 3, 4 placeholders -->');

// Update JS for Step 2
const jsUpdate = `
        let initDone = false;

        function updateStepperUI() {
            document.querySelectorAll('.step-nav-item').forEach(item => {
                const step = parseInt(item.dataset.step);
                const indicator = item.querySelector('.nav-indicator');
                const title = item.querySelector('.nav-title');

                // Reset styles
                indicator.className = 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors nav-indicator';
                title.className = 'text-sm font-semibold nav-title transition-colors';

                if (step === currentStep) {
                    indicator.classList.add('bg-reoblue', 'text-white');
                    title.classList.add('text-gray-900');
                    item.classList.remove('opacity-50', 'cursor-not-allowed');
                    item.classList.add('cursor-pointer');
                } else if (step <= maxUnlockedStep) {
                    indicator.classList.add('bg-blue-100', 'text-reoblue');
                    title.classList.add('text-gray-700');
                    item.classList.remove('opacity-50', 'cursor-not-allowed');
                    item.classList.add('cursor-pointer');
                } else {
                    indicator.classList.add('bg-gray-200', 'text-gray-500');
                    title.classList.add('text-gray-500');
                    item.classList.add('opacity-50', 'cursor-not-allowed');
                    item.classList.remove('cursor-pointer');
                }
            });

            // Show/Hide content
            document.querySelectorAll('.step-content').forEach(content => {
                content.classList.remove('active');
            });
            const activeContent = document.getElementById(\`step-\${currentStep}\`);
            if (activeContent) activeContent.classList.add('active');

            // Update Next Button
            const nextBtn = document.getElementById('next-btn');
            nextBtn.style.display = 'block';
            nextBtn.innerText = '下一步';

            if (currentStep === 1) {
                nextBtn.disabled = !deviceSelected;
            } else if (currentStep === 2) {
                nextBtn.disabled = !initDone;
            } else if (currentStep === 4) {
                nextBtn.style.display = 'none'; // No next button on last step
            }
            // Logic for Step 3 will be added later
        }

        function startInitEnv() {
            const btn = document.getElementById('init-env-btn');
            const term = document.getElementById('terminal-output');
            const progressBg = document.getElementById('init-progress-bg');
            const progressBar = document.getElementById('init-progress-bar');
            const statusText = document.getElementById('init-status-text');

            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            progressBg.classList.remove('hidden');
            statusText.classList.remove('hidden');

            const logs = [
                "Connecting to local daemon...",
                "Allocating workspace resources...",
                "Downloading ONNX Runtime v1.14.1...",
                "Unpacking dependencies...",
                "Fetching MobileNetV2 Quantization Tools...",
                "Verifying checksums...",
                "Compiling custom ops...",
                "Environment ready. Initialization complete."
            ];

            let i = 0;
            term.innerHTML += \`<div>> init_env.sh --device RLC-810A</div>\`;

            const interval = setInterval(() => {
                if (i < logs.length) {
                    term.innerHTML += \`<div class="mt-1 opacity-90">\${logs[i]}</div>\`;
                    term.scrollTop = term.scrollHeight;

                    const percent = Math.floor(((i + 1) / logs.length) * 100);
                    progressBar.style.width = \`\${percent}%\`;
                    statusText.innerText = \`\${percent}%\`;
                    i++;
                } else {
                    clearInterval(interval);
                    initDone = true;
                    maxUnlockedStep = Math.max(maxUnlockedStep, 2);
                    btn.innerText = '初始化完成';
                    updateStepperUI();
                }
            }, 500);
        }
`;

html = html.replace(/function updateStepperUI\(\) \{[\s\S]*?function selectDevice/, jsUpdate + '\n\n        function selectDevice');

fs.writeFileSync('index.html', html);
console.log("Updated Step 1 and 2 logic.");
