# 📸 Instructions pour Ajouter les Images

## 📁 Structure des Images

Créez les images suivantes dans le dossier `public/images/` :

```
public/
└── images/
    ├── levio.jpg          # Logo ou screenshot Levio
    ├── gama-outillage.jpg  # Screenshot du site Gama Outillage
    └── tawssil.jpg         # Screenshot de l'application Tawssil
```

## 🖼️ Comment Obtenir les Images

### 1. Gama Outillage
1. Visitez https://gamaoutillage.net/
2. Prenez une capture d'écran de la page d'accueil
3. Sauvegardez-la comme `gama-outillage.jpg` dans `public/images/`
4. Dimensions recommandées : 1200x600px ou plus

### 2. Tawssil
1. Visitez https://tawssillik.com/
2. Prenez une capture d'écran de l'interface
3. Sauvegardez-la comme `tawssil.jpg` dans `public/images/`
4. Dimensions recommandées : 1200x600px ou plus

### 3. Levio
1. Visitez https://levio.ca/
2. Prenez une capture d'écran ou téléchargez le logo
3. Sauvegardez-la comme `levio.jpg` dans `public/images/`
4. Dimensions recommandées : 1200x600px ou plus

## 🎨 Format et Taille

- **Format** : JPG ou PNG
- **Taille recommandée** : 1200x600px minimum
- **Poids** : < 500KB par image (optimisez avec TinyPNG ou similaire)
- **Qualité** : Haute résolution pour un rendu professionnel

## 🔧 Outils pour Optimiser

1. **TinyPNG** : https://tinypng.com/ - Compresse les images
2. **Squoosh** : https://squoosh.app/ - Optimiseur d'images Google
3. **Capture d'écran** : Utilisez l'outil de votre OS

## ✅ Vérification

Après avoir ajouté les images, vérifiez que :
- [ ] Les fichiers sont dans `public/images/`
- [ ] Les noms correspondent exactement (levio.jpg, gama-outillage.jpg, tawssil.jpg)
- [ ] Les images s'affichent correctement sur le site
- [ ] Les images sont optimisées (poids < 500KB)

## 🚀 Alternative : Utiliser des URLs Externes

Si vous préférez utiliser des images hébergées ailleurs, modifiez dans `components/Experience.tsx` :

```tsx
image: 'https://votre-domaine.com/image.jpg',  // Au lieu de '/images/...'
```

## 📝 Notes

- Les logos des entreprises sont chargés depuis leurs sites web officiels
- Si une image ne charge pas, un placeholder avec gradient s'affiche automatiquement
- Vous pouvez ajouter plus d'images pour chaque projet si nécessaire




