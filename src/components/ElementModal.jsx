import React, { useState } from "react";
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

const ElementModal = ({ isOpen, closeModal, element, theme = "light" }) => {
  // State to follow the animation steps
  const [currentStep, setCurrentStep] = useState(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Defining CSS variables for the theme
  const bgColor = theme === "dark" ? "#121212" : "white";
  const textColor = theme === "dark" ? "white" : "black";

  if (!element) return null;

  // Simulation of animation steps (to be replaced by real data)
  const animationSteps = element.animations?.[0]?.steps || [
    {
      text: "Étape initiale",
      codeHighlight: "<button>",
      visualEffect: "click-animation",
    },
    {
      text: "Propriétés de base",
      codeHighlight: 'type="submit"',
      visualEffect: "highlight-type",
    },
    {
      text: "Interactions",
      codeHighlight: "disabled",
      visualEffect: "disable-animation",
    },
  ];

  const nextStep = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openCodeModal = () => {
    setIsCodeModalOpen(true);
  };

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

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
          <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <h2 className="text-xl font-mono font-bold">{element.name}</h2>
            <div className="flex gap-2">
              <a
                href={`/element/${element.id}`}
                className="px-2 py-1 text-xs text-black dark:text-white bg-gray-100 dark:bg-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
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

          {/* Modal body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
            {/* Description */}
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {element.description}
            </p>

            {/* Interactive animation zone */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Animation interactive</h3>
                <div className="flex gap-1">
                  <button
                    onClick={openCodeModal}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Voir le code
                  </button>
                  <button
                    onClick={openPreviewModal}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    Prévisualiser
                  </button>
                </div>
              </div>

              {/* Animation content */}
              <div className="flex flex-col items-center py-8">
                <p className="text-center mb-6">
                  {animationSteps[currentStep].text}
                </p>

                {/* Demonstration area */}
                <div className="bg-white dark:bg-black p-4 rounded-md border border-gray-300 dark:border-gray-700 mb-6">
                  {element.name === "<button>" && (
                    <button
                      type={currentStep === 1 ? "submit" : "button"}
                      disabled={currentStep === 2}
                      className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Bouton de démonstration
                    </button>
                  )}
                </div>

                {/* Animation controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
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

                  <div className="flex gap-1 items-center">
                    {animationSteps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentStep
                            ? "bg-black dark:bg-white"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        aria-label={`Étape ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={currentStep === animationSteps.length - 1}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
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
              </div>
            </div>

            {/* Further information */}
            <div>
              <h3 className="font-semibold mb-2">Attributs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg mb-6">
                  <thead className="bg-gray-100 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Nom
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {element.attributes?.map((attr, idx) => (
                      <tr key={idx} className="bg-white dark:bg-black">
                        <td className="px-4 py-2 font-mono text-sm">
                          {attr.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                          {attr.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Related items */}
              {element.related && element.related.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Éléments liés</h3>
                  <div className="flex flex-wrap gap-2">
                    {element.related.map((rel, idx) => (
                      <a
                        key={idx}
                        href={`/element/${rel}`}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 font-mono text-sm"
                      >
                        {`<${rel}>`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <h3 className="font-medium">Code</h3>
          <button
            onClick={() => setIsCodeModalOpen(false)}
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
        <div className="p-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <SyntaxHighlighter language="html" style={atomOneDark}>
              {element.examples?.[0]?.code ||
                element.syntax ||
                '<button type="button">Texte du bouton</button>'}
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
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <h3 className="font-medium">Prévisualisation</h3>
          <button
            onClick={() => setIsPreviewModalOpen(false)}
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
        <div className="p-8 flex justify-center items-center">
          <div
            className="preview-container p-4 border border-gray-300 dark:border-gray-700 rounded-md"
            dangerouslySetInnerHTML={{
              __html:
                element.examples?.[0]?.code ||
                (element.name === "<button>"
                  ? '<button class="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md">Bouton</button>'
                  : ""),
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ElementModal;
