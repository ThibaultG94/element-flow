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
    <div>
      {/* Header */}
      <header>
        <div>
          <div>
            <div>
              <span>ElementFlow</span>
            </div>

            {/* Search bar */}
            <div>
              <div>
                <input
                  type="text"
                  placeholder="Rechercher un élément..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button>
                  <svg>
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
            <button>
              <svg>
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
      </header>

      {/* Main navigation */}
      <nav>
        <div>
          <div>
            <Link to="/html">HTML</Link>
            <Link to="/css">CSS</Link>
            <Link to="/javascript">JavaScript</Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>
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
