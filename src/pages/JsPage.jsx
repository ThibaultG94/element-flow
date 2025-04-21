import React, { useState, useEffect } from "react";
import ElementCard from "../components/ElementCard";
import NarrativeElementModal from "../components/NarrativeElementModal";
import "../styles/animations.css";

const jsCategories = [
  { id: "basics", name: "Fondamentaux" },
  { id: "dom", name: "Manipulation du DOM" },
  { id: "events", name: "Événements" },
  { id: "arrays", name: "Tableaux" },
  { id: "objects", name: "Objets" },
  { id: "async", name: "Asynchrone" },
  { id: "api", name: "API Web" },
];

const JsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [jsElements, setJsElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Load JS elements on page load
  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        // Fetch data from JSON file
        const response = await fetch("/data/js-elements.json");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        // Convert object to array with ID included
        const elementsArray = Object.entries(data).map(([id, element]) => ({
          ...element,
          id,
        }));

        setJsElements(elementsArray);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des éléments JavaScript:",
          error
        );
        // Fallback: use minimal data for demo
        setJsElements([
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
            id: "querySelector",
            name: "querySelector()",
            category: "dom",
            description: "Sélectionne un élément du DOM",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, []);

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? jsElements
      : jsElements.filter((element) => element.category === activeCategory);

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

      {/* Loading status */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
      ) : jsElements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aucune donnée d'élément JavaScript disponible. Veuillez créer le
            fichier JSON ou connecter l'API.
          </p>

          {/* Demo button for JS element */}
          <button
            onClick={() => {
              // Simulate an element for the demo
              setCurrentElementId("variables");
              setModalIsOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
          >
            Voir démonstration narrative de Variables
          </button>
        </div>
      ) : (
        // Element grid
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
      )}

      {/* Narrative modal for selected element */}
      <NarrativeElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        elementId={currentElementId}
        theme={isDarkMode ? "dark" : "light"}
        dataType={"js"}
      />
    </div>
  );
};

export default JsPage;
