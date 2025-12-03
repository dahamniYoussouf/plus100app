# Configuration de la Recherche d'Emploi Réelle

L'agent interne peut maintenant rechercher des **offres d'emploi réelles** via plusieurs APIs. Voici comment configurer :

## 📋 Sources Disponibles

### 1. JSearch API (RapidAPI) - Recommandé
- **Gratuit** : 50 requêtes/jour
- **Source** : Multiple sites d'emploi (Indeed, LinkedIn, Glassdoor, etc.)
- **Inscription** : https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

**Configuration :**
1. Créer un compte sur RapidAPI
2. S'abonner à JSearch API (plan gratuit disponible)
3. Copier votre clé API
4. Ajouter dans `.env.local` : `RAPIDAPI_KEY=votre_cle_ici`

### 2. Adzuna API
- **Gratuit** : 5000 requêtes/mois
- **Source** : Base de données d'offres d'emploi
- **Inscription** : https://developer.adzuna.com/

**Configuration :**
1. Créer un compte sur Adzuna Developer
2. Créer une application pour obtenir App ID et App Key
3. Ajouter dans `.env.local` :
   ```
   ADZUNA_APP_ID=votre_app_id
   ADZUNA_APP_KEY=votre_app_key
   ```

### 3. SerpAPI (Google Jobs)
- **Gratuit** : 100 recherches/mois
- **Source** : Google Jobs
- **Inscription** : https://serpapi.com/google-jobs-api

**Configuration :**
1. Créer un compte sur SerpAPI
2. Obtenir votre clé API
3. Ajouter dans `.env.local` : `SERPAPI_KEY=votre_cle_ici`

## 🚀 Installation Rapide

1. **Créer le fichier `.env.local`** à la racine du projet :
```env
# Au moins une clé API est nécessaire pour la recherche réelle
RAPIDAPI_KEY=votre_cle_rapidapi
# OU
ADZUNA_APP_ID=votre_app_id
ADZUNA_APP_KEY=votre_app_key
# OU
SERPAPI_KEY=votre_cle_serpapi
```

2. **Redémarrer le serveur de développement** :
```bash
npm run dev
```

## 💡 Utilisation

### Dans l'Agent Interne

1. **Recherche simple** :
   - Cliquez sur "Rechercher Offres"
   - Ou tapez : "recherche offres"

2. **Recherche avec mots-clés** :
   - Tapez : "recherche offres développeur react"
   - Ou : "recherche offres salesforce remote"

3. **Recherche avec localisation** :
   - L'agent détecte automatiquement la localisation
   - Ou précisez : "recherche offres développeur France"

### Commandes Disponibles

- `recherche offres` - Recherche toutes les offres pertinentes
- `recherche offres [mots-clés]` - Recherche avec mots-clés
- `postuler` - Postule à toutes les offres trouvées
- `candidatures` - Affiche le suivi des candidatures

## 🔍 Comment ça fonctionne

1. **Recherche Multi-Sources** :
   - L'API route essaie toutes les sources configurées
   - Combine les résultats de toutes les sources
   - Déduplique les offres identiques
   - Trie par pertinence (match score)

2. **Fallback Automatique** :
   - Si aucune clé API n'est configurée, utilise des offres de démonstration
   - Si une API échoue, utilise les autres sources
   - Toujours des résultats disponibles

3. **Calcul de Pertinence** :
   - Analyse les compétences requises
   - Compare avec votre profil (Agentforce, Salesforce, WordPress, React, etc.)
   - Score de match de 85% à 98%

## 🎯 Recommandation

Pour commencer rapidement, utilisez **JSearch API (RapidAPI)** :
- Gratuit et facile à configurer
- Accès à de nombreux sites d'emploi
- 50 requêtes/jour suffisent pour des tests

## 📊 Statistiques

L'agent affiche :
- Nombre d'offres trouvées
- Source de recherche (jsearch, adzuna, google, ou multi)
- Nombre de candidatures envoyées
- Statut de chaque candidature

## ⚠️ Notes Importantes

1. **Clés API** : Ne jamais commiter les clés API dans Git
2. **Limites** : Respecter les limites des APIs gratuites
3. **Cache** : Les résultats sont mis en cache 1 heure
4. **Fallback** : Toujours des offres disponibles même sans API

## 🔧 Dépannage

### Aucune offre trouvée
- Vérifiez que les clés API sont correctement configurées
- Vérifiez le fichier `.env.local` existe
- Redémarrez le serveur après ajout des clés

### Erreur API
- Vérifiez vos limites d'utilisation
- Vérifiez que les clés sont valides
- Le système utilisera automatiquement le fallback

### Offres de démonstration
- C'est normal si aucune clé API n'est configurée
- Configurez au moins une clé API pour des offres réelles

## 📝 Exemple de Configuration Complète

```env
# .env.local
RAPIDAPI_KEY=abc123def456...
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here
SERPAPI_KEY=your_serpapi_key_here
```

Plus vous configurez de sources, plus vous aurez d'offres !





