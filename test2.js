const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function nextStep\(\) \{[\s\S]*?\}/;
const match = html.match(regex);
console.log(match ? "Found nextStep()" : "Not found nextStep()");

const scriptTags = html.match(/<script>[\s\S]*?<\/script>/g);
if (scriptTags) {
    scriptTags.forEach((s, i) => console.log(`Script ${i}: ${s.length} bytes, contains nextStep? ${s.includes('nextStep')}`));
}
