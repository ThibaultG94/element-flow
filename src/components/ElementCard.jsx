import React, { useState } from "react";
import { Link } from "react-router";

// Element card component with modal and optional link
const ElementCard = ({ element, openModal, categoryLabel = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative rounded-lg p-5 cursor-pointer transition-all duration-300 ${
        isHovered
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
      }`}
      onClick={() => openModal(element)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link button to detailed page (visible on hover) */}
      {isHovered && (
        <Link
          to={`/element/${element.id}`}
          className={`absolute top-3 right-3 p-2 rounded-full z-10 transition-all duration-300 ${
            isHovered
              ? "bg-white text-black dark:bg-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={(e) => e.stopPropagation()}
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </Link>
      )}

      {/* Card contents */}
      <h3 className="font-mono text-lg font-medium mb-2">{element.name}</h3>
      <p
        className={`text-sm mb-4 transition-colors duration-300 ${
          isHovered
            ? "text-gray-200 dark:text-gray-800"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        {element.description}
      </p>
      <div
        className={`text-xs font-medium px-2.5 py-1 inline-block rounded-full transition-colors duration-300 ${
          isHovered
            ? "bg-white text-black dark:bg-black dark:text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }`}
      >
        {categoryLabel || element.category}
      </div>
    </div>
  );
};

export default ElementCard;
