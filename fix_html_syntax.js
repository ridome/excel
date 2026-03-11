const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// There was a minor issue with the regex replacement for CSS in step 4 where I replaced comments directly. Let's make sure the CSS block is clean.
// It seems fine but let's just make sure there are no double closing style tags or similar.
console.log(html.includes('/* Custom scrollbar for terminals */'));
console.log(html.includes('@keyframes dataStream'));
