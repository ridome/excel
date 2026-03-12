const fs = require('fs');
try {
  const dom = require('jsdom').JSDOM;
  const html = fs.readFileSync('index.html', 'utf8');
  const doc = new dom(html, { runScripts: "dangerously" }).window.document;
  console.log("JSDOM works");
} catch (e) {
  console.log('Error parsing:', e);
}
