const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I need to properly inject the new script. It seems my `patch_step3_dynamic.js` messed up or I overwrote it. Let's do it clean.

const scriptStart = html.indexOf('// Global State');

if (scriptStart !== -1) {
    const newScript = `
        let states = [
            { id: 'state-a', name: 'Garage_Closed', samples: [] },
            { id: 'state-b', name: 'Garage_Open', samples: [] }
        ];

        let singleTargetSamples = [];
        let currentTaskType = 'fixed';

        function renderStates() {
            const container = document.getElementById('states-container');
            if(!container) return;
            container.innerHTML = '';

            states.forEach((state, index) => {
                const div = document.createElement('div');
                div.className = "flex items-center gap-2";
                div.innerHTML = \`
                    <div class="flex-1">
                        <label class="block text-xs text-gray-500 mb-1">状态 \${index + 1} 名称</label>
                        <input type="text" value="\${state.name}" oninput="updateStateName('\${state.id}', this.value)" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-reoblue focus:border-reoblue outline-none transition-shadow">
                    </div>
                    \${states.length > 2 ? \`
                    <button onclick="removeState('\${state.id}')" class="mt-5 p-2 text-gray-400 hover:text-red-500 transition-colors" title="删除状态">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    \` : '<div class="w-9"></div>'}
                \`;
                container.appendChild(div);
            });

            renderSamples();
        }

        function renderSamples() {
            const container = document.getElementById('samples-container');
            if(!container) return;
            container.innerHTML = '';

            states.forEach((state) => {
                const count = state.samples.length;
                const isComplete = count >= 5;
                const countClass = isComplete ? 'text-green-600 font-medium bg-green-50 border-green-200' : 'text-gray-500 bg-white border-gray-200';

                const div = document.createElement('div');
                div.className = "bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col";

                // Construct image grid html
                let gridHtml = '';
                state.samples.forEach(() => {
                    gridHtml += \`<div class="aspect-square bg-gray-200 rounded overflow-hidden border border-gray-300">
                        <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-full h-full object-cover">
                    </div>\`;
                });

                div.innerHTML = \`
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-semibold text-gray-700">状态：\${state.name || '未命名'}</span>
                        <span class="text-xs px-2 py-0.5 rounded border shadow-sm \${countClass}" id="count-\${state.id}">已采集: \${count}/5 (至少需要 5 张)</span>
                    </div>
                    <button class="w-full py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-reoblue hover:border-reoblue transition-colors mb-3 flex items-center justify-center gap-2" onclick="captureSample('\${state.id}')">
                        <span class="text-lg">📸</span> 截取当前画面作为样本
                    </button>
                    <div class="grid grid-cols-4 gap-2" id="grid-\${state.id}">
                        \${gridHtml}
                    </div>
                \`;
                container.appendChild(div);
            });

            checkTrainingReady();
        }

        function addState() {
            const newId = 'state-' + Date.now();
            states.push({ id: newId, name: 'New_State_' + (states.length + 1), samples: [] });
            renderStates();
        }

        function removeState(id) {
            if (states.length <= 2) return;
            states = states.filter(s => s.id !== id);
            renderStates();
        }

        function updateStateName(id, newName) {
            const state = states.find(s => s.id === id);
            if (state) {
                state.name = newName;
                renderSamples();
            }
        }

        function captureSample(id) {
            const state = states.find(s => s.id === id);
            if (state) {
                state.samples.push('sample.jpg');
                renderSamples();
            }
        }

        function captureSingleSample() {
            singleTargetSamples.push('sample.jpg');

            const grid = document.getElementById('single-sample-grid');
            const imgDiv = document.createElement('div');
            imgDiv.className = "aspect-square bg-gray-200 rounded overflow-hidden border border-gray-300";
            imgDiv.innerHTML = '<img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-full h-full object-cover">';
            grid.appendChild(imgDiv);

            const count = singleTargetSamples.length;
            const counter = document.getElementById('single-sample-count');
            counter.innerText = \`已采集: \${count}/5 (至少需要 5 张)\`;
            if (count >= 5) {
                counter.className = "text-xs px-2 py-0.5 rounded border shadow-sm text-green-600 font-medium bg-green-50 border-green-200";
            }
            checkTrainingReady();
        }

        function handleTaskTypeChange() {
            const radios = document.getElementsByName('task_type');
            for (let radio of radios) {
                const label = radio.parentElement;
                const span = label.querySelector('span');
                if (radio.checked) {
                    currentTaskType = radio.value;
                    label.classList.add('border-reoblue', 'bg-blue-50');
                    label.classList.remove('border-gray-200', 'hover:bg-gray-50');
                    span.classList.add('font-medium', 'text-gray-800');
                    span.classList.remove('text-gray-600');
                } else {
                    label.classList.remove('border-reoblue', 'bg-blue-50');
                    label.classList.add('border-gray-200', 'hover:bg-gray-50');
                    span.classList.remove('font-medium', 'text-gray-800');
                    span.classList.add('text-gray-600');
                }
            }

            const sectionClasses = document.getElementById('section-define-classes');
            const sectionCollection = document.getElementById('section-data-collection');
            const sectionSingle = document.getElementById('section-single-target');

            if (currentTaskType === 'moving') {
                sectionClasses.classList.add('hidden');
                sectionCollection.classList.add('hidden');
                sectionSingle.classList.remove('hidden');
            } else {
                sectionClasses.classList.remove('hidden');
                sectionCollection.classList.remove('hidden');
                sectionSingle.classList.add('hidden');

                if (currentTaskType === 'known' && states.length === 2 && states[0].name === 'Garage_Closed') {
                    states[0].name = 'Person';
                    states[1].name = 'Vehicle';
                    renderStates();
                } else if (currentTaskType === 'fixed' && states.length === 2 && states[0].name === 'Person') {
                    states[0].name = 'Garage_Closed';
                    states[1].name = 'Garage_Open';
                    renderStates();
                }
            }

            checkTrainingReady();
        }

        function checkTrainingReady() {
            const btn = document.getElementById('train-btn');
            if(!btn) return;
            let isReady = false;

            if (currentTaskType === 'moving') {
                isReady = singleTargetSamples.length >= 5;
            } else {
                isReady = states.every(s => s.samples.length >= 5);
            }

            if (isReady) {
                btn.disabled = false;
                btn.classList.remove('bg-gray-300', 'cursor-not-allowed', 'text-gray-500');
                btn.classList.add('bg-reoblue', 'hover:bg-blue-600', 'text-white', 'shadow-md', 'hover:shadow-lg');
                btn.innerHTML = '🚀 开始本地轻量化训练';
            } else {
                btn.disabled = true;
                btn.classList.add('bg-gray-300', 'cursor-not-allowed', 'text-gray-500');
                btn.classList.remove('bg-reoblue', 'hover:bg-blue-600', 'text-white', 'shadow-md', 'hover:shadow-lg');
                btn.innerHTML = '⚠️ 需采集足够样本方可训练';
            }
        }

        // Initialize Step 3 dynamically
        document.addEventListener('DOMContentLoaded', () => {
            renderStates();
        });
`;
    const toInsert = `\n${newScript}\n`;
    html = html.substring(0, scriptStart + '// Global State'.length) + toInsert + html.substring(scriptStart + '// Global State'.length);
}

fs.writeFileSync('index.html', html);
