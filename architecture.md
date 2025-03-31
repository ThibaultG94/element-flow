# ElementFlow - Architecture et spécifications techniques

## Vue d'ensemble

ElementFlow est une application éducative interactive qui présente les technologies web (HTML, CSS, JavaScript) d'une manière visuelle et animée, en se concentrant sur l'aspect démonstratif plutôt que textuel. L'application s'appuie sur trois piliers technologiques principaux :

1. **Frontend interactif** (React + Vite)
2. **CMS Headless** (Strapi)
3. **Intelligence artificielle** (Mistral AI)

## Architecture globale

### 1. Frontend (React + Vite)

Le frontend est développé en React avec Vite pour offrir une expérience utilisateur rapide et réactive. Il est responsable de :

- L'affichage des éléments web dans une interface navigable
- L'exécution des animations et démonstrations interactives
- La communication avec le middleware IA et le CMS Strapi

**Bibliothèques déjà installées (d'après package.json) :**

- React 19.0.0
- react-dom 19.0.0
- react-modal 3.16.3
- react-router 7.4.1
- react-syntax-highlighter 15.6.1
- tailwindcss 4.0.17

**Bibliothèques additionnelles recommandées :**

- framer-motion - Pour les animations fluides et séquentielles
- zustand - Pour une gestion d'état légère et efficace
- @tanstack/react-query - Pour la gestion des requêtes API
- axios - Pour les communications avec les API
- @codemirror/lang-html, @codemirror/lang-css, @codemirror/lang-javascript - Pour l'édition de code interactive

### 2. Backend avec Strapi (CMS Headless)

Strapi servira de système de gestion de contenu, offrant :

- Une interface d'administration pour ajouter et gérer le contenu
- Des modèles de données structurés pour les éléments HTML, CSS et JavaScript
- Des API REST/GraphQL automatiquement générées
- Des relations entre les différents éléments et concepts

Strapi est préféré à MongoDB pour sa facilité d'utilisation, son interface d'administration prête à l'emploi, et la possibilité de définir des modèles de contenu complexes sans avoir à coder la logique de base de données.

### 3. Middleware IA avec Mistral

Un service intermédiaire simple qui :

- Reçoit les requêtes de recherche du frontend
- Enrichit ces requêtes en utilisant l'API Mistral AI
- Interroge Strapi avec ces requêtes améliorées
- Renvoie les résultats enrichis au frontend

## Structures de données principales

### Élément HTML/CSS/JavaScript

```
{
  name: "button",                      // Nom de l'élément
  tag: "<button>",                     // Syntaxe
  category: "form-elements",           // Catégorie
  description: "...",                  // Description concise
  documentation: "...",                // Documentation complète
  attributes: [                        // Attributs associés
    {
      name: "disabled",
      description: "Désactive le bouton"
    }
  ],
  examples: [                          // Exemples d'utilisation
    {
      title: "Bouton simple",
      code: "<button>Cliquez ici</button>"
    }
  ],
  animations: [                        // Séquences d'animation
    {
      title: "Comment utiliser un bouton",
      steps: [
        {
          text: "Un bouton est interactif par défaut",
          codeHighlight: "<button>",
          visualEffect: "click-animation"
        }
      ]
    }
  ],
  relatedElements: ["form", "input"]   // Éléments connexes
}
```

## Fonctionnalités d'animation et d'interaction

L'aspect le plus distinctif d'ElementFlow est son approche "motion design" qui :

- **Minimise le texte** et maximise les démonstrations visuelles
- Décompose l'apprentissage en **étapes animées séquentielles**
- Permet une **navigation interactive** dans les animations (avancer/reculer)
- **Met en évidence** le code et son effet en temps réel
- Offre des **zones interactives** où l'utilisateur peut tester les concepts

Ces animations seront implémentées avec Framer Motion (à installer) qui permettra des transitions fluides entre les étapes d'explication.

## Intégration de Mistral AI

Contrairement à une base de données traditionnelle qui se limite à des requêtes exactes, l'intégration de Mistral AI permet :

1. **Recherche contextuelle** : comprendre l'intention derrière une requête
2. **Enrichissement sémantique** : identifier les concepts associés
3. **Génération d'exemples** : créer des exemples personnalisés à la demande
4. **Recommandations intelligentes** : suggérer des éléments connexes pertinents

Le middleware IA est simple mais puissant :

- Il reçoit une requête comme "comment centrer verticalement"
- Il l'analyse avec Mistral pour comprendre qu'il s'agit de CSS
- Il identifie les propriétés pertinentes (display, flex, align-items, etc.)
- Il interroge Strapi pour obtenir ces éléments
- Il renvoie des résultats structurés et contextualisés

## Approche de développement recommandée

### 1. Commencer par le Frontend

C'est l'approche que nous avons déjà adoptée avec le projet React+Vite initialisé. Les prochaines étapes seront :

- **Navigation principale** : tabs pour HTML/CSS/JS
- **Grille d'éléments** : affichage des éléments par catégorie
- **Composant modal** : pour l'affichage détaillé d'un élément
- **Système d'animation** : le cœur de l'application, avec les étapes interactives
- **Barre de recherche** : d'abord simple, puis "intelligente"

### 2. Ensuite, configurer Strapi

Une fois que nous avons une idée claire de nos besoins :

1. Définir les types de contenu (Collections Types)
2. Établir les relations entre eux
3. Créer quelques entrées pour tester l'API
4. Connecter le frontend à Strapi

### 3. Enfin, intégrer Mistral AI

Quand les bases fonctionnent :

1. Créer un simple service API pour le middleware
2. Configurer l'intégration avec Mistral
3. Améliorer progressivement les fonctionnalités de recherche

## Mise en œuvre du frontend

### Structure des dossiers (proposition)

```
src/
  ├── assets/              # Images, icônes, etc.
  ├── components/          # Composants réutilisables
  │   ├── common/          # Boutons, modales, etc.
  │   ├── elements/        # Cartes d'éléments, grille, etc.
  │   └── animations/      # Composants d'animation step-by-step
  ├── context/             # Contextes React (thème, état global)
  ├── hooks/               # Hooks personnalisés
  ├── layouts/             # Mise en page principale
  ├── pages/               # Pages principales (HTML, CSS, JS)
  ├── services/            # Services API (Strapi, Mistral)
  └── utils/               # Fonctions utilitaires
```

### Routes principales

- `/` - Page d'accueil avec présentation et accès aux catégories
- `/html` - Éléments HTML
- `/css` - Propriétés CSS
- `/javascript` - Fonctions et API JavaScript
- `/element/:id` - Page détaillée d'un élément spécifique

### Composants d'animation clés

- **StepByStepAnimation** - Pour les animations séquentielles
- **CodeHighlighter** - Pour mettre en évidence des parties de code
- **InteractivePreview** - Pour montrer le résultat du code en temps réel
- **AnimationControls** - Pour naviguer entre les étapes (play, pause, next, prev)

## Avantages de cette architecture

- **Modularité** : chaque partie peut évoluer indépendamment
- **Évolutivité** : facile d'ajouter de nouvelles technologies (React, Vue, etc.)
- **Maintenance** : séparation claire des responsabilités
- **Performance** : le CMS gère efficacement le contenu tandis que le frontend reste léger
- **Richesse fonctionnelle** : l'IA apporte une dimension unique au projet

Cette approche nous permet de créer rapidement un MVP fonctionnel, puis d'améliorer progressivement les fonctionnalités et le contenu.
