import React from "react";

const LoadingIndicator = ({ size = "medium", theme = "light" }) => {
  // Define sizes
  const sizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  // Define colors according to theme
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const spinnerColor = theme === "dark" ? "border-white" : "border-black";

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-2 ${borderColor} border-t-2 ${spinnerColor} rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingIndicator;
