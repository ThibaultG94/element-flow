import React, { useState } from "react";
import { Link } from "react-router";

const HomePage = () => {
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

  const TechCard = ({ title, icon, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`p-6 rounded-lg transition-all duration-300 ${
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
      </div>
    );
  };

  const PopularElementCard = ({ name, type }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`border rounded-lg p-4 transition-all duration-300 ${
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
          <Link
            to={`/element/${name.toLowerCase()}`}
            className="text-sm hover:underline"
          >
            Voir détails →
          </Link>
        </div>
      </div>
    );
  };

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

      {/* Technologies section */}
      <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
            Explorez les technologies web
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* HTML Card */}
            <TechCard
              title="HTML"
              description="Structure et organisation du contenu web"
              icon={
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                </svg>
              }
            />

            {/* CSS Card */}
            <TechCard
              title="CSS"
              description="Style et présentation visuelle"
              icon={
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
              }
            />

            {/* JavaScript Card */}
            <TechCard
              title="JavaScript"
              description="Interactivité et logique dynamique"
              icon={
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Recent elements section */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Éléments populaires
          </h2>
          <Link
            to="/html"
            className="text-black dark:text-white hover:underline transition-colors duration-300"
          >
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example element - to be replaced by dynamic data later */}
          {[
            { name: "button", type: "HTML" },
            { name: "div", type: "HTML" },
            { name: "form", type: "HTML" },
            { name: "flex", type: "CSS" },
            { name: "grid", type: "CSS" },
            { name: "querySelector", type: "JavaScript" },
          ].map((element, index) => (
            <PopularElementCard
              key={index}
              name={element.name}
              type={element.type}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
