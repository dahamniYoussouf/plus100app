# Guide: Ajouter des gestionnaires onClick à tous les boutons

## Pattern à suivre

Pour chaque page d'application, suivez ces étapes :

### 1. Importer le composant Modal
```tsx
import Modal from '@/components/Modal'
```

### 2. Ajouter les états pour les modaux
```tsx
const [showModalName, setShowModalName] = useState(false)
```

### 3. Ajouter onClick aux boutons
```tsx
<button 
  onClick={() => setShowModalName(true)}
  className="..."
>
  Texte du bouton
</button>
```

### 4. Ajouter les modaux à la fin du composant (avant le dernier `</div>`)
```tsx
<Modal
  isOpen={showModalName}
  onClose={() => setShowModalName(false)}
  title="Titre du modal"
  size="lg"
>
  <div className="space-y-4">
    <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setShowModalName(false)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
</Modal>
```

## Exemples de pages mises à jour

- ✅ `app/realestate/page.tsx` - Tous les boutons fonctionnent
- ✅ `app/spa/page.tsx` - Tous les boutons fonctionnent

## Pages restantes à mettre à jour

Toutes les autres pages dans `app/*/page.tsx` suivent le même pattern.

## Script de recherche

Pour trouver tous les boutons sans onClick :
```bash
grep -r "button className" app/ --include="*.tsx" | grep -v "onClick"
```

## Notes

- Tous les boutons doivent avoir un onClick handler
- Utiliser le composant Modal pour les actions de création/ajout
- Les modaux peuvent être améliorés plus tard avec des formulaires complets




