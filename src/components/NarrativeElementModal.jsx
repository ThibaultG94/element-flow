import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../styles/animations.css";

// Styles de base du modal
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
    maxHeight: "95vh",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
  },
};

// Style spécifique pour le loader
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

// Config du point d'attache du modal
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

  // Refs pour les animations et timers
  const timeoutRef = useRef(null);
  const typingRef = useRef(null);
  const codeTypingRef = useRef(null);
  const sequenceIndexRef = useRef(0);
  const contentRef = useRef(null);

  // Définition des variables CSS pour le thème
  const bgColor = theme === "dark" ? "#121212" : "white";
  const textColor = theme === "dark" ? "white" : "black";

  // Détection du mode mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fonctions utilitaires pour nettoyer le code
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

  // Chargement des données de l'élément depuis le JSON
  useEffect(() => {
    if (isOpen && elementId) {
      setLoading(true);
      setAnimationStarted(false);
      setDataLoaded(false);

      // Réinitialisation de l'état pour un nouvel élément
      resetNarrativeState();

      // Nettoyage des timers existants
      clearAllTimers();

      // Chargement des données
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

          // Données de secours pour la démo si l'élément est "html"
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

  // Effet spécifique pour lancer l'animation une fois les données chargées
  useEffect(() => {
    if (dataLoaded && !animationStarted && element && !loading && isOpen) {
      console.log("Lancement de l'animation après chargement des données");

      // On cache d'abord tous les éléments pour éviter l'effet de préchargement
      setNarrativeState((prev) => ({
        ...prev,
        showTitle: false,
        showText: false,
        showCode: false,
        showVisual: false,
      }));

      // Puis on démarre l'animation après un court délai
      timeoutRef.current = setTimeout(() => {
        startNarration();
        setAnimationStarted(true);
      }, 100);
    }
  }, [dataLoaded, animationStarted, element, loading, isOpen]);

  // Nettoyage des timeouts à la fermeture
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Fonction pour démarrer l'animation narrative
  const startNarration = () => {
    console.log("Démarrage de la narration...");
    setIsPaused(false);
    animateStep(narrativeState.currentStep);
  };

  // Fonction d'animation des étapes
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

    // Séquence d'animation pour cette étape
    const sequence = [
      // Affichage du titre avec animation fade-in
      () => {
        console.log("Séquence 1: Affichage du titre");
        setNarrativeState((prev) => ({ ...prev, showTitle: true }));
        if (!isPaused) scheduleNext(800);
      },

      // Animation d'écriture du texte
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

        // Animation d'écriture caractère par caractère - vitesse accélérée
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
        }, 12); // Vitesse de frappe plus rapide: 12ms
      },

      // Affichage du code avec animation d'écriture
      () => {
        console.log("Séquence 3: Affichage du code");
        setNarrativeState((prev) => ({ ...prev, showCode: true }));

        // Démarrage de l'animation d'écriture du code
        const code = step.code || "";
        let codeProgress = 0;

        setNarrativeState((prev) => ({
          ...prev,
          typingCode: "",
          typingCodeProgress: 0,
        }));

        // Animation d'écriture du code - encore plus rapide que le texte
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
        }, 8); // Frappe super rapide pour le code: 8ms
      },

      // Affichage de la démo visuelle
      () => {
        console.log("Séquence 4: Démonstration visuelle");
        setNarrativeState((prev) => ({ ...prev, showVisual: true }));

        // Attente plus longue pour la visualisation
        if (!isPaused) scheduleNext(3000);
      },

      // Transition vers l'étape suivante ou fin
      () => {
        console.log("Séquence 5: Transition");
        // Suppression progressive de tous les éléments
        setNarrativeState((prev) => ({
          ...prev,
          showTitle: false,
          showText: false,
          showCode: false,
          showVisual: false,
        }));

        // Passage à la suite après une transition
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
              // Fin de l'animation - affichage d'un résumé ou redémarrage
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

    // Réinitialisation de l'index de séquence
    sequenceIndexRef.current = 0;

    // Exécution de la première étape de la séquence
    runSequence();

    // Fonction pour exécuter la séquence d'animation étape par étape
    function runSequence() {
      if (sequenceIndexRef.current < sequence.length) {
        sequence[sequenceIndexRef.current]();
      }
    }

    // Planification de la prochaine étape de séquence
    function scheduleNext(delay) {
      timeoutRef.current = setTimeout(() => {
        sequenceIndexRef.current++;
        runSequence();
      }, delay);
    }
  };

  // Pause ou reprise de l'animation
  const togglePause = () => {
    setIsPaused(!isPaused);

    if (isPaused) {
      // Reprise là où l'animation s'est arrêtée
      startNarration();
    } else {
      // Pause en nettoyant les timeouts
      clearAllTimers();
    }
  };

  // Aller à une étape spécifique
  const goToStep = (stepIndex) => {
    if (stepIndex === narrativeState.currentStep) {
      return; // Déjà sur cette étape
    }

    clearAllTimers(); // Arrêt de l'animation en cours
    setIsPaused(true); // Mise en pause de l'animation

    // Réinitialisation de l'état d'abord
    resetNarrativeState();

    // Passage à la nouvelle étape et affichage immédiat
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

  // Redémarrer l'animation
  const restartAnimation = () => {
    console.log("Redémarrage de l'animation");
    clearAllTimers();
    resetNarrativeState();

    setTimeout(() => {
      startNarration();
    }, 300);
  };

  // Si en chargement, affichage du loader
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
        {/* En-tête compact */}
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

        {/* Zone de contenu principal avec scroll */}
        <div className="flex-grow overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div
            className="flex items-center justify-center p-6"
            ref={contentRef}
          >
            <div className="w-full max-w-3xl">
              {/* Titre */}
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

              {/* Texte avec effet de frappe */}
              <div
                className={`w-full text-center mb-6 min-h-[60px] ${
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

              {/* Zone de contenu adaptatif (code + démo visuelle) */}
              <div
                className={`w-full ${
                  isMobile ? "flex flex-col gap-6" : "flex flex-row gap-6"
                }`}
              >
                {/* Code avec effet de frappe (à gauche) */}
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

                {/* Démonstration visuelle (à droite) */}
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
            </div>
          </div>
        </div>

        {/* Contrôles - compact et fixe en bas */}
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
