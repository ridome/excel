const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The error is around line 457. It looks like an orphan `}`. Let's find it.
const regex = /checkTrainingReady\(\);\s*\}\s*\}\s*function startTraining\(\)/;
if (regex.test(html)) {
    html = html.replace(regex, "checkTrainingReady();\n        }\n\n        function startTraining()");
}

const regex2 = /checkTrainingReady\(\);\s*\}\s*function startTraining\(\)/;
// Wait, looking at the previous patch:
// let finalScript = scriptContent.replace(/function checkTrainingReady[\s\S]*?\}/, '');
// It probably left behind an extra `}` or removed too little.

// Let's just look at the raw script block around line 455
