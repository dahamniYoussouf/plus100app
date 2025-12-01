/**
 * Script automatisé pour ajouter des gestionnaires onClick à tous les boutons
 * dans toutes les pages d'applications
 * 
 * Usage: node scripts/auto-fix-buttons.js
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const modalImport = "import Modal from '@/components/Modal'";

// Fonction pour trouver tous les fichiers page.tsx
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

// Fonction pour extraire le texte d'un bouton
function extractButtonText(content, buttonMatch) {
  const afterButton = content.substring(buttonMatch.index + buttonMatch[0].length);
  const textMatch = afterButton.match(/>\s*([^<]+)\s*</);
  return textMatch ? textMatch[1].trim() : 'Item';
}

// Fonction pour générer un nom de modal
function generateModalName(buttonText) {
  const cleaned = buttonText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return `show DZD{cleaned}Modal`;
}

// Fonction pour trouver les boutons sans onClick
function findButtonsWithoutOnClick(content) {
  const buttonRegex = /<button\s+([^>]*?)>/g;
  const buttons = [];
  let match;
  
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = match[1];
    // Ignorer les boutons qui ont déjà onClick ou qui sont dans des modals
    if (!attrs.includes('onClick') && !content.substring(0, match.index).includes('Modal')) {
      const buttonText = extractButtonText(content, match);
      const modalName = generateModalName(buttonText);
      
      buttons.push({
        fullMatch: match[0],
        attrs: attrs,
        index: match.index,
        text: buttonText,
        modalName: modalName
      });
    }
  }
  
  return buttons;
}

// Fonction pour ajouter l'import Modal si nécessaire
function addModalImport(content) {
  if (content.includes("import Modal")) {
    return content;
  }
  
  // Trouver la dernière ligne d'import
  const importRegex = /^import\s+.* DZD/gm;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertIndex = lastImportIndex + lastImport.length;
    return content.slice(0, insertIndex) + '\n' + modalImport + content.slice(insertIndex);
  }
  
  // Si pas d'import, ajouter après 'use client'
  const useClientIndex = content.indexOf("'use client'");
  if (useClientIndex !== -1) {
    const nextLineIndex = content.indexOf('\n', useClientIndex) + 1;
    return content.slice(0, nextLineIndex) + '\n' + modalImport + '\n' + content.slice(nextLineIndex);
  }
  
  return modalImport + '\n' + content;
}

// Fonction pour ajouter les états des modaux
function addModalStates(content, modalNames) {
  const uniqueModals = [...new Set(modalNames)];
  
  // Trouver le premier useState
  const useStateRegex = /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState/;
  const useStateMatch = content.match(useStateRegex);
  
  if (useStateMatch) {
    const insertIndex = useStateMatch.index;
    const statesCode = uniqueModals.map(name => 
      `  const [ DZD{name}, set DZD{name.charAt(0).toUpperCase() + name.slice(1)}] = useState(false)`
    ).join('\n') + '\n';
    
    // Trouver la ligne avant le premier useState
    const beforeState = content.substring(0, insertIndex);
    const lastNewline = beforeState.lastIndexOf('\n');
    return content.slice(0, lastNewline + 1) + statesCode + content.slice(lastNewline + 1);
  }
  
  // Si pas de useState, ajouter après les déclarations de state
  const exportDefaultMatch = content.match(/export default function \w+\(\)/);
  if (exportDefaultMatch) {
    const insertIndex = exportDefaultMatch.index;
    const statesCode = uniqueModals.map(name => 
      `  const [ DZD{name}, set DZD{name.charAt(0).toUpperCase() + name.slice(1)}] = useState(false)`
    ).join('\n') + '\n';
    
    const beforeFunc = content.substring(0, insertIndex);
    const lastNewline = beforeFunc.lastIndexOf('\n');
    return content.slice(0, lastNewline + 1) + statesCode + content.slice(lastNewline + 1);
  }
  
  return content;
}

// Fonction pour ajouter onClick aux boutons
function addOnClickToButtons(content, buttons) {
  let newContent = content;
  let offset = 0;
  
  // Trier par index décroissant pour éviter les problèmes d'offset
  buttons.sort((a, b) => b.index - a.index);
  
  for (const button of buttons) {
    const setterName = `set DZD{button.modalName.charAt(0).toUpperCase() + button.modalName.slice(1)}`;
    const onClickAttr = ` onClick={() =>  DZD{setterName}(true)}`;
    
    // Insérer onClick dans les attributs
    const buttonStart = button.index + offset;
    const buttonEnd = buttonStart + button.fullMatch.length;
    const attrs = button.attrs;
    
    // Trouver où insérer onClick (après className si présent, sinon au début)
    let insertPos = buttonStart + '<button '.length;
    if (attrs.includes('className=')) {
      const classNameEnd = attrs.indexOf('>', attrs.indexOf('className='));
      insertPos = buttonStart + '<button '.length + classNameEnd;
    }
    
    newContent = newContent.slice(0, insertPos) + onClickAttr + ' ' + newContent.slice(insertPos);
    offset += onClickAttr.length + 1;
  }
  
  return newContent;
}

// Fonction pour ajouter les modaux à la fin
function addModals(content, modalNames) {
  const uniqueModals = [...new Set(modalNames)];
  
  // Trouver la fin du composant (avant le dernier })
  const lastBraceIndex = content.lastIndexOf('  )\n}');
  if (lastBraceIndex === -1) {
    return content;
  }
  
  const modalsCode = '\n      {/* Modals */}\n' + uniqueModals.map(name => {
    const setterName = `set DZD{name.charAt(0).toUpperCase() + name.slice(1)}`;
    const title = name.replace(/show|Modal/g, '').replace(/([A-Z])/g, '  DZD1').trim();
    return `      <Modal
        isOpen={ DZD{name}}
        onClose={() =>  DZD{setterName}(false)}
        title=" DZD{title}"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Fonctionnalité en cours de développement.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>  DZD{setterName}(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>`;
  }).join('\n\n');
  
  return content.slice(0, lastBraceIndex) + modalsCode + '\n' + content.slice(lastBraceIndex);
}

// Fonction principale pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Ignorer les fichiers déjà traités ou qui n'ont pas de boutons
    if (content.includes('Modal from') && content.includes('onClick={() =>')) {
      return { updated: false, reason: 'Déjà traité' };
    }
    
    const buttons = findButtonsWithoutOnClick(content);
    
    if (buttons.length === 0) {
      return { updated: false, reason: 'Aucun bouton sans onClick' };
    }
    
    // Ajouter l'import Modal
    content = addModalImport(content);
    
    // Extraire les noms de modaux
    const modalNames = buttons.map(b => b.modalName);
    
    // Ajouter les états
    content = addModalStates(content, modalNames);
    
    // Ajouter onClick aux boutons
    content = addOnClickToButtons(content, buttons);
    
    // Ajouter les modaux
    content = addModals(content, modalNames);
    
    // Écrire le fichier
    fs.writeFileSync(filePath, content, 'utf8');
    
    return { 
      updated: true, 
      buttonsCount: buttons.length,
      modalsAdded: [...new Set(modalNames)].length
    };
  } catch (error) {
    return { updated: false, reason: `Erreur:  DZD{error.message}` };
  }
}

// Exécution principale
console.log('🚀 Démarrage de la correction automatique des boutons...\n');
const pageFiles = findPageFiles(appDir);

console.log(`📄  DZD{pageFiles.length} pages trouvées\n`);

let updatedCount = 0;
let totalButtons = 0;
let totalModals = 0;

pageFiles.forEach((file, index) => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  const result = processFile(file);
  
  if (result.updated) {
    updatedCount++;
    totalButtons += result.buttonsCount;
    totalModals += result.modalsAdded;
    console.log(`✅  DZD{relativePath}:  DZD{result.buttonsCount} bouton(s) corrigé(s),  DZD{result.modalsAdded} modal(s) ajouté(s)`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   - Pages mises à jour:  DZD{updatedCount}/ DZD{pageFiles.length}`);
console.log(`   - Total boutons corrigés:  DZD{totalButtons}`);
console.log(`   - Total modaux ajoutés:  DZD{totalModals}`);
console.log(`\n✨ Correction terminée!`);


