import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import ElementCard from "../components/ElementCard";
import NarrativeElementModal from "../components/NarrativeElementModal";
import "../styles/animations.css";

const reactCategories = [
  { id: "basics", name: "Fondamentaux" },
  { id: "hooks", name: "Hooks" },
  { id: "components", name: "Composants" },
  { id: "state", name: "État" },
  { id: "props", name: "Props" },
  { id: "lifecycle", name: "Cycle de vie" },
  { id: "events", name: "Événements" },
];

const ReactPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [reactElements, setReactElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Loading React elements on page load
  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        // Retrieving data from the JSON file
        const response = await fetch("/data/react-elements.json");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Convert object to array with identifiers included
        const elementsArray = Object.entries(data).map(([id, element]) => ({
          ...element,
          id,
        }));

        setReactElements(elementsArray);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments React:", error);
        // Backup data in case of error
        setReactElements([
          {
            id: "useState",
            name: "useState()",
            category: "hooks",
            description:
              "Hook pour ajouter un état local à un composant fonctionnel",
          },
          {
            id: "useEffect",
            name: "useEffect()",
            category: "hooks",
            description:
              "Hook pour gérer les effets secondaires dans les composants",
          },
          {
            id: "component",
            name: "Component",
            category: "components",
            description: "Classe de base pour créer des composants React",
          },
          {
            id: "jsx",
            name: "JSX",
            category: "basics",
            description:
              "Syntaxe d'extension JavaScript pour écrire du HTML dans React",
          },
          {
            id: "props",
            name: "Props",
            category: "props",
            description:
              "Mécanisme pour passer des données aux composants enfants",
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
      ? reactElements
      : reactElements.filter((element) => element.category === activeCategory);

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
          React
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez les concepts fondamentaux de React avec des exemples
          interactifs et des explications visuelles.
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

          {reactCategories.map((category) => (
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
      ) : reactElements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aucune donnée d'élément React disponible. Veuillez créer le fichier
            JSON ou connecter l'API.
          </p>

          {/* Demo button for a React element */}
          <button
            onClick={() => {
              // Simulate an element for the demo
              setCurrentElementId("useState");
              setModalIsOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
          >
            Voir démonstration du hook useState
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
                reactCategories.find((cat) => cat.id === element.category)
                  ?.name || element.category
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
        dataType="react"
      />
    </div>
  );
};

export default ReactPage;
