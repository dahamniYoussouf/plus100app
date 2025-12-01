#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_file(file_path):
    """Fix buttons in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Check if file has 'use client'
        if "'use client'" not in content:
            return False
        
        # Add Modal import if not present
        if "import Modal from '@/components/Modal'" not in content:
            # Find the last import line
            import_pattern = r"(import\s+.*from\s+['\"]lucide-react['\"])"
            match = re.search(import_pattern, content)
            if match:
                content = content[:match.end()] + "\nimport Modal from '@/components/Modal'" + content[match.end():]
                modified = True
        
        # Find all buttons with "Ajouter" or "Nouveau" without onClick
        button_pattern = r'<button\s+className="[^"]*">\s*(?:Ajouter|Nouveau|Nouvelle)\s+[^<]*</button>'
        buttons = re.finditer(button_pattern, content, re.IGNORECASE)
        
        button_texts = []
        for button in buttons:
            button_text = button.group(0)
            # Check if it already has onClick
            if 'onClick' not in button_text:
                button_texts.append(button_text)
        
        if not button_texts:
            return False
        
        # Extract button names for state variables
        state_names = []
        for btn_text in button_texts:
            if 'Ajouter' in btn_text:
                match = re.search(r'Ajouter\s+(\w+)', btn_text, re.IGNORECASE)
                if match:
                    name = match.group(1).lower()
                    state_names.append(name)
            elif 'Nouveau' in btn_text or 'Nouvelle' in btn_text:
                match = re.search(r'Nouveau(?:lle)?\s+(\w+)', btn_text, re.IGNORECASE)
                if match:
                    name = match.group(1).lower()
                    state_names.append(name)
        
        # Add state declarations
        if state_names:
            unique_names = list(set(state_names))
            state_declarations = []
            for name in unique_names:
                capitalized = name.capitalize()
                state_declarations.append(f"  const [show{capitalized}Modal, setShow{capitalized}Modal] = useState(false)")
            
            # Find where to insert states (after activeTab state)
            state_insert_pattern = r"(const\s+\[activeTab,\s+setActiveTab\]\s*=\s*useState[^\n]*\n)"
            match = re.search(state_insert_pattern, content)
            if match:
                states_to_add = '\n' + '\n'.join(state_declarations) + '\n'
                content = content[:match.end()] + states_to_add + content[match.end():]
                modified = True
        
        # Add onClick to buttons
        for btn_text in button_texts:
            # Extract the button name
            if 'Ajouter' in btn_text:
                match = re.search(r'Ajouter\s+(\w+)', btn_text, re.IGNORECASE)
                if match:
                    name = match.group(1).capitalize()
                else:
                    name = 'Item'
            elif 'Nouveau' in btn_text or 'Nouvelle' in btn_text:
                match = re.search(r'Nouveau(?:lle)?\s+(\w+)', btn_text, re.IGNORECASE)
                if match:
                    name = match.group(1).capitalize()
                else:
                    name = 'Item'
            else:
                name = 'Item'
            
            # Replace button with onClick
            new_button = btn_text.replace(
                r'<button\s+className="([^"]*)"',
                f'<button\n                onClick={() => setShow{name}Modal(true)}\n                className="\\1"'
            )
            content = content.replace(btn_text, new_button)
            modified = True
        
        # Add modals at the end
        if state_names:
            unique_names = list(set(state_names))
            modals_html = []
            for name in unique_names:
                capitalized = name.capitalize()
                modal = f'''      <Modal
        isOpen={{show{capitalized}Modal}}
        onClose={{() => setShow{capitalized}Modal(false)}}
        title="{capitalized}"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Fonctionnalité en cours de développement.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={{() => setShow{capitalized}Modal(false)}}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>'''
                modals_html.append(modal)
            
            # Find the closing tags before the final }
            closing_pattern = r'(\s+</main>\s+</div>\s+\)\s+})'
            match = re.search(closing_pattern, content)
            if match:
                modals = '\n\n      {/* Modals */}\n' + '\n'.join(modals_html) + '\n'
                content = content[:match.start()] + modals + content[match.start():]
                modified = True
        
        if modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

# Find all page.tsx files
app_dir = Path('app')
page_files = list(app_dir.rglob('page.tsx'))

print(f"Found {len(page_files)} page.tsx files")
print("Fixing buttons...\n")

fixed_count = 0
for file_path in page_files:
    if fix_file(file_path):
        print(f"✓ Fixed: {file_path}")
        fixed_count += 1

print(f"\nDone! Fixed {fixed_count} files.")

