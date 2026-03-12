const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I need to remove the OLD static code that is interfering.
// The old code includes:
// 1. Sync input names to labels (document.getElementById('class-a-name').addEventListener...)
// 2. function captureSample(type)
// 3. function startTraining() has references to sampleCountA, sampleCountB. Let's fix startTraining to just say 5 each or length.

const oldScriptStart = `        // Sync input names to labels`;
const oldScriptEnd = `            checkTrainingReady();
        }


        }`;

// Replace startTraining with updated
const newStartTraining = `function startTraining() {
            document.getElementById('config-view').classList.add('hidden');
            const trainView = document.getElementById('training-view');
            trainView.classList.remove('hidden');

            const logsBox = document.getElementById('train-logs');
            const progressText = document.getElementById('train-progress-text');
            const progressBar = document.getElementById('train-progress-bar');

            const logs = [
                "Loading dataset...",
                "Extracting MobileNet Features...",
                "Configuring Classification Head...",
                "Epoch 1/10 - Loss: 0.842 - Acc: 0.42",
                "Epoch 3/10 - Loss: 0.511 - Acc: 0.68",
                "Epoch 6/10 - Loss: 0.234 - Acc: 0.89",
                "Epoch 10/10 - Loss: 0.024 - Acc: 0.98",
                "Quantizing to INT8 format...",
                "Exporting ONNX model..."
            ];`;

html = html.replace(/        \/\/ Sync input names to labels[\s\S]*?checkTrainingReady\(\);\s*\}\s*\}/, '');
html = html.replace(/function startTraining\(\) \{[\s\S]*?"Exporting ONNX model\.\.\."\n            \];/, newStartTraining);

fs.writeFileSync('index.html', html);
