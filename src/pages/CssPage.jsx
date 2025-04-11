import React, { useState } from "react";
import ElementCard from "../components/ElementCard";
import ElementModal from "../components/ElementModal";

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
    attributes: [
      { name: "block", description: "Affiche l'élément comme un bloc" },
      { name: "inline", description: "Affiche l'élément en ligne" },
      { name: "flex", description: "Définit un conteneur flexible" },
      { name: "grid", description: "Définit un conteneur en grille" },
      { name: "none", description: "Masque l'élément" },
    ],
    syntax: "display: flex;",
    examples: [
      { title: "Affichage en bloc", code: ".element { display: block; }" },
      { title: "Affichage flexible", code: ".container { display: flex; }" },
    ],
    related: ["flex", "grid", "position"],
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
    attributes: [
      { name: "flex-grow", description: "Facteur de croissance" },
      { name: "flex-shrink", description: "Facteur de rétrécissement" },
      { name: "flex-basis", description: "Taille de base" },
    ],
    syntax: "flex: 1 0 auto;",
    examples: [
      { title: "Flexibilité égale", code: ".item { flex: 1; }" },
      {
        title: "Flexibilité personnalisée",
        code: ".item { flex: 2 0 300px; }",
      },
    ],
    related: ["display", "flex-direction", "flex-wrap"],
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

const CssPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Filter properties by selected category
  const filteredProperties =
    activeCategory === "all"
      ? cssProperties
      : cssProperties.filter((prop) => prop.category === activeCategory);

  const openPropertyModal = (property) => {
    setCurrentProperty(property);
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
          <CategoryButton
            category="Toutes"
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />

          {cssCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category.name}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <ElementCard
            key={property.id}
            element={property}
            openModal={openPropertyModal}
            categoryLabel={
              cssCategories.find((cat) => cat.id === property.category)?.name ||
              property.category
            }
          />
        ))}
      </div>

      {/* Modal for the selected property */}
      <ElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        element={currentProperty}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default CssPage;
