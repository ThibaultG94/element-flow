import React, { useState, useEffect } from "react";
import ElementCard from "../components/ElementCard";
import AnimatedElementModal from "../components/AnimatedElementModal";
import ElementService from "../services/ElementService";
import "../styles/animations.css";

// HTML categories (to be kept local for the time being)
const htmlCategories = [
  { id: "structure", name: "Structure" },
  { id: "text", name: "Texte" },
  { id: "form", name: "Formulaires" },
  { id: "table", name: "Tableaux" },
  { id: "embed", name: "Contenu embarqué" },
  { id: "semantic", name: "Sémantique" },
];

const HtmlPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = document.documentElement.classList.contains("dark");

  // Load HTML elements on page load
  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true);
        const data = await ElementService.getAllElements("html");
        setElements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments HTML:", error);
        // Fallback: use temporary local data
        setElements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, []);

  // Filter items by selected category
  const filteredElements =
    activeCategory === "all"
      ? elements
      : elements.filter((element) => element.category === activeCategory);

  const openElementModal = (element) => {
    setCurrentElementId(element.id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentElementId(null);
  };

  return (
    <div className="pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Éléments HTML
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez tous les éléments HTML avec des explications interactives et
          des animations séquentielles.
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

      {/* Loading status */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : elements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            Aucune donnée d'élément disponible. Veuillez créer le fichier JSON
            ou connecter l'API.
          </p>

          {/* Demo button for HTML element */}
          <button
            onClick={() => {
              // Simulate an element for the demo
              setCurrentElementId("html");
              setModalIsOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voir démo de l'élément &lt;html&gt;
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
              colorType="blue"
              categoryLabel={
                htmlCategories.find((cat) => cat.id === element.category)
                  ?.name || element.category
              }
            />
          ))}
        </div>
      )}

      {/* Animated modal for selected element */}
      <AnimatedElementModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        elementId={currentElementId}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default HtmlPage;
