import React, { useState, useEffect, useRef } from "react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import Modal from "react-modal";
import AutoScrollContainer from "./AutoScrollContainer";
import "../styles/animations.css";
import "../styles/mobile.css";

// Basic modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "900px",
    maxHeight: "95vh",
    "@media (minWidth: 768px)": {
      width: "90%",
      maxWidth: "900px",
    },
    height: "auto",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    overflow: "hidden",
    overflowY: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
  },
};

// Specific style for the loader
const loaderStyles = {
  content: {
    ...customStyles.content,
    width: "auto",
    height: "auto",
    minWidth: "120px",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  overlay: customStyles.overlay,
};

// Config of the modal attachment point
Modal.setAppElement("#root");

const NarrativeElementModal = ({
  isOpen,
  closeModal,
  elementId,
  theme = "light",
}) => {
  const [element, setElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [narrativeState, setNarrativeState] = useState({
    currentStep: 0,
    showTitle: false,
    showText: false,
    showCode: false,
    showVisual: false,
    typingText: "",
    typingProgress: 0,
    typingCode: "",
    typingCodeProgress: 0,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for animations and timers
  const timeoutRef = useRef(null);
  const typingRef = useRef(null);
  const codeTypingRef = useRef(null);
  const sequenceIndexRef = useRef(0);
  const contentRef = useRef(null);

  // Setting CSS variables for the theme
  const bgColor = theme === "dark" ? "#121212" : "white";
  const textColor = theme === "dark" ? "white" : "black";

  // Mobile mode detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Utility functions to clean up code
  const resetNarrativeState = () => {
    setNarrativeState({
      currentStep: 0,
      showTitle: false,
      showText: false,
      showCode: false,
      showVisual: false,
      typingText: "",
      typingProgress: 0,
      typingCode: "",
      typingCodeProgress: 0,
    });
  };

  const clearAllTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
    if (codeTypingRef.current) clearInterval(codeTypingRef.current);
  };

  // Loading element data from JSON
  useEffect(() => {
    if (isOpen && elementId) {
      setLoading(true);
      setAnimationStarted(false);
      setDataLoaded(false);

      // Reset status for a new element
      resetNarrativeState();

      // Cleaning existing timers
      clearAllTimers();

      // Loading data
      const fetchElement = async () => {
        try {
          console.log("Chargement des données pour l'élément:", elementId);
          const response = await fetch("/data/html-elements.json");

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data = await response.json();

          if (data[elementId]) {
            console.log("Données chargées avec succès:", data[elementId].name);
            setElement(data[elementId]);
            setLoading(false);
            setDataLoaded(true);
          } else {
            console.error(`Élément ${elementId} non trouvé`);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);

          // Backup data for demo if element is "html".
          if (elementId === "html") {
            setElement({
              id: "html",
              name: "<html>",
              description:
                "L'élément racine qui contient tout le document HTML",
              category: "structure",
              animation: {
                steps: [
                  {
                    title: "Structure de base",
                    text: "Un document HTML contient deux éléments principaux : <head> pour les métadonnées et <body> pour le contenu visible",
                    code: "<html>\n  <head>\n    <!-- Métadonnées, titre, etc. -->\n  </head>\n  <body>\n    <!-- Contenu visible -->\n  </body>\n</html>",
                    visualDemo: {
                      content:
                        '<div class="html-element">html<div class="head-element">head</div><div class="body-element">body</div></div>',
                    },
                  },
                ],
              },
            });
            setLoading(false);
            setDataLoaded(true);
          } else {
            setLoading(false);
          }
        }
      };

      fetchElement();
    }
  }, [isOpen, elementId]);

  // Specific effect to launch animation once data has been loaded
  useEffect(() => {
    if (dataLoaded && !animationStarted && element && !loading && isOpen) {
      console.log("Lancement de l'animation après chargement des données");

      // First, we hide all the elements to avoid the preloading effect.
      setNarrativeState((prev) => ({
        ...prev,
        showTitle: false,
        showText: false,
        showCode: false,
        showVisual: false,
      }));

      // After a short delay, the animation is started.
      timeoutRef.current = setTimeout(() => {
        startNarration();
        setAnimationStarted(true);
      }, 100);
    }
  }, [dataLoaded, animationStarted, element, loading, isOpen]);

  // Closing timeout cleaning
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Function to start narrative animation
  const startNarration = () => {
    console.log("Démarrage de la narration...");
    setIsPaused(false);
    animateStep(narrativeState.currentStep);
  };

  // Stage animation function
  const animateStep = (stepIndex) => {
    console.log("Animation de l'étape:", stepIndex);
    if (!element || !element.animation || !element.animation.steps[stepIndex]) {
      console.error("Impossible d'animer: données manquantes", {
        element,
        animation: element?.animation,
        steps: element?.animation?.steps,
      });
      return;
    }

    const step = element.animation.steps[stepIndex];
    console.log("Étape en cours:", step.title || "Sans titre");

    // Animation sequence for this stage
    const sequence = [
      // Title display with fade-in animation
      () => {
        console.log("Séquence 1: Affichage du titre");
        setNarrativeState((prev) => ({ ...prev, showTitle: true }));
        if (!isPaused) scheduleNext(800);
      },

      // Text writing animation
      () => {
        console.log("Séquence 2: Animation de texte");
        const text = step.text;
        let progress = 0;
        setNarrativeState((prev) => ({
          ...prev,
          showText: true,
          typingText: "",
          typingProgress: 0,
        }));

        // Character-by-character writing animation - accelerated speed
        typingRef.current = setInterval(() => {
          if (progress < text.length) {
            progress++;
            setNarrativeState((prev) => ({
              ...prev,
              typingText: text.substring(0, progress),
              typingProgress: progress,
            }));
          } else {
            clearInterval(typingRef.current);
            if (!isPaused) scheduleNext(800);
          }
        }, 20 * Math.random());
      },

      // Code display with writing animation
      () => {
        console.log("Séquence 3: Affichage du code");
        setNarrativeState((prev) => ({ ...prev, showCode: true }));

        // Start the code writing animation
        const code = step.code || "";
        let codeProgress = 0;

        setNarrativeState((prev) => ({
          ...prev,
          typingCode: "",
          typingCodeProgress: 0,
        }));

        // Code writing animation - even faster than text
        codeTypingRef.current = setInterval(() => {
          if (codeProgress < code.length) {
            codeProgress++;
            setNarrativeState((prev) => ({
              ...prev,
              typingCode: code.substring(0, codeProgress),
              typingCodeProgress: codeProgress,
            }));
          } else {
            clearInterval(codeTypingRef.current);
            if (!isPaused) scheduleNext(800);
          }
        }, 10 * Math.random());
      },

      // Display visual demo
      () => {
        console.log("Séquence 4: Démonstration visuelle");
        setNarrativeState((prev) => ({ ...prev, showVisual: true }));

        // Longer wait for visualization
        if (!isPaused) scheduleNext(3000);
      },

      // Transition to next stage or end
      () => {
        console.log("Séquence 5: Transition");
        // Progressive removal of all elements
        setNarrativeState((prev) => ({
          ...prev,
          showTitle: false,
          showText: false,
          showCode: false,
          showVisual: false,
        }));

        // Moving on after a transition
        if (!isPaused) {
          timeoutRef.current = setTimeout(() => {
            if (stepIndex < element.animation.steps.length - 1) {
              console.log("Passage à l'étape suivante");
              setNarrativeState((prev) => ({
                ...prev,
                currentStep: stepIndex + 1,
              }));
              animateStep(stepIndex + 1);
            } else {
              console.log("Animation terminée");
              // End animation - display summary or restart
              setNarrativeState((prev) => ({
                ...prev,
                currentStep: 0,
                showTitle: true,
                showText: true,
                typingText:
                  "Animation terminée. Cliquez sur lecture pour revoir.",
              }));
            }
          }, 800);
        }
      },
    ];

    // Reset sequence index
    sequenceIndexRef.current = 0;

    // Executing the first step of the sequence
    runSequence();

    // Function for running the animation sequence step by step
    function runSequence() {
      if (sequenceIndexRef.current < sequence.length) {
        sequence[sequenceIndexRef.current]();
      }
    }

    // Planning the next sequence step
    function scheduleNext(delay) {
      timeoutRef.current = setTimeout(() => {
        sequenceIndexRef.current++;
        runSequence();
      }, delay);
    }
  };

  // Pause or resume animation
  const togglePause = () => {
    setIsPaused(!isPaused);

    if (isPaused) {
      startNarration();
    } else {
      clearAllTimers();
    }
  };

  // Go to a specific step
  const goToStep = (stepIndex) => {
    if (stepIndex === narrativeState.currentStep) {
      return; // Already on this stage
    }

    clearAllTimers(); // Stop animation in progress
    setIsPaused(true); // Pause animation

    // Reset status first
    resetNarrativeState();

    // Switch to the new stage and display immediately
    setTimeout(() => {
      const stepText = element.animation.steps[stepIndex].text;
      const stepCode = element.animation.steps[stepIndex].code || "";

      setNarrativeState({
        currentStep: stepIndex,
        showTitle: true,
        showText: true,
        showCode: true,
        showVisual: true,
        typingText: stepText,
        typingProgress: stepText.length,
        typingCode: stepCode,
        typingCodeProgress: stepCode.length,
      });
    }, 100);
  };

  const restartAnimation = () => {
    console.log("Redémarrage de l'animation");
    clearAllTimers();
    resetNarrativeState();

    setTimeout(() => {
      startNarration();
    }, 300);
  };

  // If loading, loader display
  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            ...loaderStyles.content,
            backgroundColor: theme === "dark" ? "#121212" : "white",
          },
          overlay: loaderStyles.overlay,
        }}
        contentLabel="Chargement..."
      >
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
      </Modal>
    );
  }

  if (!element) {
    return null;
  }

  const currentStep = element.animation?.steps[narrativeState.currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          ...customStyles.content,
          backgroundColor: bgColor,
          color: textColor,
        },
        overlay: customStyles.overlay,
      }}
      contentLabel={`Démonstration de ${element.name}`}
    >
      <div className="flex flex-col h-full">
        {/* Compact header */}
        <div className="flex justify-between items-center py-2 px-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-10">
          <h2 className="text-lg font-mono font-bold">{element.name}</h2>
          <div className="flex gap-2">
            <a
              href={`/element/${element.id}`}
              className="px-2 py-1 text-xs text-black dark:text-white bg-gray-100 dark:bg-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.preventDefault();
                closeModal();
                window.location.href = `/element/${element.id}`;
              }}
            >
              Page détaillée →
            </a>
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
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

        {/* Main content area with auto-scroll */}
        <AutoScrollContainer
          className="flex-grow bg-gray-100 dark:bg-gray-900 -webkit-overflow-scrolling-touch"
          scrollThreshold={150}
        >
          <div
            className="flex items-center justify-center p-6"
            ref={contentRef}
          >
            <div className="w-full max-w-3xl">
              {/* Title */}
              <div
                className={`text-center mb-4 ${
                  narrativeState.showTitle
                    ? "title-animation-enter"
                    : "title-animation-exit"
                }`}
                style={{
                  visibility: narrativeState.showTitle ? "visible" : "hidden",
                }}
              >
                {currentStep?.title && (
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {currentStep.title}
                  </h3>
                )}
              </div>

              {/* Text with typing effect */}
              <div
                className={`w-full px-8 text-center mb-6 min-h-[60px] ${
                  narrativeState.showText
                    ? "text-animation-enter"
                    : "text-animation-exit"
                }`}
                style={{
                  visibility: narrativeState.showText ? "visible" : "hidden",
                }}
              >
                <p className="text-base text-gray-800 dark:text-gray-200">
                  {narrativeState.typingText}
                  <span className="typing-cursor"></span>
                </p>
              </div>

              {/* Adaptive content zone (code + visual demo) */}
              <div
                className={`w-full ${
                  isMobile ? "flex flex-col gap-6" : "flex flex-row gap-6"
                }`}
              >
                {/* Code with keystroke effect (left) */}
                <div
                  className={`${isMobile ? "w-full" : "w-1/2"} ${
                    narrativeState.showCode
                      ? "code-animation-enter"
                      : "code-animation-exit"
                  }`}
                  style={{
                    visibility: narrativeState.showCode ? "visible" : "hidden",
                  }}
                >
                  {currentStep?.code &&
                    narrativeState.typingCodeProgress > 0 && (
                      <div className="code-typing rounded-md shadow-lg overflow-hidden">
                        <SyntaxHighlighter
                          language="html"
                          style={atomOneDark}
                          className="text-sm"
                          showLineNumbers={false}
                          wrapLongLines={true}
                        >
                          {narrativeState.typingCode}
                        </SyntaxHighlighter>
                      </div>
                    )}

                  {currentStep?.code &&
                    narrativeState.typingCodeProgress === 0 && (
                      <SyntaxHighlighter
                        language="html"
                        style={atomOneDark}
                        className="rounded-md shadow-lg text-sm"
                        showLineNumbers={false}
                        wrapLongLines={true}
                      >
                        {currentStep.code}
                      </SyntaxHighlighter>
                    )}
                </div>

                {/* Visual demonstration (right) */}
                <div
                  className={`${isMobile ? "w-full" : "w-1/2"} ${
                    narrativeState.showVisual
                      ? "visual-animation-enter"
                      : "visual-animation-exit"
                  }`}
                  style={{
                    visibility: narrativeState.showVisual
                      ? "visible"
                      : "hidden",
                  }}
                >
                  {currentStep?.visualDemo && (
                    <div className="bg-white dark:bg-black p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                      <div
                        className="demo-container"
                        dangerouslySetInnerHTML={{
                          __html: currentStep.visualDemo.content,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Espace de marge en bas pour le mobile */}
              {isMobile && <div className="h-6 w-full"></div>}
            </div>
          </div>
        </AutoScrollContainer>

        {/* Controls - compact and fixed at the bottom */}
        <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-between sticky bottom-0 z-10">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {narrativeState.currentStep + 1}/
              {element.animation?.steps.length || 1}
            </span>
            <div className="flex gap-1 ml-1">
              {element.animation?.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    idx === narrativeState.currentStep
                      ? "bg-black dark:bg-white scale-110"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`Étape ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={restartAnimation}
              className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 control-button"
              title="Redémarrer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </button>

            <button
              onClick={togglePause}
              className="p-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200 control-button"
              title={isPaused ? "Reprendre" : "Pause"}
            >
              {isPaused ? (
                <svg
                  className="w-4 h-4"
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
              ) : (
                <svg
                  className="w-4 h-4"
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
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NarrativeElementModal;
