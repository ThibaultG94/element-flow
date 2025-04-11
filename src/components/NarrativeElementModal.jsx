import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../styles/animations.css";

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
    height: "90vh",
    minHeight: "600px",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    overflow: "hidden",
    backgroundColor: "var(--bg-color, white)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
  },
};

// Setting the modal root node
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
  });
  const [isPaused, setIsPaused] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const timeoutRef = useRef(null);
  const typingRef = useRef(null);
  const sequenceIndexRef = useRef(0);

  // Defining CSS variables for the theme
  const bgColor = theme === "dark" ? "#121212" : "white";
  const textColor = theme === "dark" ? "white" : "black";

  // Load element data from JSON
  useEffect(() => {
    if (isOpen && elementId) {
      setLoading(true);
      setAnimationStarted(false);

      // Reset narrative state for new element
      setNarrativeState({
        currentStep: 0,
        showTitle: false,
        showText: false,
        showCode: false,
        showVisual: false,
        typingText: "",
        typingProgress: 0,
      });

      // Simulate an API request (replace with fetch to your API)
      const fetchElement = async () => {
        try {
          // Replace with a real API request
          const response = await fetch("/data/html-elements.json");
          const data = await response.json();

          if (data[elementId]) {
            setElement(data[elementId]);
            setLoading(false);

            // Trigger animation automatically after loading data
            setTimeout(() => {
              startNarration();
              setAnimationStarted(true);
            }, 500);
          } else {
            console.error(`Élément ${elementId} non trouvé`);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          setLoading(false);
        }
      };

      fetchElement();
    }
  }, [isOpen, elementId]);

  // Cleaning timeouts at closing
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  // Function to start narrative animation
  const startNarration = () => {
    setIsPaused(false);
    animateStep(narrativeState.currentStep);
  };

  // Stage animation function
  const animateStep = (stepIndex) => {
    if (!element || !element.animation || !element.animation.steps[stepIndex]) {
      return;
    }

    const step = element.animation.steps[stepIndex];

    // Animation sequence for this stage
    const sequence = [
      // Show title
      () => {
        setNarrativeState((prev) => ({ ...prev, showTitle: true }));
        if (!isPaused) scheduleNext(800);
      },

      // Start text typing animation
      () => {
        const text = step.text;
        let progress = 0;
        setNarrativeState((prev) => ({
          ...prev,
          showText: true,
          typingText: "",
          typingProgress: 0,
        }));

        // Character-by-character text-typing animation
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
            if (!isPaused) scheduleNext(1000);
          }
        }, 30); // Typing speed
      },

      // Show code
      () => {
        setNarrativeState((prev) => ({ ...prev, showCode: true }));
        if (!isPaused) scheduleNext(1000);
      },

      // View visual demo
      () => {
        setNarrativeState((prev) => ({ ...prev, showVisual: true }));

        // Wait longer for visualization
        if (!isPaused) scheduleNext(3000);
      },

      // Transition to next stage or end
      () => {
        // Gradually remove all
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
              setNarrativeState((prev) => ({
                ...prev,
                currentStep: stepIndex + 1,
              }));
              animateStep(stepIndex + 1);
            } else {
              // End of animation - show a summary or start again
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

    // Execute the first step of the sequence
    runSequence();

    // Executes animation sequence step by step
    function runSequence() {
      if (sequenceIndexRef.current < sequence.length) {
        sequence[sequenceIndexRef.current]();
      }
    }

    // Plan the next sequence step
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
      // Picking up where the animation left off
      startNarration();
    } else {
      // Pause by cleaning up timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typingRef.current) clearInterval(typingRef.current);
    }
  };

  // Restart animation
  const restartAnimation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typingRef.current) clearInterval(typingRef.current);

    setNarrativeState({
      currentStep: 0,
      showTitle: false,
      showText: false,
      showCode: false,
      showVisual: false,
      typingText: "",
      typingProgress: 0,
    });

    setTimeout(() => {
      startNarration();
    }, 300);
  };

  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Chargement..."
      >
        <div className="p-8 flex items-center justify-center h-full">
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
        ...customStyles,
        content: {
          ...customStyles.content,
          "--bg-color": bgColor,
          color: textColor,
        },
      }}
      contentLabel={`Démonstration de ${element.name}`}
      onAfterOpen={() => {
        // Start animation automatically if it hasn't started yet
        if (!animationStarted && element) {
          setTimeout(() => {
            startNarration();
            setAnimationStarted(true);
          }, 300);
        }
      }}
    >
      <div className="relative flex flex-col h-full">
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <h2 className="text-xl font-mono font-bold">{element.name}</h2>
          <div className="flex gap-2">
            <a
              href={`/element/${element.id}`}
              className="px-2 py-1 text-xs text-black dark:text-white bg-gray-100 dark:bg-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Page détaillée →
            </a>
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
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

        {/* Main narrative animation zone */}
        <div className="flex-grow flex flex-col bg-gray-100 dark:bg-gray-900 p-6 overflow-hidden">
          {/* Animated content zone */}
          <div className="flex-grow flex flex-col items-center justify-center">
            {/* Stage title with fade-in */}
            <div
              className={`text-center mb-6 transition-opacity duration-500 ${
                narrativeState.showTitle ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentStep?.title && (
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {currentStep.title}
                </h3>
              )}
            </div>

            {/* Text with typing effect */}
            <div
              className={`max-w-xl text-center mb-8 transition-opacity duration-500 min-h-[80px] ${
                narrativeState.showText ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-xl text-gray-800 dark:text-gray-200">
                {narrativeState.typingText}
                <span className="typing-cursor">|</span>
              </p>
            </div>

            {/* Visual demonstration with fade-in */}
            <div
              className={`w-full max-w-2xl transition-all duration-700 min-h-[200px] ${
                narrativeState.showVisual
                  ? "opacity-100 transform-none"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {currentStep?.visualDemo && (
                <div className="bg-white dark:bg-black p-8 rounded-lg shadow-lg mb-6 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                  <div
                    className="demo-container"
                    dangerouslySetInnerHTML={{
                      __html: currentStep.visualDemo.content,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Code with fade-in */}
            <div
              className={`w-full max-w-2xl transition-all duration-700 min-h-[100px] ${
                narrativeState.showCode
                  ? "opacity-100 transform-none"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {currentStep?.code && (
                <SyntaxHighlighter
                  language="html"
                  style={atomOneDark}
                  className="rounded-md shadow-lg"
                >
                  {currentStep.code}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        </div>

        {/* Animation controls at the bottom of the modal */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-between">
          {/* Progression */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Étape {narrativeState.currentStep + 1}/
              {element.animation?.steps.length || 1}
            </span>
            {/* Progress indicators */}
            <div className="flex gap-1 ml-2">
              {element.animation?.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    idx === narrativeState.currentStep
                      ? "bg-black dark:bg-white"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={restartAnimation}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
              title="Redémarrer"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </button>

            <button
              onClick={togglePause}
              className="p-2 rounded-md bg-black dark:bg-white text-white dark:text-black transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
              title={isPaused ? "Reprendre" : "Pause"}
            >
              {isPaused ? (
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
