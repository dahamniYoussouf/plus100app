/**
 * Script pour corriger les onClick mal placés par le script précédent
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

function fixMisplacedOnClick(content) {
  // Corriger les onClick mal placés dans les h2
  content = content.replace(
    /<h2\s+className="[^"]*"\s+onClick=\{\(\) => setShow\w+\(true\)\}\s+text-gray-900">/g,
    '<h2 className="text-xl sm:text-2xl font-bold text-gray-900">'
  );
  
  content = content.replace(
    /<h2\s+className=\s+onClick=\{\(\) => setShow\w+\(true\)\}\s+"[^"]*">/g,
    '<h2 className="text-xl sm:text-2xl font-bold text-gray-900">'
  );
  
  // Corriger les onClick mal placés avant les boutons
  content = content.replace(
    /\s+onClick=\{\(\) => setShow\w+\(true\)\}\s+<button\s+className="[^"]*">/g,
    (match) => {
      const onClickMatch = match.match(/onClick=\{\(\) => (setShow\w+)\(true\)\}/);
      if (onClickMatch) {
        const setter = onClickMatch[1];
        return `\n              <button \n                onClick={() => ${setter}(true)}\n                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"\n              >`;
      }
      return match;
    }
  );
  
  // S'assurer que les boutons ont bien onClick dans leurs attributs
  content = content.replace(
    /<button\s+className="w-full sm:w-auto[^"]*"\s*(?!onClick)/g,
    (match) => {
      // Si le bouton n'a pas onClick, on doit l'ajouter
      // Mais on ne peut pas le faire automatiquement sans connaître le modal
      return match;
    }
  );
  
  return content;
}

console.log('🔧 Correction des onClick mal placés...\n');
const pageFiles = findPageFiles(appDir);
let fixedCount = 0;

pageFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Vérifier s'il y a des onClick mal placés
  if (content.includes('onClick') && (content.includes('h2 className') || content.match(/\s+onClick.*<button/))) {
    const fixed = fixMisplacedOnClick(content);
    if (fixed !== content) {
      fs.writeFileSync(file, fixed, 'utf8');
      fixedCount++;
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      console.log(`✅ Corrigé: ${relativePath}`);
    }
  }
});

console.log(`\n📊 ${fixedCount} fichier(s) corrigé(s)`);


