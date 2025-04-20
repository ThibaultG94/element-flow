import React, { useState, useEffect, useRef } from "react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import Modal from "react-modal";
import "../styles/animations.css";

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
    height: "auto",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    overflow: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
  },
};

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
if (document.getElementById("root")) {
  Modal.setAppElement("#root");
} else {
  Modal.setAppElement(document.body);
}

const NarrativeElementModal = ({
  isOpen,
  closeModal,
  elementId,
  theme = "light",
  dataType,
}) => {
  // States
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Refs
  const timeoutRef = useRef(null);
  const typingRef = useRef(null);
  const codeTypingRef = useRef(null);
  const sequenceIndexRef = useRef(0);
  const modalContentRef = useRef(null);

  // CSS variables for the theme
  const bgColor = theme === "dark" ? "#121212" : "white";
  const textColor = theme === "dark" ? "white" : "black";
  const headerFooterBg = theme === "dark" ? "black" : "white";
  const contentBg = theme === "dark" ? "#1a1a1a" : "#f3f4f6";
  const borderColor = theme === "dark" ? "#333" : "#e5e7eb";

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Reset auto-scroll state when a new modal opens
  useEffect(() => {
    if (isOpen) {
      setShouldAutoScroll(true);
    }
  }, [isOpen]);

  // Loading data
  useEffect(() => {
    if (isOpen && elementId) {
      setLoading(true);
      setAnimationStarted(false);
      setDataLoaded(false);
      resetNarrativeState();
      clearAllTimers();

      const fetchElement = async () => {
        try {
          const response = await fetch(`/data/${dataType}-elements.json`);
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();

          if (data[elementId]) {
            setElement(data[elementId]);
            setDataLoaded(true);
          } else {
            setElement(null);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          setElement(null);
        } finally {
          setLoading(false);
        }
      };

      fetchElement();
    } else if (!isOpen) {
      setElement(null);
      setLoading(true);
      setDataLoaded(false);
      setAnimationStarted(false);
      clearAllTimers();
      resetNarrativeState();
    }
  }, [isOpen, elementId, dataType]);

  // Starting the animation
  useEffect(() => {
    if (dataLoaded && !animationStarted && element && !loading && isOpen) {
      setNarrativeState((prev) => ({
        ...prev,
        showTitle: false,
        showText: false,
        showCode: false,
        showVisual: false,
      }));

      timeoutRef.current = setTimeout(() => {
        startNarration();
        setAnimationStarted(true);
      }, 100);
    }
  }, [dataLoaded, animationStarted, element, loading, isOpen]);

  // Cleaning
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // --- Scrolling functions ---

  // Detect manual scrolling
  const handleScroll = () => {
    if (!modalContentRef.current) return;

    const container = modalContentRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      20;

    // If the user scrolls manually, adapt auto-scroll
    setShouldAutoScroll(isAtBottom);
  };

  // Scroll down
  const scrollToBottom = () => {
    if (modalContentRef.current && shouldAutoScroll) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  };

  // Trigger scrolling after a content change
  const handleContentChange = () => {
    // Use requestAnimationFrame to wait for DOM update
    requestAnimationFrame(scrollToBottom);
  };

  // --- Utility functions ---

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
    sequenceIndexRef.current = 0;
  };

  const clearAllTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
    if (codeTypingRef.current) clearInterval(codeTypingRef.current);
    timeoutRef.current = null;
    typingRef.current = null;
    codeTypingRef.current = null;
  };

  // --- Animation logic ---

  const startNarration = () => {
    setIsPaused(false);
    animateStep(narrativeState.currentStep);
  };

  const animateStep = (stepIndex) => {
    if (!element?.animation?.steps?.[stepIndex]) {
      return;
    }

    const step = element.animation.steps[stepIndex];

    // Animation sequence
    const sequence = [
      // 1. Title
      () => {
        setNarrativeState((prev) => ({ ...prev, showTitle: true }));
        handleContentChange();
        if (!isPaused) scheduleNext(800);
      },

      // 2. Text
      () => {
        const textToType = step.text || "";
        if (!textToType) {
          if (!isPaused) scheduleNext(100);
          return;
        }

        let progress = 0;
        setNarrativeState((prev) => ({
          ...prev,
          showText: true,
          typingText: "",
          typingProgress: 0,
        }));
        handleContentChange();

        if (typingRef.current) clearInterval(typingRef.current);

        typingRef.current = setInterval(() => {
          if (isPaused) return;

          if (progress < textToType.length) {
            progress++;
            setNarrativeState((prev) => ({
              ...prev,
              typingText: textToType.substring(0, progress),
              typingProgress: progress,
            }));

            // Scroll every 5 characters
            if (progress % 5 === 0) {
              handleContentChange();
            }
          } else {
            clearInterval(typingRef.current);
            typingRef.current = null;
            handleContentChange();
            if (!isPaused) scheduleNext(800);
          }
        }, 30);
      },

      // 3. Code
      () => {
        const codeToType = step.code || "";
        if (!codeToType) {
          if (!isPaused) scheduleNext(100);
          return;
        }

        let codeProgress = 0;
        setNarrativeState((prev) => ({
          ...prev,
          showCode: true,
          typingCode: "",
          typingCodeProgress: 0,
        }));
        handleContentChange();

        if (codeTypingRef.current) clearInterval(codeTypingRef.current);

        codeTypingRef.current = setInterval(() => {
          if (isPaused) return;

          if (codeProgress < codeToType.length) {
            codeProgress++;

            setNarrativeState((prevState) => ({
              ...prevState,
              typingCode: codeToType.substring(0, codeProgress),
              typingCodeProgress: codeProgress,
            }));
          } else {
            clearInterval(codeTypingRef.current);
            codeTypingRef.current = null;
            handleContentChange();
            if (!isPaused) scheduleNext(800);
          }
        }, 15);
      },

      // 4. Visual
      () => {
        if (!step.visualDemo?.content) {
          if (!isPaused) scheduleNext(100);
          return;
        }
        setNarrativeState((prev) => ({ ...prev, showVisual: true }));
        handleContentChange();
        if (!isPaused) scheduleNext(2500);
      },

      // 5. Transition
      () => {
        if (typingRef.current) clearInterval(typingRef.current);
        if (codeTypingRef.current) clearInterval(codeTypingRef.current);

        if (!isPaused) {
          timeoutRef.current = setTimeout(() => {
            if (stepIndex < element.animation.steps.length - 1) {
              setNarrativeState((prev) => ({
                ...prev,
                currentStep: stepIndex + 1,
                showTitle: false,
                showText: false,
                showCode: false,
                showVisual: false,
                typingText: "",
                typingProgress: 0,
                typingCode: "",
                typingCodeProgress: 0,
              }));
              sequenceIndexRef.current = 0;
              animateStep(stepIndex + 1);
            } else {
              setIsPaused(true);
              setNarrativeState((prev) => ({
                ...prev,
                showTitle: true,
                showText: true,
                typingText:
                  "Animation terminée. Cliquez sur lecture pour revoir.",
                showCode: true,
                showVisual: true,
              }));
              handleContentChange();
            }
          }, 800);
        }
      },
    ];

    const runSequence = () => {
      if (
        !isPaused &&
        sequenceIndexRef.current >= 0 &&
        sequenceIndexRef.current < sequence.length
      ) {
        sequence[sequenceIndexRef.current]();
      }
    };

    const scheduleNext = (delay) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (!isPaused) {
          sequenceIndexRef.current++;
          runSequence();
        }
      }, delay);
    };

    sequenceIndexRef.current = 0;
    runSequence();
  };

  // --- Controls ---

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);

    if (newPaused) {
      clearAllTimers();
    } else {
      startNarration();
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex === narrativeState.currentStep && !isPaused) {
      return;
    }

    clearAllTimers();
    setIsPaused(true);

    const targetStep = element?.animation?.steps?.[stepIndex];
    if (targetStep) {
      setNarrativeState({
        currentStep: stepIndex,
        showTitle: true,
        showText: true,
        showCode: !!targetStep.code,
        showVisual: !!targetStep.visualDemo?.content,
        typingText: targetStep.text || "",
        typingProgress: (targetStep.text || "").length,
        typingCode: targetStep.code || "",
        typingCodeProgress: (targetStep.code || "").length,
      });

      setShouldAutoScroll(true);
      handleContentChange();
    }
  };

  const restartAnimation = () => {
    clearAllTimers();
    resetNarrativeState();
    setIsPaused(false);
    setShouldAutoScroll(true);

    timeoutRef.current = setTimeout(() => {
      startNarration();
    }, 100);
  };

  // --- Rendering ---

  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            ...loaderStyles.content,
            backgroundColor:
              theme === "dark"
                ? "rgba(18, 18, 18, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
          },
          overlay: loaderStyles.overlay,
        }}
        contentLabel="Chargement..."
        ariaHideApp={false}
      >
        <div className="flex items-center justify-center p-8">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === "dark" ? "border-white" : "border-black"
            }`}
          ></div>
        </div>
      </Modal>
    );
  }

  if (!element) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            ...customStyles.content,
            backgroundColor: bgColor,
            color: textColor,
            height: "auto",
            minHeight: "150px",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          },
          overlay: customStyles.overlay,
        }}
        contentLabel="Erreur de chargement"
        ariaHideApp={false}
      >
        <div className="flex flex-col items-center gap-4">
          <p>Impossible de charger les informations pour cet élément.</p>
          <button
            onClick={closeModal}
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Fermer
          </button>
        </div>
      </Modal>
    );
  }

  const currentStepData =
    element.animation?.steps?.[narrativeState.currentStep];

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
      ariaHideApp={false}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className="flex justify-between items-center py-2 px-4 border-b sticky top-0 z-20"
          style={{ backgroundColor: headerFooterBg, borderColor: borderColor }}
        >
          <h2 className="text-lg font-mono font-semibold">{element.name}</h2>
          <button
            onClick={closeModal}
            className={`p-1.5 rounded-full transition-colors ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            aria-label="Fermer"
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

        {/* Scrollable content area */}
        <div
          className="flex-grow overflow-y-auto -webkit-overflow-scrolling-touch"
          style={{ backgroundColor: contentBg }}
          ref={modalContentRef}
          onScroll={handleScroll}
        >
          <div className="flex items-start justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl">
              {currentStepData && (
                <>
                  {/* Title */}
                  <div
                    className={`text-center mb-4 transition-all duration-500 ease-out ${
                      narrativeState.showTitle
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2"
                    }`}
                  >
                    {currentStepData.title && (
                      <h3
                        className={`text-xl md:text-2xl font-semibold ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {currentStepData.title}
                      </h3>
                    )}
                  </div>

                  {/* Text */}
                  <div
                    className={`w-full px-4 sm:px-8 text-center mb-6 min-h-[60px] transition-opacity duration-500 ease-out ${
                      narrativeState.showText ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p
                      className={`text-base md:text-lg ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {narrativeState.typingText}
                      {narrativeState.typingProgress <
                        (currentStepData.text || "").length && (
                        <span className="typing-cursor"></span>
                      )}
                    </p>
                  </div>

                  {/* Code and visual demo */}
                  <div
                    className={`w-full flex ${
                      isMobile ? "flex-col gap-6" : "flex-row gap-6 items-start"
                    }`}
                  >
                    {/* Code */}
                    {currentStepData.code && (
                      <div
                        className={`transition-all duration-700 ease-out ${
                          isMobile ? "w-full" : "w-1/2"
                        } ${
                          narrativeState.showCode
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        }`}
                      >
                        {narrativeState.typingCodeProgress > 0 && (
                          <div className="code-typing rounded-md shadow-lg overflow-hidden bg-[#282c34]">
                            <SyntaxHighlighter
                              language="html"
                              style={atomOneDark}
                              customStyle={{
                                margin: 0,
                                padding: "1rem",
                                fontSize: isMobile ? "0.8rem" : "0.9rem",
                                backgroundColor: "#282c34",
                              }}
                              showLineNumbers={false}
                              wrapLongLines={true}
                            >
                              {narrativeState.typingCode}
                            </SyntaxHighlighter>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Visual demo */}
                    {currentStepData.visualDemo?.content && (
                      <div
                        className={`transition-all duration-700 ease-out delay-200 ${
                          isMobile ? "w-full" : "w-1/2"
                        } ${
                          narrativeState.showVisual
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-lg shadow-lg border transition-colors duration-300 ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div
                            className="demo-container"
                            dangerouslySetInnerHTML={{
                              __html: currentStepData.visualDemo.content,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="h-16"></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className="py-2 px-4 border-t flex items-center justify-between sticky bottom-0 z-20"
          style={{ backgroundColor: headerFooterBg, borderColor: borderColor }}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Étape {narrativeState.currentStep + 1} /{" "}
              {element.animation?.steps?.length || 1}
            </span>
            <div className="flex gap-1.5 ml-1">
              {element.animation?.steps?.map((_, idx) => (
                <button
                  key={`step-dot-${idx}`}
                  onClick={() => goToStep(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${
                    idx === narrativeState.currentStep
                      ? `${
                          theme === "dark" ? "bg-blue-400" : "bg-blue-600"
                        } scale-125`
                      : `${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`
                  }`}
                  aria-label={`Aller à l'étape ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={restartAnimation}
              className={`p-1.5 rounded-md transition-colors control-button touch-manipulation ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              title="Redémarrer"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

            <button
              onClick={togglePause}
              className={`p-1.5 rounded-md transition-colors control-button touch-manipulation ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              title={isPaused ? "Reprendre" : "Pause"}
            >
              {isPaused ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm5 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                    clipRule="evenodd"
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
