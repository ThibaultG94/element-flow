import React, { useState, useEffect } from "react";
import ElementCard from "../components/ElementCard";
import NarrativeElementModal from "../components/NarrativeElementModal";
import "../styles/animations.css";

const pythonCategories = [
  { id: "basics", name: "Fondamentaux" },
  { id: "types", name: "Types & Structures" },
  { id: "flow", name: "Flux de contrôle" },
  { id: "functions", name: "Fonctions" },
  { id: "oop", name: "Programmation Objet" },
  { id: "modules", name: "Modules & Paquets" },
  { id: "advanced", name: "Concepts Avancés" },
];

const PythonPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [pythonElements, setPythonElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Load Python elements on page load
  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        // Data retrieval from JSON file
        const response = await fetch("/data/python-elements.json");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Convert object to array with identifiers included
        const elementsArray = Object.entries(data).map(([id, element]) => ({
          ...element,
          id,
        }));

        setPythonElements(elementsArray);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments Python:", error);
        // Backup data in case of error
        setPythonElements([
          {
            id: "variables",
            name: "Variables",
            description: "Stockage et manipulation de données",
            category: "basics",
          },
          {
            id: "fonctions",
            name: "Fonctions",
            description: "Définition et appel de fonctions",
            category: "functions",
          },
          {
            id: "classes",
            name: "Classes",
            description: "Création de classes et d'objets",
            category: "oop",
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
      ? pythonElements
      : pythonElements.filter((element) => element.category === activeCategory);

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
          Python
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez les concepts fondamentaux de Python avec des exemples
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

          {pythonCategories.map((category) => (
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
      ) : pythonElements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aucune donnée d'élément Python disponible. Veuillez créer le fichier
            JSON ou connecter l'API.
          </p>

          {/* Demo button for a Python element */}
          <button
            onClick={() => {
              // Simulate an element for the demo
              setCurrentElementId("variables");
              setModalIsOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
          >
            Voir démonstration des variables Python
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
                pythonCategories.find((cat) => cat.id === element.category)
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
        dataType="python"
      />
    </div>
  );
};

export default PythonPage;
