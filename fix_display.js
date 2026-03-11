const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I notice Step 2 is showing underneath Step 1! The '.step-content.active' logic is using 'display: block' but the layout expects it to be flex and hidden. Let's fix this in CSS.

html = html.replace('.step-content.active { display: block; animation: fadeIn 0.3s ease-in-out; }', '.step-content { display: none; }\n        .step-content.active { display: flex; animation: fadeIn 0.3s ease-in-out; }');
html = html.replace('.step-content { display: none; }\n        .step-content { display: none; }', '.step-content { display: none; }'); // cleanup in case of duplicate

fs.writeFileSync('index.html', html);
console.log('Fixed step visibility CSS.');
