/**
 * Script de nettoyage final pour corriger tous les onClick mal placés
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

function cleanMisplacedOnClick(content) {
  // Nettoyer les onClick mal placés dans les h2
  content = content.replace(
    /<h2\s+[^>]*onClick=\{\(\) => [^}]+\}[^>]*>/g,
    '<h2 className="text-xl sm:text-2xl font-bold text-gray-900">'
  );
  
  // Nettoyer les onClick mal placés avant les div
  content = content.replace(
    /\s+onClick=\{\(\) => [^}]+\}\s+<div/g,
    '<div'
  );
  
  // Nettoyer les onClick mal placés dans les attributs className
  content = content.replace(
    /className="[^"]*"\s+onClick=\{\(\) => [^}]+\}/g,
    (match) => {
      const classNameMatch = match.match(/className="[^"]*"/);
      return classNameMatch ? classNameMatch[0] : '';
    }
  );
  
  // Nettoyer les onClick mal placés dans les balises (hors button)
  content = content.replace(
    /<(\w+)\s+[^>]*onClick=\{\(\) => [^}]+\}[^>]*>/g,
    (match, tag) => {
      if (tag === 'button') return match; // Garder les onClick dans les boutons
      return match.replace(/\s+onClick=\{\(\) => [^}]+\}/g, '');
    }
  );
  
  // Nettoyer les onClick mal placés avant les balises
  content = content.replace(
    /\s+onClick=\{\(\) => [^}]+\}\s+<(\w+)/g,
    '<$1'
  );
  
  // Nettoyer les onClick dans les attributs className mal formés
  content = content.replace(
    /className=\s+onClick=\{\(\) => [^}]+\}\s+"[^"]*"/g,
    'className="text-xl sm:text-2xl font-bold text-gray-900"'
  );
  
  // Nettoyer les onClick dans les attributs mal formés
  content = content.replace(
    /(\w+)\s+onClick=\{\(\) => [^}]+\}\s+(\w+)=/g,
    '$1 $2='
  );
  
  // Nettoyer les onClick mal placés dans les Download className
  content = content.replace(
    /<Download\s+clas[^>]*onClick=\{\(\) => [^}]+\}[^>]*>/g,
    '<Download className="w-4 h-4" />'
  );
  
  // Nettoyer les onClick mal placés dans les Share2
  content = content.replace(
    /<Share2\s+[^>]*onClick=\{\(\) => [^}]+\}[^>]*>/g,
    '<Share2 className="w-4 h-4" />'
  );
  
  // Nettoyer les états dupliqués
  content = content.replace(
    /const\s+\[showModal,\s*setShowModal\]\s*=\s*useState\(false\)\s*\n\s*const\s+\[showModal,\s*setShowModal\]\s*=\s*useState\(false\)/g,
    'const [showModal, setShowModal] = useState(false)'
  );
  
  // Nettoyer les noms de modaux mal formés
  content = content.replace(
    /const\s+\[showSetshowmodalTrue\w+Modal,\s*setShowSetshowmodalTrue\w+Modal\]\s*=\s*useState\(false\)/g,
    ''
  );
  
  content = content.replace(
    /const\s+\[showTL\w+Modal,\s*setShowTL\w+Modal\]\s*=\s*useState\(false\)/g,
    ''
  );
  
  content = content.replace(
    /const\s+\[showNouveau\w+Modal,\s*setShowNouveau\w+Modal\]\s*=\s*useState\(false\)/g,
    ''
  );
  
  return content;
}

function fixRemainingButtons(content) {
  // Trouver les boutons sans onClick qui ne sont pas dans les modaux
  const buttonRegex = /<button\s+([^>]*?)>/g;
  const buttons = [];
  let match;
  
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!attrs.includes('onClick')) {
      const beforeButton = content.substring(0, match.index);
      // Ignorer les boutons dans les modaux
      if (!beforeButton.includes('Modal') || !beforeButton.includes('isOpen')) {
        buttons.push({
          fullMatch: match[0],
          attrs: attrs,
          index: match.index
        });
      }
    }
  }
  
  // Ajouter onClick aux boutons restants
  let newContent = content;
  let offset = 0;
  
  buttons.sort((a, b) => b.index - a.index);
  
  buttons.forEach(button => {
    const buttonText = extractButtonText(content, button);
    const modalName = generateModalName(buttonText);
    const setterName = `set${modalName.charAt(0).toUpperCase() + modalName.slice(1)}`;
    const onClickAttr = `onClick={() => ${setterName}(true)}`;
    
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

function extractButtonText(content, buttonMatch) {
  const afterButton = content.substring(buttonMatch.index + buttonMatch[0].length);
  const textMatch = afterButton.match(/>\s*([^<]+)\s*</);
  return textMatch ? textMatch[1].trim() : 'Item';
}

function generateModalName(buttonText) {
  const cleaned = buttonText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w.length > 0)
    .slice(0, 3)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return `show${cleaned}Modal`;
}

console.log('🧹 Nettoyage final des onClick mal placés...\n');
const pageFiles = findPageFiles(appDir);
let cleanedCount = 0;

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Nettoyer les onClick mal placés
  content = cleanMisplacedOnClick(content);
  
  // Corriger les boutons restants
  content = fixRemainingButtons(content);
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    cleanedCount++;
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.log(`✅ Nettoyé: ${relativePath}`);
  }
});

console.log(`\n📊 ${cleanedCount} fichier(s) nettoyé(s)`);


