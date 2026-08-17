const fs = require('fs');
const path = require('path');

async function download() {
  const scratchDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\f11987f4-8ca0-4b7d-988b-2a9b6c471e48\\scratch';
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

  const files = ['index.html', 'style.css', 'script.js'];
  for (const file of files) {
    const url = `https://raw.githubusercontent.com/MithunzDas/caa-court-affidavit/main/${file}`;
    console.log('Downloading', url);
    const res = await fetch(url);
    const text = await res.text();
    fs.writeFileSync(path.join(scratchDir, file), text, 'utf8');
    console.log('Saved', file, text.length, 'bytes');
  }
}

download().catch(console.error);
