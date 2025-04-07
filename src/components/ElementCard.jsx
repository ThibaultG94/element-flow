import React, { useState } from "react";
import { Link } from "react-router";

// Element map component with modal and optional link
const ElementCard = ({
  element,
  openModal,
  colorType = "blue",
  categoryLabel = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Colors by type (HTML, CSS, JS)
  const colors = {
    blue: {
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-500",
      tag: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    indigo: {
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500",
      tag: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    },
    yellow: {
      hoverBorder: "hover:border-yellow-400 dark:hover:border-yellow-500",
      tag: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
  };

  const colorSettings = colors[colorType] || colors.blue;

  return (
    <div
      className={`relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${colorSettings.hoverBorder} hover:shadow-md transition-all bg-white dark:bg-gray-800 cursor-pointer`}
      onClick={() => openModal(element)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link button to detailed page (visible on hover) */}
      {isHovered && (
        <Link
          to={`/element/${element.id}`}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="w-4 h-4 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </Link>
      )}

      {/* Card contents */}
      <h3 className="font-mono text-lg font-medium text-gray-900 dark:text-white mb-1">
        {element.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {element.description}
      </p>
      <div
        className={`text-xs font-medium px-2.5 py-0.5 inline-block rounded-full ${colorSettings.tag}`}
      >
        {categoryLabel || element.category}
      </div>
    </div>
  );
};

export default ElementCard;
