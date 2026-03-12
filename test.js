const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue in Playwright is likely a race condition or the button simply being unreachable via `locator('#next-btn')` somehow if there's multiple or if something obscures it, but let's check if `nextStep()` is actually triggering by logging
console.log(html.includes('id="next-btn"'));
