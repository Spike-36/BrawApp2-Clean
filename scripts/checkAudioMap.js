// scripts/checkAudioMap.js
const fs = require('fs');
const path = require('path');

const blocks = require('../data/blocks.json');
const audioMapPath = path.join(__dirname, '../components/audioMap.js');

// --- get block IDs ---
const blockIds = blocks.map(b => b.id);

// --- extract keys from audioMap.js ---
const audioMapSource = fs.readFileSync(audioMapPath, 'utf8');
const regex = /^\s*([A-Z0-9]+):\s*{/gm; // matches Z003:, Z004:, etc.
let match;
const audioIds = [];
while ((match = regex.exec(audioMapSource)) !== null) {
  audioIds.push(match[1]);
}

// --- compare ---
const missingInAudioMap = blockIds.filter(id => !audioIds.includes(id));
const extraInAudioMap = audioIds.filter(id => !blockIds.includes(id));

console.log('Total blocks:', blockIds.length);
console.log('Total audioMap entries:', audioIds.length);

if (missingInAudioMap.length) {
  console.log('⚠️ Missing in audioMap:', missingInAudioMap);
} else {
  console.log('✅ All blocks have audioMap entries');
}

if (extraInAudioMap.length) {
  console.log('⚠️ Extra in audioMap (no matching block):', extraInAudioMap);
} else {
  console.log('✅ No extra audioMap entries');
}
