const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

try {
  const dom = require('jsdom').JSDOM;
  const doc = new dom(html).window.document;
  console.log('HTML Valid');
} catch (e) {
  console.log('Error parsing:', e);
}
