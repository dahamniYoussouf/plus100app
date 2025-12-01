/**
 * Script final pour corriger tous les boutons restants
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const modalImport = "import Modal from '@/components/Modal'";

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

function findButtonsWithoutOnClick(content) {
  const buttonRegex = /<button\s+([^>]*?)>/g;
  const buttons = [];
  let match;
  
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = match[1];
    const buttonText = extractButtonText(content, match);
    
    // Ignorer les boutons qui ont déjà onClick
    if (attrs.includes('onClick')) continue;
    
    // Ignorer les boutons "Fermer" dans les modaux
    if (buttonText.toLowerCase().includes('fermer') || buttonText.toLowerCase().includes('close')) continue;
    
    // Ignorer les boutons dans les modaux déjà créés
    const beforeButton = content.substring(0, match.index);
    if (beforeButton.includes('Modal') && beforeButton.includes('isOpen')) continue;
    
    buttons.push({
      fullMatch: match[0],
      attrs: attrs,
      index: match.index,
      text: buttonText
    });
  }
  
  return buttons;
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
    .slice(0, 3) // Prendre les 3 premiers mots max
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return `show${cleaned}Modal`;
}

function addModalImportIfNeeded(content) {
  if (content.includes("import Modal")) {
    return content;
  }
  
  const useClientIndex = content.indexOf("'use client'");
  if (useClientIndex !== -1) {
    const nextLineIndex = content.indexOf('\n', useClientIndex) + 1;
    return content.slice(0, nextLineIndex) + modalImport + '\n' + content.slice(nextLineIndex);
  }
  
  const firstImport = content.match(/^import\s+.*$/m);
  if (firstImport) {
    return content.slice(0, firstImport.index) + modalImport + '\n' + content.slice(firstImport.index);
  }
  
  return modalImport + '\n' + content;
}

function addModalStates(content, modalNames) {
  const uniqueModals = [...new Set(modalNames)];
  if (uniqueModals.length === 0) return content;
  
  const statesCode = uniqueModals.map(name => {
    const setterName = `set${name.charAt(0).toUpperCase() + name.slice(1)}`;
    return `  const [${name}, ${setterName}] = useState(false)`;
  }).join('\n') + '\n';
  
  // Trouver où insérer (après les déclarations de state existantes ou après export default)
  const exportDefaultMatch = content.match(/export default function \w+\(\)\s*\{/);
  if (exportDefaultMatch) {
    const afterBrace = exportDefaultMatch.index + exportDefaultMatch[0].length;
    const nextLine = content.indexOf('\n', afterBrace) + 1;
    return content.slice(0, nextLine) + statesCode + content.slice(nextLine);
  }
  
  return content;
}

function addOnClickToButton(content, button, modalName) {
  const setterName = `set${modalName.charAt(0).toUpperCase() + modalName.slice(1)}`;
  const onClickAttr = `onClick={() => ${setterName}(true)}`;
  
  // Insérer onClick dans les attributs du bouton
  const buttonStart = button.index;
  const buttonEnd = buttonStart + button.fullMatch.length;
  
  // Trouver où insérer (après className si présent)
  let insertPos = buttonStart + '<button '.length;
  if (button.attrs.includes('className=')) {
    const classNameMatch = button.attrs.match(/className="[^"]*"/);
    if (classNameMatch) {
      insertPos = buttonStart + '<button '.length + classNameMatch.index + classNameMatch[0].length;
    }
  }
  
  return content.slice(0, insertPos) + ` ${onClickAttr} ` + content.slice(insertPos);
}

function addModalsToEnd(content, modalNames) {
  const uniqueModals = [...new Set(modalNames)];
  if (uniqueModals.length === 0) return content;
  
  // Trouver la fin du composant
  const lastBracePattern = /(\s+\)\s*\n\s*\})/;
  const lastMatch = content.match(lastBracePattern);
  
  if (!lastMatch) {
    // Essayer un autre pattern
    const altPattern = /(\s+\}\s*\n\s*\})/;
    const altMatch = content.match(altPattern);
    if (altMatch) {
      const insertPos = altMatch.index;
      const modalsCode = generateModalsCode(uniqueModals);
      return content.slice(0, insertPos) + modalsCode + '\n' + content.slice(insertPos);
    }
    return content;
  }
  
  const insertPos = lastMatch.index;
  const modalsCode = generateModalsCode(uniqueModals);
  return content.slice(0, insertPos) + modalsCode + '\n' + content.slice(insertPos);
}

function generateModalsCode(modalNames) {
  return '\n      {/* Modals */}\n' + modalNames.map(name => {
    const setterName = `set${name.charAt(0).toUpperCase() + name.slice(1)}`;
    const title = name.replace(/show|Modal/g, '').replace(/([A-Z])/g, ' $1').trim() || 'Nouvel élément';
    return `      <Modal
        isOpen={${name}}
        onClose={() => ${setterName}(false)}
        title="${title}"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Fonctionnalité en cours de développement.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => ${setterName}(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>`;
  }).join('\n\n');
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    const buttons = findButtonsWithoutOnClick(content);
    
    if (buttons.length === 0) {
      return { updated: false, reason: 'Aucun bouton à corriger' };
    }
    
    // Ajouter l'import Modal
    content = addModalImportIfNeeded(content);
    
    // Générer les noms de modaux
    const modalNames = buttons.map(b => generateModalName(b.text));
    
    // Ajouter les états
    content = addModalStates(content, modalNames);
    
    // Ajouter onClick aux boutons (dans l'ordre inverse pour éviter les problèmes d'index)
    buttons.sort((a, b) => b.index - a.index);
    buttons.forEach((button, i) => {
      content = addOnClickToButton(content, button, modalNames[i]);
    });
    
    // Ajouter les modaux
    content = addModalsToEnd(content, modalNames);
    
    // Écrire le fichier
    fs.writeFileSync(filePath, content, 'utf8');
    
    return { 
      updated: true, 
      buttonsCount: buttons.length,
      modalsAdded: [...new Set(modalNames)].length
    };
  } catch (error) {
    return { updated: false, reason: `Erreur: ${error.message}` };
  }
}

console.log('🚀 Correction finale des boutons restants...\n');
const pageFiles = findPageFiles(appDir);

let updatedCount = 0;
let totalButtons = 0;
let totalModals = 0;

pageFiles.forEach((file) => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  const result = processFile(file);
  
  if (result.updated) {
    updatedCount++;
    totalButtons += result.buttonsCount;
    totalModals += result.modalsAdded;
    console.log(`✅ ${relativePath}: ${result.buttonsCount} bouton(s), ${result.modalsAdded} modal(s)`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   - Pages mises à jour: ${updatedCount}`);
console.log(`   - Total boutons corrigés: ${totalButtons}`);
console.log(`   - Total modaux ajoutés: ${totalModals}`);
console.log(`\n✨ Correction terminée!`);

