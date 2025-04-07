import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import HtmlPage from "./pages/HtmlPage";
import CssPage from "./pages/CssPage";
import JsPage from "./pages/JsPage";
import ElementDetailPage from "./pages/ElementDetailPage";

const MainLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="cursor-pointer text-blue-600 dark:text-blue-400 text-2xl font-bold"
              >
                ElementFlow
              </Link>
            </div>

            {/* Search bar */}
            <div className="max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Rechercher un élément..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Dark/light theme button */}
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer"
              onClick={() => document.documentElement.classList.toggle("dark")}
            >
              <svg
                className="w-5 h-5 text-gray-800 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b broder-gray-200 dark:border-gray-700">
        <div className="mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              to="/html"
              className="px-3 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:*:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400"
            >
              HTML
            </Link>
            <Link
              to="/css"
              className="px-3 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:*:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400"
            >
              CSS
            </Link>
            <Link
              to="/javascript"
              className="px-3 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:*:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400"
            >
              JavaScript
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/html" element={<HtmlPage />} />
          <Route path="/css" element={<CssPage />} />
          <Route path="/javascript" element={<JsPage />} />
          <Route path="/element/:id" element={<ElementDetailPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
