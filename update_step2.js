const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The logic for step 2 was mostly included in the previous step. Let's make sure it is fully working and the layout is good.
// I will adjust the layout to make the terminal take up the available space and add the function if it wasn't added properly.

// Look for startInitEnv function
if (!html.includes('function startInitEnv')) {
    console.log('Error: startInitEnv not found.');
} else {
    console.log('startInitEnv is present.');
}

// Adjust nextStep function to handle Step 2 to Step 3
html = html.replace(`
        function nextStep() {
            if (currentStep < 4) {
                currentStep++;
                maxUnlockedStep = Math.max(maxUnlockedStep, currentStep);
                updateStepperUI();
            }
        }`, `
        function nextStep() {
            if (currentStep < 4) {
                currentStep++;
                maxUnlockedStep = Math.max(maxUnlockedStep, currentStep);
                updateStepperUI();
            }
        }
`);

// The previous script added step 2 html and JS inside index.html.
// Let's refine the Step 2 UI.

const newStep2Html = `
            <!-- Step 2 Content -->
            <div id="step-2" class="step-content flex-1 flex flex-col h-full">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">步骤 2：初始化本地训练引擎</h2>

                <div class="flex-1 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden relative font-mono mb-4">
                    <div class="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <div class="flex space-x-2">
                            <div class="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                        </div>
                        <div class="text-xs text-gray-400 font-semibold tracking-wider">reolink-ai-core-cli</div>
                        <div class="w-10"></div> <!-- spacer -->
                    </div>

                    <div class="p-6 flex-1 overflow-y-auto term-scroll text-sm text-green-400 font-mono leading-relaxed" id="terminal-output">
                        <div class="text-gray-500 mb-4"># Ready to initialize local AI environment for selected device.</div>
                    </div>

                    <div class="p-4 bg-gray-800/80 border-t border-gray-700 flex items-center gap-4">
                        <button id="init-env-btn" class="bg-reoblue hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-sans text-sm font-semibold transition-all shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none" onclick="startInitEnv()">开始初始化</button>
                        <div class="flex-1 bg-gray-700 h-2.5 rounded-full overflow-hidden hidden shadow-inner" id="init-progress-bg">
                            <div class="bg-blue-500 h-full w-0 transition-all duration-300" id="init-progress-bar"></div>
                        </div>
                        <span id="init-status-text" class="text-xs text-gray-300 hidden font-sans font-medium w-8 text-right">0%</span>
                    </div>
                </div>
            </div>
`;

// Replace the old step 2 with the new one
html = html.replace(/<!-- Step 2 Content -->[\s\S]*?<!-- Step 3, 4 placeholders -->/, newStep2Html + '\n            <!-- Step 3, 4 placeholders -->');

// Re-write the startInitEnv function to ensure it's clean
const newStartInitEnv = `
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

            term.innerHTML += \`<div class="text-blue-300">> init_env.sh --device \${selectedDeviceName || 'target_device'}</div>\`;

            let i = 0;
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
                    btn.innerText = '初始化完成';
                    btn.classList.replace('bg-reoblue', 'bg-green-600');
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    btn.disabled = false; // keep it enabled but styled as complete
                    btn.onclick = null; // disable click action

                    term.innerHTML += \`<div class="mt-2 text-white font-bold">✅ Initialization successful. You may proceed.</div>\`;
                    term.scrollTop = term.scrollHeight;

                    updateStepperUI();
                }
            }, 600);
        }
`;

html = html.replace(/function startInitEnv\(\) \{[\s\S]*?\}\s*function selectDevice/, newStartInitEnv + '\n\n        function selectDevice');

// Fix step 1 device selection to capture name
html = html.replace(/function selectDevice\(element\) \{/, `
        let selectedDeviceName = '';
        function selectDevice(element) {
            selectedDeviceName = element.querySelector('h4').innerText;
`);

fs.writeFileSync('index.html', html);
console.log("Updated Step 2 styling and logic.");
