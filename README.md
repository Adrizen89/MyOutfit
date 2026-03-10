# Mini cahier des charges — MVP application dressing intelligent

## 1. Contexte du projet

Le projet consiste à développer une application web/mobile first permettant à un utilisateur de digitaliser son dressing en ajoutant ses vêtements via photo, puis de générer automatiquement des idées de tenues selon un style défini.

L’objectif principal du MVP est simple :

- centraliser les vêtements d’un utilisateur
- les classer proprement
- permettre la génération rapide de tenues cohérentes
- réduire le temps passé à choisir une tenue au quotidien

Le MVP doit rester simple, rapide, visuel et gratuit à exploiter pour une phase de test.

---

# 2. Objectif du MVP

Le MVP doit permettre à un utilisateur de :

- créer un compte
- ajouter ses vêtements avec photo
- renseigner les informations principales du vêtement
- consulter son dressing numérique
- choisir un style de tenue
- obtenir automatiquement une ou plusieurs propositions de tenues

Le MVP ne doit pas inclure au départ :

- reconnaissance IA avancée du vêtement
- détourage automatique complexe
- météo
- recommandations d’achat
- essayage virtuel
- partage social
- gestion multi-utilisateurs avancée

---

# 3. Cible utilisateur

Utilisateur final type :

- homme ou femme souhaitant mieux organiser ses vêtements
- personne qui manque d’inspiration le matin
- personne voulant gagner du temps dans le choix de ses tenues

---

# 4. Périmètre fonctionnel

## 4.1 Authentification

L’utilisateur doit pouvoir :

- créer un compte avec email + mot de passe
- se connecter
- se déconnecter
- récupérer son mot de passe

---

## 4.2 Gestion du dressing

L’utilisateur doit pouvoir ajouter un vêtement avec les champs suivants :

- photo
- nom du vêtement
- catégorie
- couleur principale
- style principal
- saison
- niveau de formalité
- statut actif / inactif

### Catégories minimum

- t-shirt
- chemise
- pull
- veste
- pantalon
- jean
- short
- chaussures
- accessoire

### Styles minimum

- casual
- streetwear
- chic
- sport

### Saisons minimum

- printemps
- été
- automne
- hiver
- toutes saisons

### Formalité minimum

- décontracté
- intermédiaire
- habillé

L’utilisateur doit aussi pouvoir :

- modifier un vêtement
- supprimer un vêtement
- filtrer son dressing par catégorie / couleur / style
- visualiser ses vêtements sous forme de grille avec image

---

## 4.3 Génération de tenue

L’utilisateur doit pouvoir cliquer sur un bouton :

**"Générer une tenue"**

Puis choisir :

- un style souhaité
- éventuellement une saison
- éventuellement un niveau de formalité

L’application doit générer automatiquement au minimum :

- 1 haut
- 1 bas
- 1 paire de chaussures
- 1 couche supplémentaire optionnelle si disponible (veste / pull)

### Règles métier MVP

La génération doit suivre des règles simples :

- sélectionner uniquement des vêtements actifs
- respecter le style choisi si renseigné
- respecter la saison si renseignée
- éviter les combinaisons incohérentes de formalité
- proposer une tenue complète si les éléments nécessaires existent
- proposer jusqu’à 3 variantes si possible

La logique peut être basée sur des règles métier simples, sans IA dans un premier temps.

---

## 4.4 Sauvegarde des tenues

L’utilisateur doit pouvoir :

- enregistrer une tenue générée
- consulter ses tenues sauvegardées
- supprimer une tenue sauvegardée

---

# 5. Contraintes UX/UI

L’interface doit être :

- mobile first
- simple
- rapide à comprendre
- très visuelle
- moderne et sobre

### Écrans minimum à prévoir

- page de connexion / inscription
- dashboard / accueil
- page "Mon dressing"
- page "Ajouter un vêtement"
- page détail / édition d’un vêtement
- page "Générer une tenue"
- page résultats de tenue
- page "Tenues sauvegardées"

---

# 6. Contraintes techniques

Le MVP doit être conçu avec une logique **coût 0 au démarrage**.

### Stack recommandée

#### Frontend

- Vue 3
- Vite
- Tailwind CSS
- PWA si possible

#### Backend / BDD / Auth / Storage

- Supabase

#### Hébergement

- Vercel pour le frontend
- Supabase pour la BDD, l’auth et le stockage

#### Code source

- GitHub

Cette combinaison est cohérente avec une approche MVP gratuite.

En alternative pour les images, **Cloudinary** propose aussi un plan gratuit avec des limites d’usage.

---

# 7. Important sur la gratuité

Le développeur doit concevoir le MVP pour fonctionner **sans coût mensuel obligatoire au lancement**, mais en gardant en tête que :

- les services gratuits ont des quotas
- les limites peuvent évoluer avec le temps
- si le nombre d’utilisateurs ou de photos augmente fortement, un passage à une offre payante sera probablement nécessaire

---

# 8. Structure de données minimale

## Table `users`

- id
- email
- created_at

## Table `clothes`

- id
- user_id
- name
- category
- color
- style
- season
- formality
- image_url
- is_active
- created_at
- updated_at

## Table `outfits`

- id
- user_id
- name
- style
- season
- created_at

## Table `outfit_items`

- id
- outfit_id
- clothing_id
- role

---

# 9. Règles de génération MVP

Le développeur doit implémenter une logique simple de matching.

### Exemple de fonctionnement

Si l’utilisateur choisit :

- style = casual
- saison = été

L’algorithme doit chercher :

- un haut casual compatible été
- un bas casual compatible été
- une paire de chaussures casual compatible été
- éventuellement une veste légère si disponible

### Compatibilité minimale à gérer

- cohérence catégorie
- cohérence de style
- cohérence de saison
- cohérence de formalité

### Exemple de rôle par vêtement

- top
- bottom
- shoes
- layer
- accessory

---

# 10. Hors périmètre MVP

À ne pas développer dans la première version :

- IA de reconnaissance automatique avancée
- suppression automatique de fond
- scan automatique ultra précis
- suggestion selon météo
- calendrier de tenues
- suggestion d’achat e-commerce
- système social
- notifications push avancées
- multi-profils
- analytics poussées

---

# 11. Livrables attendus du développeur

Le développeur devra fournir :

- code source complet sur GitHub
- README d’installation
- accès à l’environnement de test
- base de données structurée
- version déployée du MVP
- documentation rapide des tables et endpoints
- procédure simple pour ajouter/modifier les catégories et styles

---

# 12. Critères d’acceptation

Le MVP sera considéré comme valide si :

- un utilisateur peut créer un compte et se connecter
- il peut ajouter au moins 20 vêtements avec photo
- il peut modifier et supprimer un vêtement
- il peut filtrer son dressing
- il peut générer une tenue selon un style
- il peut sauvegarder une tenue
- le projet est déployé et accessible en ligne
- l’exploitation du MVP ne nécessite aucun abonnement payant immédiat

---

# 13. Recommandation produit

Pour aller vite, je conseillerais au développeur de faire :

## Phase 1

- auth
- ajout vêtement
- affichage dressing

## Phase 2

- logique de génération de tenue
- sauvegarde des tenues

## Phase 3

- filtres
- amélioration UX
- PWA

---

# 14. Résumé ultra clair à transmettre au développeur

## But du MVP

Créer une web app simple permettant à un utilisateur de photographier ses vêtements, les ranger dans un dressing numérique, puis générer automatiquement des tenues selon un style choisi.

## Contraintes

- interface simple et mobile first
- hébergement gratuit au départ
- stockage photo gratuit au départ
- logique de tenue basée sur règles simples
- pas d’IA complexe dans la V1

## Stack souhaitée

- Vue 3 + Tailwind
- Supabase
- Vercel
- GitHub