# Mini cahier des charges — MVP 2 application dressing intelligent

## 1. Contexte

Le MVP 1 de l'application a permis de valider les fonctionnalités principales :

- création de compte
- ajout manuel de vêtements avec photo
- gestion d'un dressing numérique
- génération automatique de tenues selon un style
- sauvegarde des tenues

Le MVP 2 vise à améliorer l'expérience utilisateur et l'intelligence de l'application afin de rendre l'utilisation plus fluide et plus pertinente au quotidien.

Les objectifs principaux sont :

- réduire la friction lors de l'ajout des vêtements
- améliorer la qualité des tenues générées
- créer une utilisation quotidienne de l'application
- améliorer la présentation visuelle des tenues

---

# 2. Objectifs du MVP 2

Le MVP 2 doit permettre :

- d'ajouter des vêtements plus facilement grâce à une analyse automatique
- d'améliorer l'affichage visuel des vêtements
- de proposer des suggestions de tenues plus intelligentes
- de proposer des tenues adaptées au jour actuel

Le MVP 2 ne doit pas encore inclure :

- essayage virtuel
- recommandations d'achat
- fonctionnalités sociales
- marketplace
- intelligence artificielle avancée type styliste personnel

---

# 3. Nouvelles fonctionnalités

## 3.1 Analyse automatique des vêtements

Lorsqu'un utilisateur ajoute un vêtement via une photo, l'application doit analyser automatiquement l'image afin de proposer les informations suivantes :

- catégorie du vêtement
- couleur dominante
- type de vêtement

Exemple :

Photo ajoutée → l'application propose automatiquement :

- catégorie : chemise
- couleur : bleu
- type : haut

L'utilisateur doit pouvoir modifier les informations détectées avant validation.

L'objectif est de réduire la saisie manuelle.

---

## 3.2 Suppression automatique de l'arrière-plan

Lors de l'ajout d'une photo de vêtement, l'application doit automatiquement supprimer l'arrière-plan de l'image afin d'obtenir un rendu visuel propre.

Résultat attendu :

- vêtement isolé
- fond neutre ou transparent
- rendu similaire à une fiche produit e-commerce

Cela permettra d'améliorer la qualité visuelle lors de la génération des tenues.

---

## 3.3 Amélioration de l'algorithme de génération de tenue

L'algorithme de génération de tenues doit être amélioré afin de produire des combinaisons plus cohérentes.

Les nouvelles règles doivent inclure :

### Cohérence des couleurs

Certaines couleurs doivent être considérées comme compatibles.

Exemples :

- noir / blanc / gris
- beige / marron
- jean bleu / blanc

### Cohérence de style

Les vêtements sélectionnés doivent correspondre au style choisi.

Exemple :

Style casual :

- jean
- t-shirt
- sneakers

Style chic :

- chemise
- pantalon habillé
- chaussures habillées

### Cohérence de formalité

Éviter les combinaisons incohérentes :

- costume + chaussures sport
- sweat + mocassins habillés

---

## 3.4 Suggestions quotidiennes de tenues

L'application doit proposer automatiquement des suggestions de tenues pour la journée.

Sur l'écran d'accueil, l'utilisateur doit voir :

"Tenues proposées aujourd'hui"

L'application propose par exemple :

- Look casual
- Look travail
- Look détente

Chaque tenue doit être générée à partir des vêtements disponibles dans le dressing de l'utilisateur.

---

## 3.5 Amélioration visuelle des tenues

L'affichage des tenues doit être amélioré afin d'être plus visuel et plus compréhensible.

Chaque tenue doit afficher :

- le haut
- le bas
- les chaussures
- la couche supplémentaire si disponible (veste ou pull)

Les vêtements doivent être affichés avec leurs images détourées.

---

# 4. Améliorations UX/UI

L'interface doit évoluer afin d'améliorer l'expérience utilisateur.

Objectifs :

- simplifier l'ajout de vêtements
- rendre les tenues générées plus visuelles
- améliorer l'écran d'accueil

Améliorations prévues :

- ajout d'un écran "Tenues du jour"
- amélioration de la grille du dressing
- meilleure visualisation des vêtements dans les tenues

---

# 5. Contraintes techniques

Le MVP 2 doit rester compatible avec l'architecture mise en place lors du MVP 1.

Stack utilisée :

Frontend :

- Vue 3
- Vite
- Tailwind CSS

Backend / Base de données / Authentification / Storage :

- Supabase

Hébergement :

- Vercel

Code source :

- GitHub

Les nouvelles fonctionnalités doivent s'intégrer dans cette architecture existante.

---

# 6. Structure de données

La structure actuelle peut être conservée.

## Table users

- id
- email
- created_at

## Table clothes

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

## Table outfits

- id
- user_id
- name
- style
- season
- created_at

## Table outfit_items

- id
- outfit_id
- clothing_id
- role

---

# 7. Livrables attendus

Le développeur devra fournir :

- mise à jour du code source sur GitHub
- mise à jour de la base de données si nécessaire
- version déployée du MVP 2
- documentation des nouvelles fonctionnalités
- documentation des APIs ou services utilisés pour l'analyse d'image

---

# 8. Critères d'acceptation

Le MVP 2 sera considéré comme valide si :

- l'application peut analyser automatiquement un vêtement lors de l'ajout
- l'arrière-plan d'une image de vêtement est supprimé automatiquement
- les tenues générées sont plus cohérentes selon les règles définies
- l'application propose des suggestions de tenues quotidiennes
- l'affichage des tenues est amélioré et plus visuel

---

# 9. Résumé du MVP 2

Objectif principal :

Améliorer l'expérience utilisateur et la pertinence des tenues générées.

Principales évolutions :

- analyse automatique des vêtements
- suppression automatique du fond des images
- amélioration de l'algorithme de génération de tenues
- suggestions quotidiennes de tenues
- amélioration visuelle des looks