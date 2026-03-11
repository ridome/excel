const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Use !important to override tailwind utilities if necessary, though it seems my previous replacement didn't work.
html = html.replace('.step-content.active { display: block; animation: fadeIn 0.3s ease-in-out; }', '.step-content.active { display: flex !important; animation: fadeIn 0.3s ease-in-out; }');
html = html.replace('.step-content { display: none; }', '.step-content { display: none !important; }');

// Wait, looking at the previous output, it seems it already replaced it but it might have been overridden by Tailwind's flex-1 flex flex-col utility classes on the element!
// Ah! Tailwind's "flex" class implies "display: flex".
// If an element has "step-content flex", tailwind sets display:flex which overrides the normal css rules unless we use !important.
// Let's ensure 'hidden' class logic or !important is used correctly.

html = html.replace('.step-content { display: none !important; }', '.step-content { display: none !important; }'); // ensuring !important
html = html.replace('.step-content.active { display: flex; animation: fadeIn 0.3s ease-in-out; }', '.step-content.active { display: flex !important; animation: fadeIn 0.3s ease-in-out; }');

fs.writeFileSync('index.html', html);
