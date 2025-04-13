import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const HomePage = () => {
  const [recentElements, setRecentElements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recent items
  useEffect(() => {
    const fetchRecentElements = async () => {
      try {
        setLoading(true);
        // Loading data from JSON files
        const htmlResponse = await fetch("/data/html-elements.json");
        const cssResponse = await fetch("/data/css-elements.json");
        const jsResponse = await fetch("/data/js-elements.json");

        let allElements = [];

        if (htmlResponse.ok) {
          const htmlData = await htmlResponse.json();
          // Transform object into table with additional metadata
          const htmlElements = Object.entries(htmlData).map(
            ([id, element]) => ({
              ...element,
              id,
              type: "HTML",
              // Simulate addition dates for the demo
              dateAdded: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
              ),
            })
          );
          allElements = [...allElements, ...htmlElements];
        }

        // Fallback if no data available
        if (allElements.length === 0) {
          allElements = [
            {
              id: "html",
              name: "<html>",
              type: "HTML",
              dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
              id: "body",
              name: "<body>",
              type: "HTML",
              dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
              id: "display",
              name: "display",
              type: "CSS",
              dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
              id: "flex",
              name: "flex",
              type: "CSS",
              dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
            {
              id: "variables",
              name: "Variables",
              type: "JavaScript",
              dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
            {
              id: "querySelector",
              name: "querySelector",
              type: "JavaScript",
              dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            },
          ];
        }

        // Sort by date added (most recent first)
        allElements.sort((a, b) => b.dateAdded - a.dateAdded);

        // Take the first 6 items
        setRecentElements(allElements.slice(0, 6));
      } catch (error) {
        console.error("Erreur lors du chargement des éléments récents:", error);
        // Fallback with static data in case of error
        setRecentElements([
          { id: "html", name: "<html>", type: "HTML" },
          { id: "body", name: "<body>", type: "HTML" },
          { id: "display", name: "display", type: "CSS" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentElements();
  }, []);

  const ExploreButton = ({ to, children, isPrimary = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseClasses =
      "px-6 py-3 rounded-lg font-medium transition-all duration-300";
    const primaryClasses = isHovered
      ? "bg-white text-black dark:bg-gray-900 dark:text-white border border-black dark:border-white"
      : "bg-black text-white dark:bg-white dark:text-black";
    const secondaryClasses = isHovered
      ? "bg-black text-white dark:bg-white dark:text-black"
      : "bg-white text-black dark:bg-gray-900 dark:text-white border border-black dark:border-white";

    return (
      <Link
        to={to}
        className={`${baseClasses} ${
          isPrimary ? primaryClasses : secondaryClasses
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
    );
  };

  const CategoryCard = ({ title, icon, description, to }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link
        to={to}
        className={`block p-6 rounded-lg transition-all duration-300 cursor-pointer ${
          isHovered
            ? "bg-black text-white dark:bg-white dark:text-black transform scale-105"
            : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 transition-colors duration-300 ${
            isHovered
              ? "bg-white text-black dark:bg-black dark:text-white"
              : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        <p
          className={`text-center transition-colors duration-300 ${
            isHovered
              ? "text-gray-200 dark:text-gray-800"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {description}
        </p>
      </Link>
    );
  };

  const RecentElementCard = ({ name, type, id }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Determining the route according to type
    const getRoute = () => {
      const elementId = id.toLowerCase();
      switch (type) {
        case "CSS":
          return `/css/${elementId}`;
        case "JavaScript":
          return `/javascript/${elementId}`;
        default:
          return `/element/${elementId}`;
      }
    };

    return (
      <Link
        to={getRoute()}
        className={`block border rounded-lg p-4 transition-all duration-300 cursor-pointer ${
          isHovered
            ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="font-mono text-lg font-medium mb-2">{name}</h3>
        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
              isHovered
                ? "bg-white text-black dark:bg-black dark:text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {type}
          </span>
          <span className="text-sm">Voir détails →</span>
        </div>
      </Link>
    );
  };

  // Sections for developers
  const developerSections = [
    {
      title: "Éléments de Structure",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          ></path>
        </svg>
      ),
      description: "Mastering HTML semantic structure",
      to: "/html?category=structure",
    },
    {
      title: "Flexbox & Grid",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          ></path>
        </svg>
      ),
      description: "Modern CSS layout techniques",
      to: "/css?category=layout",
    },
    {
      title: "DOM Manipulation",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          ></path>
        </svg>
      ),
      description: "Dynamic interactivity with JS",
      to: "/javascript?category=dom",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
          Apprenez les technologies web de manière{" "}
          <span className="text-gray-700 dark:text-gray-300">visuelle</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Découvrez HTML, CSS et JavaScript à travers des démonstrations
          interactives et des animations qui expliquent clairement chaque
          concept.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <ExploreButton to="/html" isPrimary={true}>
            Explorer HTML
          </ExploreButton>
          <ExploreButton to="/css">Explorer CSS</ExploreButton>
          <ExploreButton to="/javascript">Explorer JavaScript</ExploreButton>
        </div>
      </section>

      {/* Developer-focused sections */}
      <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
            Domaines d'expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {developerSections.map((section, index) => (
              <CategoryCard
                key={index}
                title={section.title}
                description={section.description}
                icon={section.icon}
                to={section.to}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent elements section */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Éléments récemment ajoutés
          </h2>
          <Link
            to="/html"
            className="text-black dark:text-white hover:underline transition-colors duration-300"
          >
            Voir tous →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentElements.map((element, index) => (
              <RecentElementCard
                key={index}
                name={element.name}
                type={element.type}
                id={element.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
