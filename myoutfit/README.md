# MyOutfit — Dressing intelligent

Application web mobile-first permettant de digitaliser son dressing et de générer des tenues automatiquement.

## Stack technique

- **Frontend** : Vue 3 + Vite + Tailwind CSS
- **Backend/BDD/Auth/Storage** : Supabase
- **Déploiement** : Vercel (frontend) + Supabase (BDD)

---

## Installation

### 1. Cloner et installer les dépendances

```bash
cd myoutfit
npm install
```

### 2. Configurer Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Dans l'éditeur SQL de Supabase, exécute le fichier `../supabase-setup.sql`
3. Dans Supabase > Storage, vérifie que le bucket `clothes` est bien créé et public

### 3. Variables d'environnement

```bash
cp .env.example .env
```

Remplis les valeurs depuis : Supabase > Settings > API

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Lancer en développement

```bash
npm run dev
```

---

## Structure des fichiers

```
src/
├── lib/
│   ├── supabase.js       # Client Supabase
│   └── constants.js      # Catégories, styles, saisons, couleurs
├── router/
│   └── index.js          # Routes + guards d'authentification
├── stores/
│   ├── auth.js           # Auth (login, register, logout)
│   ├── clothes.js        # CRUD vêtements + upload photo
│   └── outfits.js        # Tenues sauvegardées + algorithme de génération
├── components/
│   ├── BottomNav.vue     # Navigation mobile bas de page
│   ├── ClothingCard.vue  # Carte vêtement (grille)
│   └── OutfitCard.vue    # Carte tenue sauvegardée
└── views/
    ├── auth/
    │   ├── LoginView.vue
    │   ├── RegisterView.vue
    │   └── ForgotPasswordView.vue
    ├── DashboardView.vue
    ├── WardrobeView.vue
    ├── AddClothingView.vue
    ├── EditClothingView.vue
    ├── GenerateOutfitView.vue
    └── SavedOutfitsView.vue
```

---

## Algorithme de génération

Fonction `generateOutfits()` dans `src/stores/outfits.js` :

1. Filtre les vêtements `is_active = true`
2. Applique les filtres style / saison / formalité
3. Compose : 1 haut + 1 bas + 1 chaussures + 1 couche optionnelle
4. Génère jusqu'à 3 variantes

**Rôles par catégorie :**

| Catégorie | Rôle |
|-----------|------|
| t-shirt, chemise, pull | top |
| pantalon, jean, short | bottom |
| chaussures | shoes |
| veste, pull | layer |
| accessoire | accessory |

---

## Ajouter/modifier catégories et styles

Tout est centralisé dans `src/lib/constants.js`.

---

## Déploiement sur Vercel

```bash
npm run build
```

Connecte le repo GitHub à Vercel et ajoute les variables d'environnement dans les settings Vercel.
