import React, { useState } from "react";
import { Link } from "react-router";

// Temporary data - to be replaced by API calls to Strapi
const cssCategories = [
  { id: "layout", name: "Mise en page" },
  { id: "typography", name: "Typographie" },
  { id: "colors", name: "Couleurs" },
  { id: "backgrounds", name: "Arrière-plans" },
  { id: "borders", name: "Bordures" },
  { id: "effects", name: "Effets" },
  { id: "animations", name: "Animations" },
];

const cssProperties = [
  {
    id: "display",
    name: "display",
    category: "layout",
    description: "Définit le mode d'affichage d'un élément",
  },
  {
    id: "position",
    name: "position",
    category: "layout",
    description: "Spécifie la méthode de positionnement d'un élément",
  },
  {
    id: "flex",
    name: "flex",
    category: "layout",
    description: "Raccourci pour flex-grow, flex-shrink et flex-basis",
  },
  {
    id: "grid",
    name: "grid",
    category: "layout",
    description: "Définit un conteneur de grille",
  },
  {
    id: "margin",
    name: "margin",
    category: "layout",
    description: "Définit la marge extérieure d'un élément",
  },
  {
    id: "padding",
    name: "padding",
    category: "layout",
    description: "Définit la marge intérieure d'un élément",
  },
  {
    id: "width",
    name: "width",
    category: "layout",
    description: "Définit la largeur d'un élément",
  },
  {
    id: "height",
    name: "height",
    category: "layout",
    description: "Définit la hauteur d'un élément",
  },
  {
    id: "color",
    name: "color",
    category: "colors",
    description: "Définit la couleur du texte",
  },
  {
    id: "background-color",
    name: "background-color",
    category: "backgrounds",
    description: "Définit la couleur d'arrière-plan",
  },
  {
    id: "font-size",
    name: "font-size",
    category: "typography",
    description: "Définit la taille de la police",
  },
  {
    id: "font-weight",
    name: "font-weight",
    category: "typography",
    description: "Définit l'épaisseur de la police",
  },
  {
    id: "text-align",
    name: "text-align",
    category: "typography",
    description: "Définit l'alignement horizontal du texte",
  },
  {
    id: "border",
    name: "border",
    category: "borders",
    description: "Raccourci pour définir les bordures",
  },
  {
    id: "border-radius",
    name: "border-radius",
    category: "borders",
    description: "Définit le rayon des coins arrondis",
  },
  {
    id: "box-shadow",
    name: "box-shadow",
    category: "effects",
    description: "Ajoute des ombres à un élément",
  },
  {
    id: "opacity",
    name: "opacity",
    category: "effects",
    description: "Définit l'opacité d'un élément",
  },
  {
    id: "transition",
    name: "transition",
    category: "animations",
    description: "Permet d'animer les changements de propriétés",
  },
  {
    id: "animation",
    name: "animation",
    category: "animations",
    description: "Applique une animation",
  },
  {
    id: "transform",
    name: "transform",
    category: "effects",
    description: "Applique une transformation 2D ou 3D",
  },
];

const CssPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter properties by selected category
  const filteredProperties =
    activeCategory === "all"
      ? cssProperties
      : cssProperties.filter((prop) => prop.category === activeCategory);

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Propriétés CSS
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez toutes les propriétés CSS avec des exemples et des
          explications interactives.
        </p>
      </div>

      {/* Filters by category */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            Toutes
          </button>

          {cssCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <Link
            key={property.id}
            to={`/element/${property.id}`}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all bg-white dark:bg-gray-800"
          >
            <h3 className="font-mono text-lg font-medium text-gray-900 dark:text-white mb-1">
              {property.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {property.description}
            </p>
            <div className="text-xs font-medium px-2.5 py-0.5 inline-block rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              {cssCategories.find((cat) => cat.id === property.category)
                ?.name || property.category}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CssPage;
