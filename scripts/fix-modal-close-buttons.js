/**
 * Script pour ajouter onClick à tous les boutons "Fermer" dans les modaux
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');

function findPageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('_') && item !== 'api') {
      files.push(...findPageFiles(fullPath));
    } else if (item === 'page.tsx' && dir !== appDir) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixCloseButtons(content) {
  // Trouver tous les boutons "Fermer" dans les modaux sans onClick
  const closeButtonRegex = /<button\s+([^>]*?)>\s*Fermer\s*<\/button>/g;
  const matches = [];
  let match;
  
  while ((match = closeButtonRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!attrs.includes('onClick')) {
      // Trouver le modal parent
      const beforeButton = content.substring(0, match.index);
      const modalMatch = beforeButton.match(/<Modal[^>]*isOpen=\{(\w+)\}[^>]*>/);
      
      if (modalMatch) {
        const modalState = modalMatch[1];
        const setterName = `set${modalState.charAt(0).toUpperCase() + modalState.slice(1)}`;
        
        matches.push({
          index: match.index,
          fullMatch: match[0],
          attrs: attrs,
          setter: setterName
        });
      }
    }
  }
  
  // Ajouter onClick aux boutons
  let newContent = content;
  let offset = 0;
  
  matches.sort((a, b) => b.index - a.index);
  
  matches.forEach(button => {
    const onClickAttr = `onClick={() => ${button.setter}(false)}`;
    const buttonStart = button.index + offset;
    let insertPos = buttonStart + '<button '.length;
    
    if (button.attrs.includes('className=')) {
      const classNameMatch = button.attrs.match(/className="[^"]*"/);
      if (classNameMatch) {
        insertPos = buttonStart + '<button '.length + classNameMatch.index + classNameMatch[0].length;
      }
    }
    
    newContent = newContent.slice(0, insertPos) + ` ${onClickAttr} ` + newContent.slice(insertPos);
    offset += onClickAttr.length + 3;
  });
  
  return newContent;
}

console.log('🔧 Correction des boutons "Fermer" dans les modaux...\n');
const pageFiles = findPageFiles(appDir);
let fixedCount = 0;

pageFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    content = fixCloseButtons(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      fixedCount++;
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      console.log(`✅ Corrigé: ${relativePath}`);
    }
  } catch (error) {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.log(`❌ Erreur dans ${relativePath}: ${error.message}`);
  }
});

console.log(`\n📊 ${fixedCount} fichier(s) corrigé(s)`);

