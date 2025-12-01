# 📖 Guide d'Utilisation du Portfolio

## 🚀 Démarrage Rapide

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Lancement du Serveur de Développement
```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

### 3. Build pour la Production
```bash
npm run build
npm start
```

---

## 📁 Structure du Projet

```
potof/
├── app/                    # Dossier Next.js App Router
│   ├── globals.css         # Styles globaux Tailwind
│   ├── layout.tsx          # Layout principal avec metadata
│   └── page.tsx            # Page d'accueil qui assemble tous les composants
│
├── components/             # Tous les composants React
│   ├── Navigation.tsx      # Barre de navigation fixe
│   ├── Hero.tsx            # Section hero avec titre principal
│   ├── About.tsx           # Section "À propos"
│   ├── Experience.tsx      # Section expériences professionnelles
│   ├── Skills.tsx          # Section compétences techniques
│   └── Contact.tsx         # Section contact avec formulaire
│
├── DESIGN_EXPLANATION.md   # Explication détaillée du design
├── README.md               # Documentation générale
└── GUIDE_UTILISATION.md    # Ce fichier
```

---

## 🎨 Personnalisation Facile

### Modifier les Informations Personnelles

#### 1. Contact (components/Contact.tsx)
```tsx
// Ligne ~50-60, modifier :
href="mailto:your.email@example.com"  // Votre email
href="https://linkedin.com/in/yourprofile"  // Votre LinkedIn
href="https://github.com/yourusername"  // Votre GitHub
```

#### 2. Expériences (components/Experience.tsx)
```tsx
// Modifier l'array 'experiences' (lignes 8-70)
{
  title: 'Votre Titre',
  company: 'Nom de l\'entreprise',
  location: 'Ville, Pays',
  period: '2020 - 2023',
  description: [
    'Votre première réalisation',
    'Votre deuxième réalisation',
    // ... ajoutez plus
  ],
  technologies: ['Tech1', 'Tech2', 'Tech3'],
  color: 'from-blue-500 to-cyan-500',  // Couleur du gradient
  link: 'https://votre-site.com',  // Lien optionnel
}
```

#### 3. Compétences (components/Skills.tsx)
```tsx
// Modifier l'array 'skillCategories' (lignes 8-50)
{
  title: 'Votre Catégorie',
  skills: [
    { name: 'Compétence 1', level: 90, color: 'bg-blue-500' },
    { name: 'Compétence 2', level: 85, color: 'bg-green-500' },
    // ... ajoutez plus
  ],
}
```

#### 4. Section About (components/About.tsx)
```tsx
// Modifier le texte dans les balises <p> (lignes 33-50)
// Personnalisez votre description professionnelle
```

#### 5. Hero Section (components/Hero.tsx)
```tsx
// Ligne ~20-25, modifier le titre et la description
<h1>Votre Titre Professionnel</h1>
<p>Votre description personnalisée</p>
```

---

## 🎨 Personnalisation des Couleurs

### Modifier les Couleurs Globales (tailwind.config.ts)

```ts
// Lignes 8-20, modifier la palette 'primary'
colors: {
  primary: {
    500: '#0ea5e9',  // Couleur principale
    600: '#0284c7',  // Couleur hover
    // ... autres nuances
  },
}
```

### Modifier les Couleurs des Expériences

Dans `components/Experience.tsx`, chaque expérience a un `color` :
- `from-blue-500 to-cyan-500` → Bleu
- `from-purple-500 to-pink-500` → Violet
- `from-green-500 to-teal-500` → Vert
- `from-orange-500 to-red-500` → Orange

**Exemples de gradients Tailwind :**
- `from-indigo-500 to-purple-500` → Indigo vers violet
- `from-pink-500 to-rose-500` → Rose
- `from-yellow-500 to-orange-500` → Jaune vers orange
- `from-emerald-500 to-teal-500` → Émeraude

---

## 🖼️ Ajouter des Images

### 1. Créer un dossier public/
```bash
mkdir public
```

### 2. Ajouter vos images
```
public/
├── profile.jpg      # Votre photo de profil
├── project1.png     # Screenshot de projet
└── logo.svg         # Votre logo
```

### 3. Utiliser dans les composants
```tsx
import Image from 'next/image'

<Image 
  src="/profile.jpg" 
  alt="Photo de profil"
  width={200}
  height={200}
/>
```

---

## 📧 Configuration du Formulaire de Contact

### Option 1: EmailJS (Recommandé)
1. Créer un compte sur [EmailJS](https://www.emailjs.com/)
2. Configurer un service email
3. Ajouter dans `components/Contact.tsx` :

```tsx
import emailjs from '@emailjs/browser'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    formData,
    'YOUR_PUBLIC_KEY'
  )
}
```

### Option 2: API Route Next.js
Créer `app/api/contact/route.ts` pour gérer l'envoi d'emails.

---

## 🚀 Déploiement

### Vercel (Recommandé pour Next.js)
1. Pousser votre code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer votre repository
4. Vercel détecte automatiquement Next.js et déploie

### Netlify
1. Build : `npm run build`
2. Publish directory : `.next`
3. Déployer via Netlify CLI ou interface web

### Autres Options
- AWS Amplify
- Railway
- DigitalOcean App Platform

---

## 🐛 Résolution de Problèmes

### Erreur : "Module not found"
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port 3000 already in use"
```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

### Styles ne s'appliquent pas
```bash
# Vérifier que Tailwind est bien configuré
# Vérifier que globals.css est importé dans layout.tsx
```

### Animations ne fonctionnent pas
- Vérifier que Framer Motion est installé : `npm list framer-motion`
- Vérifier que les composants ont `'use client'` en haut

---

## 📚 Ressources Utiles

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Outils
- [Tailwind UI](https://tailwindui.com/) - Composants pré-construits
- [Heroicons](https://heroicons.com/) - Autres icônes
- [Coolors](https://coolors.co/) - Générateur de palettes

---

## ✅ Checklist de Personnalisation

- [ ] Modifier les informations de contact
- [ ] Mettre à jour les expériences professionnelles
- [ ] Ajuster les compétences et niveaux
- [ ] Personnaliser le texte "About"
- [ ] Ajouter votre photo de profil
- [ ] Modifier les couleurs si nécessaire
- [ ] Ajouter des liens vers vos projets
- [ ] Tester sur mobile et desktop
- [ ] Configurer le formulaire de contact
- [ ] Déployer en production

---

## 💡 Conseils

1. **Performance** : Les images doivent être optimisées (utilisez Next.js Image)
2. **SEO** : Modifiez les metadata dans `app/layout.tsx`
3. **Accessibilité** : Vérifiez les contrastes de couleurs
4. **Mobile First** : Testez toujours sur mobile en premier
5. **Backup** : Sauvegardez votre code régulièrement

---

## 🎯 Prochaines Étapes

1. ✅ Personnaliser le contenu
2. ✅ Ajouter vos projets avec images
3. ✅ Configurer le formulaire de contact
4. ✅ Optimiser les images
5. ✅ Déployer en production
6. ✅ Partager votre portfolio !

---

**Bon développement ! 🚀**





