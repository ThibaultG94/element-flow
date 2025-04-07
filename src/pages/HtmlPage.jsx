import React, { useState } from "react";
import ElementCard from "../components/ElementCard";
import ElementModal from "../components/ElementModal";

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
    attributes: [
      { name: "disabled", description: "Désactive le bouton" },
      { name: "form", description: "Associe le bouton à un formulaire" },
      { name: "type", description: "Type du bouton (button, submit, reset)" },
    ],
    examples: [
      { title: "Bouton simple", code: "<button>Cliquez ici</button>" },
      {
        title: "Bouton de validation",
        code: '<button type="submit">Envoyer</button>',
      },
      {
        title: "Bouton désactivé",
        code: "<button disabled>Non disponible</button>",
      },
    ],
    animations: [
      {
        title: "Comment utiliser un bouton",
        steps: [
          {
            text: "Un bouton est interactif par défaut",
            codeHighlight: "<button>",
            visualEffect: "click-animation",
          },
          {
            text: "Vous pouvez définir le type du bouton",
            codeHighlight: 'type="submit"',
            visualEffect: "highlight-type",
          },
          {
            text: "Les boutons peuvent être désactivés",
            codeHighlight: "disabled",
            visualEffect: "disable-animation",
          },
        ],
      },
    ],
    related: ["input", "form", "a"],
    syntax: '<button type="button">Texte du bouton</button>',
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);

  // Sets the current theme
  const isDarkMode = document.documentElement.classList.contains("dark");

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? htmlElements
      : htmlElements.filter((element) => element.category === activeCategory);

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
          <ElementCard
            key={element.id}
            element={element}
            openModal={openElementModal}
            colorType="blue"
            categoryLabel={
              htmlCategories.find((cat) => cat.id === element.category)?.name ||
              element.category
            }
          />
        ))}
      </div>

      {/* Modal for selected element */}
      <ElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        element={currentElement}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default HtmlPage;
