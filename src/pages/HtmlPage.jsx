import React, { useState } from "react";
import { Link } from "react-router";

// Temporary data - to be replaced by API calls to Strapi
const htmlCategories = [
  { id: "structure", name: "Structure" },
  { id: "text", name: "Texte" },
  { id: "form", name: "Formulaires" },
  { id: "table", name: "Tableaux" },
  { id: "embed", name: "Contenu embarqué" },
  { id: "semantic", name: "Sémantique" },
];

const htmlElements = [
  {
    id: "doctype",
    name: "<!DOCTYPE>",
    category: "structure",
    description: "Définit le type de document",
  },
  {
    id: "html",
    name: "<html>",
    category: "structure",
    description: "Élément racine du document",
  },
  {
    id: "head",
    name: "<head>",
    category: "structure",
    description: "Contient les métadonnées du document",
  },
  {
    id: "body",
    name: "<body>",
    category: "structure",
    description: "Contient le contenu visible du document",
  },
  {
    id: "header",
    name: "<header>",
    category: "semantic",
    description: "En-tête de section ou de page",
  },
  {
    id: "footer",
    name: "<footer>",
    category: "semantic",
    description: "Pied de page ou de section",
  },
  {
    id: "main",
    name: "<main>",
    category: "semantic",
    description: "Contenu principal du document",
  },
  {
    id: "h1",
    name: "<h1>",
    category: "text",
    description: "Titre de niveau 1",
  },
  {
    id: "p",
    name: "<p>",
    category: "text",
    description: "Paragraphe de texte",
  },
  { id: "a", name: "<a>", category: "text", description: "Lien hypertexte" },
  { id: "img", name: "<img>", category: "embed", description: "Image" },
  {
    id: "video",
    name: "<video>",
    category: "embed",
    description: "Contenu vidéo",
  },
  {
    id: "form",
    name: "<form>",
    category: "form",
    description: "Formulaire interactif",
  },
  {
    id: "input",
    name: "<input>",
    category: "form",
    description: "Champ de saisie",
  },
  {
    id: "button",
    name: "<button>",
    category: "form",
    description: "Bouton cliquable",
  },
  {
    id: "table",
    name: "<table>",
    category: "table",
    description: "Tableau de données",
  },
  {
    id: "tr",
    name: "<tr>",
    category: "table",
    description: "Ligne de tableau",
  },
  {
    id: "td",
    name: "<td>",
    category: "table",
    description: "Cellule de tableau",
  },
];

const HtmlPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? htmlElements
      : htmlElements.filter((element) => element.category === activeCategory);

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Éléments HTML
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez tous les éléments HTML avec des exemples et des explications
          interactives.
        </p>
      </div>

      {/* Filters by category */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            Tous
          </button>

          {htmlCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
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
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all bg-white dark:bg-gray-800"
          >
            <h3 className="font-mono text-lg font-medium text-gray-900 dark:text-white mb-1">
              {element.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {element.description}
            </p>
            <div className="text-xs font-medium px-2.5 py-0.5 inline-block rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {htmlCategories.find((cat) => cat.id === element.category)
                ?.name || element.category}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HtmlPage;
