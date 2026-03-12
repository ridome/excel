const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<!-- 3\.1 Task Type -->[\s\S]*?<!-- 3\.2 Define Classes -->/;

const replacement = `<!-- 3.1 Task Type -->
                            <div class="mb-6">
                                <h3 class="text-sm font-semibold text-gray-800 mb-3">任务类型</h3>
                                <div class="space-y-2">
                                    <label class="flex items-center gap-2 p-2.5 border border-reoblue bg-blue-50 rounded-lg cursor-pointer" id="label-task-type-fixed">
                                        <input type="radio" name="task_type" value="fixed" class="text-reoblue focus:ring-reoblue" checked onchange="handleTaskTypeChange()">
                                        <span class="text-sm font-medium text-gray-800" id="text-task-type-fixed">固定区域状态检测</span>
                                    </label>
                                    <label class="flex items-center gap-2 p-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" id="label-task-type-moving">
                                        <input type="radio" name="task_type" value="moving" class="text-reoblue focus:ring-reoblue" onchange="handleTaskTypeChange()">
                                        <span class="text-sm text-gray-600" id="text-task-type-moving">新增移动目标检测</span>
                                    </label>
                                    <label class="flex items-center gap-2 p-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" id="label-task-type-known">
                                        <input type="radio" name="task_type" value="known" class="text-reoblue focus:ring-reoblue" onchange="handleTaskTypeChange()">
                                        <span class="text-sm text-gray-600" id="text-task-type-known">已知目标细分</span>
                                    </label>
                                </div>
                            </div>

                            <!-- 3.2 Define Classes -->`;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html);
