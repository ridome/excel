const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldRegex = /<!-- 3\.2 Define Classes -->[\s\S]*?<!-- 3\.4 Train Button Area -->/;

const newContent = `<!-- 3.2 Define Classes -->
                            <div class="mb-6" id="section-define-classes">
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="text-sm font-semibold text-gray-800">定义检测状态</h3>
                                    <button onclick="addState()" class="text-xs text-reoblue hover:text-blue-700 font-medium flex items-center gap-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                        添加状态
                                    </button>
                                </div>
                                <div id="states-container" class="space-y-3">
                                    <!-- States injected via JS -->
                                </div>
                            </div>

                            <!-- 3.3 Data Collection -->
                            <div class="flex-1 mb-6 flex flex-col min-h-0" id="section-data-collection">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">采集训练样本</h3>

                                <div class="flex-1 overflow-y-auto space-y-4 pr-1" id="samples-container">
                                    <!-- Samples injected via JS -->
                                </div>
                            </div>

                            <!-- Single Target Collection for "Moving" Task -->
                            <div class="flex-1 mb-6 flex flex-col min-h-0 hidden" id="section-single-target">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">采集目标样本</h3>
                                <p class="text-xs text-gray-500 mb-3">针对新增移动目标，您只需收集目标在不同角度和光线下的样本。</p>
                                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col">
                                    <div class="flex justify-between items-center mb-3">
                                        <span class="text-xs font-semibold text-gray-700">目标对象样本</span>
                                        <span class="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm" id="single-sample-count">已采集: 0/5 (至少需要 5 张)</span>
                                    </div>
                                    <button class="w-full py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-reoblue hover:border-reoblue transition-colors mb-3 flex items-center justify-center gap-2" onclick="captureSingleSample()">
                                        <span class="text-lg">📸</span> 截取当前画面作为样本
                                    </button>
                                    <div class="grid grid-cols-4 gap-2" id="single-sample-grid">
                                        <!-- Sample images will appear here -->
                                    </div>
                                </div>
                            </div>

                            <!-- 3.4 Train Button Area -->`;

if (oldRegex.test(html)) {
    html = html.replace(oldRegex, newContent);
}

// Clean up old script references safely
html = html.replace(/        \/\/ Sync input names to labels[\s\S]*?checkTrainingReady\(\);\s*\}\s*/, '');
html = html.replace(/<button id="start-train-btn" disabled onclick="startTraining\(\)"/g, '<button id="train-btn" disabled onclick="startTraining()"');

fs.writeFileSync('index.html', html);
