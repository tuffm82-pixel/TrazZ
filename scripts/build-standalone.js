// Build one offline-playable HTML file using only Node's built-in libraries.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
let html = read('index.html');
html = html.replace('href="./"', 'href="#"');
for (const file of ['style.css', 'campaign.css']) {
  html = html.replace(`<link rel="stylesheet" href="${file}">`, () => `<style>\n${read(file)}\n</style>`);
}
for (const file of ['data.js', 'core.js', 'app.js']) {
  html = html.replace(`<script src="${file}"></script>`, () => `<script>\n${read(file)}\n</script>`);
}
for (const file of ['assets/characters/scout.svg', 'assets/characters/scout-body.svg', 'assets/favicon.svg']) {
  const uri = 'data:image/svg+xml,' + encodeURIComponent(read(file)).replace(/'/g, '%27');
  html = html.split(file).join(uri);
}
fs.writeFileSync(path.join(root, 'TrazZ.html'), html);
console.log('Built TrazZ.html — open this single file in any modern browser to play.');
