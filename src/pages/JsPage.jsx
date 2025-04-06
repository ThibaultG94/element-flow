import React, { useState } from "react";
import { Link } from "react-router";

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

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? jsElements
      : jsElements.filter((element) => element.category === activeCategory);

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
          <Link
            key={element.id}
            to={`/element/${element.id}`}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-yellow-400 dark:hover:border-yellow-500 hover:shadow-md transition-all bg-white dark:bg-gray-800"
          >
            <h3 className="font-mono text-lg font-medium text-gray-900 dark:text-white mb-1">
              {element.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {element.description}
            </p>
            <div className="text-xs font-medium px-2.5 py-0.5 inline-block rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              {jsCategories.find((cat) => cat.id === element.category)?.name ||
                element.category}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JsPage;
