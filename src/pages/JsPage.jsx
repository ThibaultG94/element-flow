import React, { useState } from "react";
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
  },
  {
    id: "createElement",
    name: "createElement()",
    category: "dom",
    description: "Crée un nouvel élément HTML",
  },
  {
    id: "addEventListener",
    name: "addEventListener()",
    category: "events",
    description: "Ajoute un gestionnaire d'événement",
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
];

const CategoryButton = ({ category, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : isHovered
          ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
          : "bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {category}
    </button>
  );
};

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
          <CategoryButton
            category="Tous"
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />

          {jsCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category.name}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
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
