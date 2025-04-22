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
        const reactResponse = await fetch("/data/react-elements.json");
        const vueResponse = await fetch("/data/vue-elements.json");
        const pythonResponse = await fetch("/data/python-elements.json");

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

        if (cssResponse.ok) {
          const cssData = await cssResponse.json();
          const cssElements = Object.entries(cssData).map(([id, element]) => ({
            ...element,
            id,
            type: "CSS",
            dateAdded: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ),
          }));
          allElements = [...allElements, ...cssElements];
        }

        if (jsResponse.ok) {
          const jsData = await jsResponse.json();
          const jsElements = Object.entries(jsData).map(([id, element]) => ({
            ...element,
            id,
            type: "JavaScript",
            dateAdded: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ),
          }));
          allElements = [...allElements, ...jsElements];
        }

        if (reactResponse.ok) {
          const reactData = await reactResponse.json();
          const reactElements = Object.entries(reactData).map(
            ([id, element]) => ({
              ...element,
              id,
              type: "React",
              dateAdded: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
              ),
            })
          );
          allElements = [...allElements, ...reactElements];
        }

        if (vueResponse.ok) {
          const vueData = await vueResponse.json();
          const vueElements = Object.entries(vueData).map(([id, element]) => ({
            ...element,
            id,
            type: "Vue",
            dateAdded: new Date(
              Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000
            ),
          }));
          allElements = [...allElements, ...vueElements];
        }

        if (pythonResponse.ok) {
          const pythonData = await pythonResponse.json();
          const pythonElements = Object.entries(pythonData).map(
            ([id, element]) => ({
              ...element,
              id,
              type: "Python",
              dateAdded: new Date(
                Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
              ),
            })
          );
          allElements = [...allElements, ...pythonElements];
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
            {
              id: "useState",
              name: "useState",
              type: "React",
              dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
            {
              id: "components",
              name: "Components",
              type: "Vue",
              dateAdded: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            },
            {
              id: "variables",
              name: "Variables",
              type: "Python",
              dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
          { id: "components", name: "Components", type: "Vue" },
          { id: "variables", name: "Variables", type: "Python" },
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
        case "React":
          return `/react/${elementId}`;
        case "Vue":
          return `/vue/${elementId}`;
        case "Python":
          return `/python/${elementId}`;
        default:
          return `/element/${elementId}`;
      }
    };

    // Get color based on technology type
    const getTypeColor = () => {
      switch (type) {
        case "HTML":
          return isHovered
            ? "bg-white text-blue-700 dark:bg-black dark:text-blue-400"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "CSS":
          return isHovered
            ? "bg-white text-purple-700 dark:bg-black dark:text-purple-400"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "JavaScript":
          return isHovered
            ? "bg-white text-yellow-700 dark:bg-black dark:text-yellow-400"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "React":
          return isHovered
            ? "bg-white text-cyan-700 dark:bg-black dark:text-cyan-400"
            : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
        case "Vue":
          return isHovered
            ? "bg-white text-emerald-700 dark:bg-black dark:text-emerald-400"
            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
        case "Python":
          return isHovered
            ? "bg-white text-green-700 dark:bg-black dark:text-green-400"
            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
          return isHovered
            ? "bg-white text-black dark:bg-black dark:text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
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
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors duration-300 ${getTypeColor()}`}
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
      title: "Vue Components",
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          ></path>
        </svg>
      ),
      description: "Build reactive interfaces with Vue.js",
      to: "/vue?category=components",
    },
    {
      title: "Python Basics",
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
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
      description: "Python fundamentals for beginners",
      to: "/python?category=basics",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
          Apprenez les technologies web et Python de manière{" "}
          <span className="text-gray-700 dark:text-gray-300">visuelle</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Découvrez HTML, CSS, JavaScript, React, Vue et Python à travers des
          démonstrations interactives et des animations qui expliquent
          clairement chaque concept.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <ExploreButton to="/html" isPrimary={true}>
            Explorer HTML
          </ExploreButton>
          <ExploreButton to="/css">Explorer CSS</ExploreButton>
          <ExploreButton to="/javascript">Explorer JavaScript</ExploreButton>
          <ExploreButton to="/typescript">Explorer TypeScript</ExploreButton>
          <ExploreButton to="/react">Explorer React</ExploreButton>
          <ExploreButton to="/vue">Explorer Vue</ExploreButton>
          <ExploreButton to="/python">Explorer Python</ExploreButton>
        </div>
      </section>

      {/* Developer-focused sections */}
      <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
            Domaines d'expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
