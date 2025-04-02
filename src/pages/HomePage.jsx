import React from "react";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Apprenez les technologies web de manière{" "}
          <span className="text-blue-600 dark:text-blue-400">visuelle</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Découvrez HTML, CSS et JavaScript à travers des démonstrations
          interactives et des animations qui expliquent clairement chaque
          concept.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/html"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explorer HTML
          </Link>
          <Link
            to="/css"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explorer CSS
          </Link>
          <Link
            to="/javascript"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explorer JavaScript
          </Link>
        </div>
      </section>

      {/* Technologies section */}
      <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Explorez les technologies web
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* HTML Card */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 text-yellow-600 dark:text-yellow-300 mb-4 mx-auto">
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
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                HTML
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Structure et organisation du contenu web
              </p>
            </div>

            {/* CSS Card */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-yellow-600 dark:text-yellow-300 mb-4 mx-auto">
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
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                CSS
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Style et présentation visuelle
              </p>
            </div>

            {/* JavaScript Card */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mb-4 mx-auto">
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
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                JavaScript
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Interactivité et logique dynamique
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent elements section */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Éléments populaires
          </h2>
          <Link
            to="/html"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir tous →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example element - to be replaced by dynamic data later */}
          {["button", "div", "form", "flex", "grid", "querySelector"].map(
            (element, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <h3 className="font-mono text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {element}
                </h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {index < 3 ? "HTML" : index < 5 ? "CSS" : "JavaScript"}
                  </span>
                  <Link
                    to={`/element/${element}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Voir détails →
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
