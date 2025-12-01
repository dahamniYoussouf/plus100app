/**
 * Script pour corriger toutes les erreurs de syntaxe:
 * - DZD{ remplacé par ${
 * - onClick mal placés dans className
 * - text-wh onClick corrigé
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
    
    if (stat.isDirectory() && !item.startsWith('_')) {
      files.push(...findPageFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixSyntaxErrors(content) {
  let fixed = content;
  
  // Corriger DZD{ en ${
  fixed = fixed.replace(/DZD\{/g, '${');
  
  // Corriger onClick mal placés dans className
  fixed = fixed.replace(
    /className="([^"]*)\s+onClick=\{\(\) => [^}]+\}/g,
    (match, classNameContent) => {
      return `className="${classNameContent}"`;
    }
  );
  
  // Corriger text-wh onClick
  fixed = fixed.replace(
    /text-wh\s+onClick=\{\(\) => [^}]+\}\s+ite/g,
    'text-white'
  );
  
  // Corriger onClick avant className
  fixed = fixed.replace(
    /onClick=\{\(\) => [^}]+\}\s+className=/g,
    'className='
  );
  
  // Corriger onClick mal placés dans les balises (hors button)
  fixed = fixed.replace(
    /<(\w+)\s+([^>]*)\s+onClick=\{\(\) => [^}]+\}([^>]*)>/g,
    (match, tag, before, after) => {
      if (tag === 'button') return match; // Garder onClick dans les boutons
      return `<${tag} ${before}${after}>`;
    }
  );
  
  // Corriger onClick mal placés avant les balises
  fixed = fixed.replace(
    /\s+onClick=\{\(\) => [^}]+\}\s+<(\w+)/g,
    ' <$1'
  );
  
  // Corriger className= onClick
  fixed = fixed.replace(
    /className=\s+onClick=\{\(\) => [^}]+\}\s+"/g,
    'className="'
  );
  
  // Corriger les attributs mal formés avec onClick
  fixed = fixed.replace(
    /(\w+)\s+onClick=\{\(\) => [^}]+\}\s+(\w+)=/g,
    '$1 $2='
  );
  
  // Corriger les onClick dans les balises de fermeture
  fixed = fixed.replace(
    /onClick=\{\(\) => [^}]+\}\s*>/g,
    '>'
  );
  
  return fixed;
}

console.log('🔧 Correction de toutes les erreurs de syntaxe...\n');
const pageFiles = findPageFiles(appDir);
let fixedCount = 0;

pageFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Corriger les erreurs
    content = fixSyntaxErrors(content);
    
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


