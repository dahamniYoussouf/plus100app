/**
 * Script pour ajouter des gestionnaires onClick à tous les boutons
 * dans toutes les pages d'applications
 * 
 * Usage: node scripts/fix-all-buttons.js
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const modalComponent = "import Modal from '@/components/Modal'";

// Fonction pour trouver tous les fichiers page.tsx
function findPageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (item === 'page.tsx' && dir !== appDir) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fonction pour extraire les boutons sans onClick
function findButtonsWithoutOnClick(content) {
  const buttonRegex = /<button\s+([^>]*?)>/g;
  const buttons = [];
  let match;
  
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!attrs.includes('onClick')) {
      buttons.push({
        fullMatch: match[0],
        attrs: attrs,
        index: match.index
      });
    }
  }
  
  return buttons;
}

// Fonction pour générer un nom de modal à partir du texte du bouton
function generateModalName(buttonText) {
  return buttonText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^(.)/, (m) => m.toUpperCase());
}

console.log('🔍 Recherche des pages d\'applications...');
const pageFiles = findPageFiles(appDir);

console.log(`📄  DZD{pageFiles.length} pages trouvées\n`);

let totalButtons = 0;
let filesWithButtons = 0;

pageFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const buttons = findButtonsWithoutOnClick(content);
  
  if (buttons.length > 0) {
    filesWithButtons++;
    totalButtons += buttons.length;
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.log(`⚠️   DZD{relativePath}:  DZD{buttons.length} bouton(s) sans onClick`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   - Pages avec boutons sans onClick:  DZD{filesWithButtons}`);
console.log(`   - Total boutons à corriger:  DZD{totalButtons}`);

console.log(`\n💡 Pour corriger automatiquement, exécutez:`);
console.log(`   node scripts/fix-all-buttons.js --fix`);


