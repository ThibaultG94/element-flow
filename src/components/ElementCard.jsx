import React, { useState } from "react";
import { Link } from "react-router";

// Element card component with modal and optional link
const ElementCard = ({ element, openModal, categoryLabel = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white hover:shadow-md transition-all bg-white dark:bg-gray-900 cursor-pointer"
      onClick={() => openModal(element)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link button to detailed page (visible on hover) */}
      {isHovered && (
        <Link
          to={`/element/${element.id}`}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
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
      <h3 className="font-mono text-lg font-medium text-black dark:text-white mb-1">
        {element.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {element.description}
      </p>
      <div className="text-xs font-medium px-2.5 py-0.5 inline-block rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {categoryLabel || element.category}
      </div>
    </div>
  );
};

export default ElementCard;
