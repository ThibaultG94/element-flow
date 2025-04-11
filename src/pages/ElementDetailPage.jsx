import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Temporary data - to be replaced by an API call to Strapi
const elementDetails = {
  button: {
    name: "<button>",
    description:
      "L'élément HTML button représente un élément cliquable de type bouton.",
    category: "form",
    syntax: '<button type="button">Texte du bouton</button>',
    attributes: [
      { name: "disabled", description: "Désactive le bouton" },
      { name: "form", description: "Associe le bouton à un formulaire" },
      { name: "type", description: "Type du bouton (button, submit, reset)" },
    ],
    examples: [
      { title: "Bouton simple", code: "<button>Cliquez ici</button>" },
      {
        title: "Bouton de validation",
        code: '<button type="submit">Envoyer</button>',
      },
      {
        title: "Bouton désactivé",
        code: "<button disabled>Non disponible</button>",
      },
    ],
    animations: [
      {
        title: "Comment utiliser un bouton",
        steps: [
          {
            text: "Un bouton est interactif par défaut",
            codeHighlight: "<button>",
            visualEffect: "click-animation",
          },
          {
            text: "Vous pouvez définir le type du bouton",
            codeHighlight: 'type="submit"',
            visualEffect: "highlight-type",
          },
          {
            text: "Les boutons peuvent être désactivés",
            codeHighlight: "disabled",
            visualEffect: "disable-animation",
          },
        ],
      },
    ],
    related: ["input", "form", "a"],
  },
  // Add other elements as required
};

const ElementDetailPage = () => {
  const { id } = useParams();
  const [element, setElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    console.log("Loading element with ID:", id);
    // Simulate data loading (to be replaced by an API call)
    const fetchElement = async () => {
      setLoading(true);
      try {
        // Simulate a loading delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Retrieve element details
        const data = elementDetails[id];
        if (data) {
          setElement(data);
        } else {
          console.error(`Élément ${id} non trouvé`);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'élément:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElement();
  }, [id]);

  // Manage navigation in animation stages
  const handleNextStep = () => {
    if (
      element &&
      element.animations &&
      element.animations[0].steps.length > currentAnimationStep + 1
    ) {
      setCurrentAnimationStep(currentAnimationStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentAnimationStep > 0) {
      setCurrentAnimationStep(currentAnimationStep - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Effect for automatic playback of animation steps
  useEffect(() => {
    let timer;
    if (isPlaying && element && element.animations) {
      timer = setTimeout(() => {
        handleNextStep();
      }, 2000); // Go to next step after 2 seconds
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentAnimationStep, element]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Élément non trouvé
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Désolé, l'élément "{id}" n'existe pas ou n'est pas disponible.
        </p>
        <Link
          to="/html"
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Retour aux éléments HTML
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Header with navigation */}
      <div className="mb-6">
        <Link
          to="/html"
          className="text-black dark:text-white hover:underline mb-2 inline-block"
        >
          ← Retour aux éléments HTML
        </Link>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2 font-mono">
          {element.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
          {element.description}
        </p>
        <div className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
          Catégorie: {element.category}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentTab === "overview"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("overview")}
          >
            Vue d'ensemble
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentTab === "animation"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("animation")}
          >
            Animation
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentTab === "examples"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setCurrentTab("examples")}
          >
            Exemples
          </button>
        </nav>
      </div>

      {/* Tab contents */}
      <div className="max-w-4xl">
        {/* Overview */}
        {currentTab === "overview" && (
          <div>
            <section className="mb-8">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Syntaxe
              </h2>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <SyntaxHighlighter language="html" style={atomOneDark}>
                  {element.syntax}
                </SyntaxHighlighter>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Attributs
              </h2>
              <div className="rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-100 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                    {element.attributes.map((attr, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white font-mono">
                          {attr.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {attr.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {element.related && element.related.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                  Éléments liés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {element.related.map((relatedId, index) => (
                    <Link
                      key={index}
                      to={`/element/${relatedId}`}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-mono"
                    >
                      {`<${relatedId}>`}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Animation */}
        {currentTab === "animation" &&
          element.animations &&
          element.animations.length > 0 && (
            <div>
              <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                  {element.animations[0].title}
                </h2>

                {/* Animation visualization */}
                <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 flex items-center justify-center min-h-64 border border-gray-200 dark:border-gray-800">
                  {/* Here, we implement the visual part of the animation */}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                      {element.animations[0].steps[currentAnimationStep].text}
                    </h3>

                    {/* Demonstration area - to be adapted to the element */}
                    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md inline-block">
                      {element.name === "<button>" && (
                        <button
                          type={
                            currentAnimationStep === 1 ? "submit" : "button"
                          }
                          disabled={currentAnimationStep === 2}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Bouton de démonstration
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Source code highlighted */}
                <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                  <SyntaxHighlighter language="html" style={atomOneDark}>
                    {element.syntax}
                  </SyntaxHighlighter>
                </div>

                {/* Animation controls */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentAnimationStep === 0}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5 text-gray-800 dark:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        ></path>
                      </svg>
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black"
                    >
                      {isPlaying ? (
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
                            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={handleNextStep}
                      disabled={
                        currentAnimationStep ===
                        element.animations[0].steps.length - 1
                      }
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
                    >
                      <svg
                        className="w-5 h-5 text-gray-800 dark:text-gray-200"
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
                  </div>

                  {/* Milestones */}
                  <div className="flex space-x-1">
                    {element.animations[0].steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAnimationStep(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentAnimationStep
                            ? "bg-black dark:bg-white"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        aria-label={`Step ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Examples */}
        {currentTab === "examples" && (
          <div>
            {element.examples.map((example, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  {example.title}
                </h3>

                <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
                  <SyntaxHighlighter language="html" style={atomOneDark}>
                    {example.code}
                  </SyntaxHighlighter>
                </div>

                <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
                  <div
                    className="result-preview"
                    dangerouslySetInnerHTML={{ __html: example.code }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementDetailPage;
