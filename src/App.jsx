import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import HtmlPage from "./pages/HtmlPage";
import CssPage from "./pages/CssPage";
import JsPage from "./pages/JsPage";
import ElementDetailPage from "./pages/ElementDetailPage";

// Navigation link component with animation and active state
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (location.pathname.startsWith("/element/") &&
      to === `/${location.pathname.split("/")[2]}`);

  return (
    <Link
      to={to}
      className={`px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
};

const MainLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for user preference on initial load
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-black shadow-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo and title */}
            <Link
              to="/"
              className="cursor-pointer text-black dark:text-white text-2xl font-bold transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ElementFlow
            </Link>

            {/* Main navigation*/}
            <nav className="flex items-center gap-2">
              <NavLink to="/html">HTML</NavLink>
              <NavLink to="/css">CSS</NavLink>
              <NavLink to="/javascript">JavaScript</NavLink>
            </nav>

            <div className="flex items-center gap-4">
              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
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

              {/* Dark/light theme button */}
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                ) : (
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
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/html" element={<HtmlPage />} />
                <Route path="/css" element={<CssPage />} />
                <Route path="/javascript" element={<JsPage />} />
                <Route path="/element/:id" element={<ElementDetailPage />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
