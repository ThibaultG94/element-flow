import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Modal stylization
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    padding: "0",
    border: "none",
    borderRadius: "0.5rem",
    overflow: "hidden",
    backgroundColor: "var(--bg-color, white)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

// Setting the modal root node
Modal.setAppElement("#root");

const AnimatedElementModal = ({
  isOpen,
  closeModal,
  elementId,
  theme = "light",
}) => {
  const [element, setElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  // Defining CSS variables for the theme
  const bgColor = theme === "dark" ? "#1f2937" : "white";
  const textColor = theme === "dark" ? "white" : "#1f2937";

  // Load element data from JSON
  useEffect(() => {
    if (isOpen && elementId) {
      setLoading(true);

      // Simulate an API request (replace with fetch to your API)
      const fetchElement = async () => {
        try {
          // Replace with a real API request
          const response = await fetch("/data/html-elements.json");
          const data = await response.json();

          if (data[elementId]) {
            setElement(data[elementId]);
            // Start animation automatically if autoPlay is enabled
            if (data[elementId].animation?.autoPlay) {
              setIsPlaying(true);
            }
          } else {
            console.error(`Élément ${elementId} non trouvé`);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchElement();
    }
  }, [isOpen, elementId]);

  // Effect for automatic animation
  useEffect(() => {
    if (isPlaying && element?.animation?.steps) {
      const duration = element.animation.duration || 2000;

      animationRef.current = setTimeout(() => {
        if (currentStep < element.animation.steps.length - 1) {
          setCurrentStep((prevStep) => prevStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, element]);

  // Reset status when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (
      element?.animation?.steps &&
      currentStep < element.animation.steps.length - 1
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  const openCodeModal = () => {
    setIsCodeModalOpen(true);
    setIsPlaying(false);
  };

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
    setIsPlaying(false);
  };

  if (loading || !element) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Chargement..."
      >
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Modal>
    );
  }

  const currentAnimation = element.animation?.steps[currentStep];

  return (
    <div>
      {/* Main modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            "--bg-color": bgColor,
            color: textColor,
          },
        }}
        contentLabel={`Détails de l'élément ${element.name}`}
      >
        <div className="relative">
          {/* Modal header */}
          <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-mono font-bold">{element.name}</h2>
            <div className="flex gap-2">
              <a
                href={`/element/${element.id}`}
                className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50"
              >
                Page détaillée →
              </a>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
            {/* Description */}
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {element.description}
            </p>

            {/* Interactive animation zone */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold">
                  {element.animation?.title || "Animation interactive"}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={openCodeModal}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Voir le code
                  </button>
                  <button
                    onClick={openPreviewModal}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Prévisualiser
                  </button>
                </div>
              </div>

              {/* Current step title */}
              {currentAnimation?.title && (
                <h4 className="text-lg font-medium text-center mt-4 text-gray-800 dark:text-gray-100">
                  {currentAnimation.title}
                </h4>
              )}

              {/* Animation content */}
              <div className="flex flex-col items-center p-8">
                <p className="text-center mb-8 text-lg text-gray-700 dark:text-gray-200">
                  {currentAnimation?.text ||
                    "Animation en cours de chargement..."}
                </p>

                {/* Visual demonstration area */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-300 dark:border-gray-600 mb-8 w-full max-w-2xl min-h-36 flex items-center justify-center">
                  {currentAnimation?.visualDemo ? (
                    <div
                      className="demo-container w-full"
                      dangerouslySetInnerHTML={{
                        __html: currentAnimation.visualDemo.content,
                      }}
                    />
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      Démonstration visuelle
                    </div>
                  )}
                </div>

                {/* Current step code */}
                {currentAnimation?.code && (
                  <div className="w-full max-w-2xl mb-8">
                    <SyntaxHighlighter
                      language="html"
                      style={atomOneDark}
                      className="rounded-md"
                    >
                      {currentAnimation.code}
                    </SyntaxHighlighter>
                  </div>
                )}

                {/* Animation controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
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
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
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
                    onClick={nextStep}
                    disabled={
                      !element.animation?.steps ||
                      currentStep === element.animation.steps.length - 1
                    }
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
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
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>

                {/* Navigation points */}
                {element.animation?.steps &&
                  element.animation.steps.length > 1 && (
                    <div className="flex gap-2 mt-4">
                      {element.animation.steps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToStep(idx)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            idx === currentStep
                              ? "bg-blue-600 dark:bg-blue-400"
                              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                          }`}
                          aria-label={`Étape ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Attributes */}
            {element.attributes && element.attributes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Attributs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Nom
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {element.attributes.map((attr, idx) => (
                        <tr key={idx} className="bg-white dark:bg-gray-800">
                          <td className="px-4 py-2 font-mono text-sm">
                            {attr.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                            {attr.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Related items */}
            {element.related && element.related.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Éléments liés</h3>
                <div className="flex flex-wrap gap-2">
                  {element.related.map((rel, idx) => (
                    <a
                      key={idx}
                      href={`/element/${rel}`}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-mono text-sm"
                    >
                      {rel.startsWith("!") ? `<${rel}>` : `<${rel}>`}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Code modal */}
      <Modal
        isOpen={isCodeModalOpen}
        onRequestClose={() => setIsCodeModalOpen(false)}
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            maxWidth: "600px",
            "--bg-color": bgColor,
          },
        }}
        contentLabel="Code de l'élément"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="font-medium">Code complet</h3>
          <button
            onClick={() => setIsCodeModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <SyntaxHighlighter language="html" style={atomOneDark}>
              {element.examples?.[0]?.code || element.syntax || element.name}
            </SyntaxHighlighter>
          </div>
        </div>
      </Modal>

      {/* Preview mode */}
      <Modal
        isOpen={isPreviewModalOpen}
        onRequestClose={() => setIsPreviewModalOpen(false)}
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            maxWidth: "600px",
            "--bg-color": bgColor,
          },
        }}
        contentLabel="Prévisualisation de l'élément"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="font-medium">Prévisualisation</h3>
          <button
            onClick={() => setIsPreviewModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-8">
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 w-full overflow-auto max-h-96">
            <iframe
              title="Preview"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body {
                      font-family: system-ui, sans-serif;
                      padding: 1rem;
                      ${
                        theme === "dark"
                          ? "background-color: #1f2937; color: white;"
                          : ""
                      }
                    }
                    /* Styles supplémentaires pour la visualisation */
                    .html-element { 
                      border: 2px solid #3b82f6; 
                      border-radius: 4px; 
                      padding: 0.5rem;
                    }
                    .highlight {
                      background-color: #fef08a;
                      color: #1e3a8a;
                      font-weight: bold;
                      padding: 0 0.25rem;
                    }
                  </style>
                </head>
                <body>
                  ${element.examples?.[0]?.code || ""}
                </body>
                </html>
              `}
              className="w-full h-full"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnimatedElementModal;
