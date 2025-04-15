import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { searchElements } from "../utils/searchUtils";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allElements, setAllElements] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Load data from all elements
  useEffect(() => {
    const fetchAllElements = async () => {
      try {
        setIsLoading(true);

        // Loading data from JSON files
        const htmlResponse = await fetch("/data/html-elements.json");
        const cssResponse = await fetch("/data/css-elements.json");
        const jsResponse = await fetch("/data/js-elements.json");

        let elements = [];

        if (htmlResponse.ok) {
          const htmlData = await htmlResponse.json();
          const htmlElements = Object.entries(htmlData).map(
            ([id, element]) => ({
              ...element,
              id,
              type: "HTML",
              route: `/element/${id}`,
            })
          );
          elements = [...elements, ...htmlElements];
        }

        if (cssResponse.ok) {
          const cssData = await cssResponse.json();
          const cssElements = Object.entries(cssData).map(([id, element]) => ({
            ...element,
            id,
            type: "CSS",
            route: `/css/${id}`,
          }));
          elements = [...elements, ...cssElements];
        }

        if (jsResponse.ok) {
          const jsData = await jsResponse.json();
          const jsElements = Object.entries(jsData).map(([id, element]) => ({
            ...element,
            id,
            type: "JavaScript",
            route: `/javascript/${id}`,
          }));
          elements = [...elements, ...jsElements];
        }

        // Fallback if no JSON file found
        if (elements.length === 0) {
          elements = [
            {
              id: "html",
              name: "<html>",
              description:
                "L'élément racine qui contient tout le document HTML",
              type: "HTML",
              route: "/element/html",
            },
            {
              id: "body",
              name: "<body>",
              description: "Contient tout le contenu visible de la page web",
              type: "HTML",
              route: "/element/body",
            },
            {
              id: "head",
              name: "<head>",
              description:
                "Contient les métadonnées du document comme le titre, les liens CSS, etc.",
              type: "HTML",
              route: "/element/head",
            },
            {
              id: "display",
              name: "display",
              description: "Définit le mode d'affichage d'un élément",
              type: "CSS",
              route: "/css/display",
            },
            {
              id: "flex",
              name: "flex",
              description:
                "Raccourci pour flex-grow, flex-shrink et flex-basis",
              type: "CSS",
              route: "/css/flex",
            },
            {
              id: "variables",
              name: "Variables",
              description: "Stockage de valeurs",
              type: "JavaScript",
              route: "/javascript/variables",
            },
            {
              id: "querySelector",
              name: "querySelector()",
              description: "Sélectionne un élément du DOM",
              type: "JavaScript",
              route: "/javascript/querySelector",
            },
          ];
        }

        setAllElements(elements);
        setDataLoaded(true);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments:", error);
        // Fallback in case of error
        setAllElements([
          {
            id: "html",
            name: "<html>",
            description: "L'élément racine",
            type: "HTML",
            route: "/element/html",
          },
          {
            id: "body",
            name: "<body>",
            description: "Contenu visible",
            type: "HTML",
            route: "/element/body",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllElements();

    // Manager for clicks outside the search zone
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("elementflow-recent-searches");
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        setRecentSearches(parsedSearches);
      } catch (e) {
        console.error("Erreur lors du chargement des recherches récentes:", e);
      }
    }
  }, []);

  // Save a new search
  const saveRecentSearch = (query) => {
    if (!query.trim() || query.length < 3) return;

    const newSearches = [
      query,
      ...recentSearches.filter((s) => s !== query), // Avoiding duplication
    ].slice(0, 5); // Keep only the last 5 searches

    setRecentSearches(newSearches);
    localStorage.setItem(
      "elementflow-recent-searches",
      JSON.stringify(newSearches)
    );
  };

  // Perform the search each time the query changes
  useEffect(() => {
    if (!searchQuery.trim() || !dataLoaded) {
      setResults([]);
      return;
    }

    // Using the search utility
    const filteredResults = searchElements(allElements, searchQuery);
    setResults(filteredResults);
  }, [searchQuery, dataLoaded, allElements]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(!!query.trim());
  };

  const handleResultClick = (route) => {
    saveRecentSearch(searchQuery);
    setShowResults(false);
    setSearchQuery("");
    navigate(route);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      // Navigate to the first result
      handleResultClick(results[0].route);
    } else if (e.key === "Escape") {
      setShowResults(false);
    } else if (e.key === ":" && (e.metaKey || e.ctrlKey)) {
      // Shortcut for search focus (Cmd+/ or Ctrl+/)
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  // Add global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === ":" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Element type formatting with appropriate color
  const getTypeStyles = (type) => {
    switch (type) {
      case "HTML":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "CSS":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "JavaScript":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
          placeholder="Rechercher un élément... (Ctrl+/)"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Search results */}
      {showResults && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {results.length > 0 ? (
            // Active search results
            <ul className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-none"
                >
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start gap-3"
                    onClick={() => handleResultClick(result.route)}
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-black dark:text-white">
                          {result.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyles(
                            result.type
                          )}`}
                        >
                          {result.type}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 dark:text-gray-600 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() !== "" ? (
            // No results
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-10 h-10 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="mb-1">
                Aucun résultat trouvé pour <strong>"{searchQuery}"</strong>
              </p>
              <p className="text-sm">
                Essayez d'autres termes ou vérifiez l'orthographe
              </p>
            </div>
          ) : recentSearches.length > 0 ? (
            // Display recent searches when the search field is empty
            <div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Recherches récentes
                </h3>
              </div>
              <ul>
                {recentSearches.map((search, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-none"
                  >
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
                      onClick={() => setSearchQuery(search)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 dark:text-gray-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {search}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Search help message
            <div className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">
                Commencez à taper pour rechercher des éléments HTML, CSS ou
                JavaScript
              </p>
              <div className="flex items-center justify-center mt-3 text-xs gap-2">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">
                  Ctrl
                </span>
                <span>+</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">
                  /
                </span>
                <span>pour rechercher depuis n'importe où</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
