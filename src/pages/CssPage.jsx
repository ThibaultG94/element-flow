import React, { useState, useEffect } from "react";
import ElementCard from "../components/ElementCard";
import NarrativeElementModal from "../components/NarrativeElementModal";
import "../styles/animations.css";

const cssCategories = [
  { id: "layout", name: "Mise en page" },
  { id: "typography", name: "Typographie" },
  { id: "colors", name: "Couleurs" },
  { id: "backgrounds", name: "Arrière-plans" },
  { id: "borders", name: "Bordures" },
  { id: "effects", name: "Effets" },
  { id: "animations", name: "Animations" },
];

const CssPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [cssProperties, setCssProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Loading CSS properties on page load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Retrieving data from the JSON file
        const response = await fetch("/data/css-elements.json");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Convert object to array with identifiers included
        const propertiesArray = Object.entries(data).map(([id, property]) => ({
          ...property,
          id,
        }));

        setCssProperties(propertiesArray);
      } catch (error) {
        console.error("Erreur lors du chargement des propriétés CSS:", error);
        // Backup data in case of error
        setCssProperties([
          {
            id: "display",
            name: "display",
            category: "layout",
            description: "Définit le mode d'affichage d'un élément",
          },
          {
            id: "flex",
            name: "flex",
            category: "layout",
            description: "Raccourci pour flex-grow, flex-shrink et flex-basis",
          },
          {
            id: "color",
            name: "color",
            category: "colors",
            description: "Définit la couleur du texte",
          },
          {
            id: "border",
            name: "border",
            category: "borders",
            description: "Définit la bordure d'un élément",
          },
          {
            id: "font-size",
            name: "font-size",
            category: "typography",
            description: "Définit la taille du texte",
          },
          {
            id: "background-color",
            name: "background-color",
            category: "backgrounds",
            description: "Définit la couleur d'arrière-plan",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties by selected category
  const filteredProperties =
    activeCategory === "all"
      ? cssProperties
      : cssProperties.filter((prop) => prop.category === activeCategory);

  const openElementModal = (element) => {
    setCurrentElementId(element.id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      setCurrentElementId(null);
    }, 300);
  };

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

  return (
    <div className="pb-12 px-5">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Propriétés CSS
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez toutes les propriétés CSS avec des démonstrations visuelles
          et des animations interactives.
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

      {/* Loading status */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
      ) : cssProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aucune donnée de propriété disponible. Veuillez créer le fichier
            JSON ou connecter l'API.
          </p>

          {/* Demo button for a CSS property */}
          <button
            onClick={() => {
              // Simulate a property for the demo
              setCurrentElementId("display");
              setModalIsOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
          >
            Voir démonstration narrative de display
          </button>
        </div>
      ) : (
        // Property grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <ElementCard
              key={property.id}
              element={property}
              openModal={openElementModal}
              categoryLabel={
                cssCategories.find((cat) => cat.id === property.category)
                  ?.name || property.category
              }
            />
          ))}
        </div>
      )}

      {/* Modal narrative for the selected property */}
      <NarrativeElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        elementId={currentElementId}
        theme={isDarkMode ? "dark" : "light"}
        dataType={"css"}
      />
    </div>
  );
};

export default CssPage;
