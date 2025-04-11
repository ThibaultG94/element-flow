import React, { useState } from "react";
import { Link } from "react-router";
import ElementCard from "../components/ElementCard";
import ElementModal from "../components/ElementModal";

// Temporary data - to be replaced by API calls to Strapi
const jsCategories = [
  { id: "basics", name: "Fondamentaux" },
  { id: "dom", name: "Manipulation du DOM" },
  { id: "events", name: "Événements" },
  { id: "arrays", name: "Tableaux" },
  { id: "objects", name: "Objets" },
  { id: "async", name: "Asynchrone" },
  { id: "api", name: "API Web" },
];

const jsElements = [
  {
    id: "variables",
    name: "Variables (let, const, var)",
    category: "basics",
    description: "Stockage de valeurs",
    attributes: [
      { name: "let", description: "Variable modifiable avec portée de bloc" },
      { name: "const", description: "Constante avec portée de bloc" },
      { name: "var", description: "Variable avec portée de fonction" },
    ],
    syntax: "let maVariable = 'valeur';",
    examples: [
      {
        title: "Déclaration de variables",
        code: "let compteur = 0;\nconst PI = 3.14159;\nvar ancienneVariable = 'texte';",
      },
    ],
    related: ["functions", "scope"],
  },
  {
    id: "functions",
    name: "Fonctions",
    category: "basics",
    description: "Blocs de code réutilisables",
  },
  {
    id: "conditionals",
    name: "Conditions (if, else)",
    category: "basics",
    description: "Exécution conditionnelle",
  },
  {
    id: "loops",
    name: "Boucles (for, while)",
    category: "basics",
    description: "Répétition d'instructions",
  },
  {
    id: "querySelector",
    name: "querySelector()",
    category: "dom",
    description: "Sélectionne un élément du DOM",
    attributes: [
      { name: "sélecteur", description: "Sélecteur CSS pour cibler l'élément" },
    ],
    syntax: "document.querySelector('.maClasse');",
    examples: [
      {
        title: "Sélection par ID",
        code: "const element = document.querySelector('#monId');",
      },
      {
        title: "Sélection par classe",
        code: "const element = document.querySelector('.maClasse');",
      },
    ],
    animations: [
      {
        title: "Comment sélectionner des éléments",
        steps: [
          {
            text: "Utilisez un sélecteur CSS pour cibler l'élément",
            codeHighlight: "querySelector",
            visualEffect: "highlight-selector",
          },
          {
            text: "Vous pouvez utiliser n'importe quel sélecteur CSS valide",
            codeHighlight: "'.maClasse'",
            visualEffect: "highlight-argument",
          },
          {
            text: "La méthode retourne le premier élément correspondant",
            codeHighlight: "const element =",
            visualEffect: "highlight-result",
          },
        ],
      },
    ],
    related: ["querySelectorAll", "getElementById"],
  },
  {
    id: "createElement",
    name: "createElement()",
    category: "dom",
    description: "Crée un nouvel élément HTML",
  },
  {
    id: "appendChild",
    name: "appendChild()",
    category: "dom",
    description: "Ajoute un nœud enfant",
  },
  {
    id: "addEventListener",
    name: "addEventListener()",
    category: "events",
    description: "Ajoute un gestionnaire d'événement",
  },
  {
    id: "removeEventListener",
    name: "removeEventListener()",
    category: "events",
    description: "Supprime un gestionnaire d'événement",
  },
  {
    id: "array-push",
    name: "push()",
    category: "arrays",
    description: "Ajoute un élément à la fin d'un tableau",
  },
  {
    id: "array-map",
    name: "map()",
    category: "arrays",
    description: "Transforme les éléments d'un tableau",
  },
  {
    id: "array-filter",
    name: "filter()",
    category: "arrays",
    description: "Filtre les éléments d'un tableau",
  },
  {
    id: "object-create",
    name: "Object.create()",
    category: "objects",
    description: "Crée un nouvel objet",
  },
  {
    id: "object-assign",
    name: "Object.assign()",
    category: "objects",
    description: "Copie les propriétés d'objets",
  },
  {
    id: "promises",
    name: "Promises",
    category: "async",
    description: "Gestion d'opérations asynchrones",
  },
  {
    id: "async-await",
    name: "async/await",
    category: "async",
    description: "Syntaxe pour le code asynchrone",
  },
  {
    id: "fetch",
    name: "fetch()",
    category: "api",
    description: "Requêtes HTTP",
  },
  {
    id: "localstorage",
    name: "localStorage",
    category: "api",
    description: "Stockage persistant côté client",
  },
];

const JsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? jsElements
      : jsElements.filter((element) => element.category === activeCategory);

  const openElementModal = (element) => {
    setCurrentElement(element);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          JavaScript
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez les fonctionnalités de JavaScript avec des exemples et des
          explications interactives.
        </p>
      </div>

      {/* Filters by category */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeCategory === "all"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            Tous
          </button>

          {jsCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Element grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredElements.map((element) => (
          <ElementCard
            key={element.id}
            element={element}
            openModal={openElementModal}
            categoryLabel={
              jsCategories.find((cat) => cat.id === element.category)?.name ||
              element.category
            }
          />
        ))}
      </div>

      {/* Modal for the selected property */}
      <ElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        element={currentElement}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default JsPage;
