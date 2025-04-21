/**
 * Utilities to enhance your search
 */

// List of empty French words not to be included in the search
const STOP_WORDS = [
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "du",
  "de",
  "ce",
  "cette",
  "ces",
  "mon",
  "ma",
  "mes",
  "ton",
  "ta",
  "tes",
  "son",
  "sa",
  "ses",
  "et",
  "ou",
  "mais",
  "donc",
  "car",
  "ni",
  "que",
  "qui",
  "dans",
  "sur",
  "sous",
  "avec",
  "sans",
  "pour",
  "par",
  "en",
  "à",
  "au",
  "aux",
];

// List of synonyms and related terms to improve your search
const SEARCH_MAPPINGS = {
  // HTML
  balise: ["tag", "element", "html"],
  texte: ["text", "contenu", "typography"],
  lien: ["a", "link", "href", "url"],
  image: ["img", "picture", "photo"],
  formulaire: ["form", "input", "champ"],
  structure: ["document", "html", "body", "head"],

  // CSS
  style: ["css", "design", "apparence"],
  couleur: ["color", "rgb", "hex", "background"],
  mise: ["layout", "display", "position"],
  disposition: ["layout", "grid", "flex", "display"],
  grille: ["grid", "columns", "rows"],
  flex: ["flexbox", "display", "layout"],
  taille: ["size", "width", "height", "dimension"],

  // JavaScript
  variable: ["var", "let", "const", "valeur"],
  fonction: ["function", "method", "callback"],
  evenement: ["event", "listener", "click", "input"],
  promesse: ["promise", "async", "then", "await"],
  dom: ["document", "selector", "element", "node"],
  api: ["fetch", "http", "request", "ajax"],

  // React
  hook: ["useState", "useEffect", "useContext", "useRef"],
  composant: ["component", "jsx", "props", "state"],
  etat: ["state", "setState", "useState", "context"],
  props: ["properties", "parameters", "attributes"],

  // Vue
  vue: ["vuejs", "vue.js", "vue3"],
  component: ["composant", "vue component", "single file component", "sfc"],
  template: ["template", "modèle", "html"],
  directive: ["v-if", "v-for", "v-model", "v-on", "v-bind"],
  reactivity: ["réactivité", "reactive", "ref", "reactive", "computed"],
  composition: ["composition api", "setup", "ref", "reactive", "onMounted"],
  options: ["options api", "data", "methods", "computed", "watch"],
  lifecycle: ["lifecycle hooks", "created", "mounted", "updated", "unmounted"],

  // Python
  python: ["py", "python3", "script", "langage"],
  variables: ["var", "variable", "affectation", "assignation"],
  types: ["int", "str", "float", "list", "dict", "tuple", "set", "bool"],
  fonction: ["def", "function", "lambda", "méthode"],
  classe: ["class", "object", "instance", "poo", "oop"],
  boucle: ["for", "while", "iteration", "loop"],
  condition: ["if", "else", "elif", "conditionnelle"],
  importation: ["import", "from", "module", "package", "bibliothèque"],
};

/**
 * Normalize search terms by removing empty words and adding synonyms
 * @param {string} query - Search query
 * @returns {string[]} - Table of standardized terms
 */
export const normalizeSearchTerms = (query) => {
  // Convert to lower case and divide into words
  const terms = query.toLowerCase().trim().split(/\s+/);

  // Filter empty words
  const filteredTerms = terms.filter((term) => !STOP_WORDS.includes(term));

  // Working together to avoid duplication
  const expandedTerms = new Set(filteredTerms);

  // Add synonyms and related terms
  filteredTerms.forEach((term) => {
    if (SEARCH_MAPPINGS[term]) {
      SEARCH_MAPPINGS[term].forEach((synonym) => {
        expandedTerms.add(synonym);
      });
    }
  });

  return Array.from(expandedTerms);
};

/**
 * Calculates a relevance score between an item and search terms
 * @param {Object} element - Item to be evaluated
 * @param {string[]} terms - Search terms
 * @returns {number} - Relevance score
 */
export const calculateRelevance = (element, terms) => {
  let score = 0;
  const elementName = element.name.toLowerCase();
  const elementDesc = element.description
    ? element.description.toLowerCase()
    : "";

  // Exact name match (very important)
  const fullQuery = terms.join(" ");
  if (elementName === fullQuery) {
    score += 30;
  }

  // Match on each search term
  terms.forEach((term) => {
    // Match in name
    if (elementName.includes(term)) {
      // Match at beginning of name (more relevant)
      if (elementName.startsWith(term)) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // Match in description
    if (elementDesc.includes(term)) {
      score += 3;
    }

    // Match in attributes/properties
    if (element.attributes) {
      element.attributes.forEach((attr) => {
        if (attr.name.toLowerCase().includes(term)) {
          score += 2;
        }
      });
    }

    // Match in values (for CSS)
    if (element.values) {
      element.values.forEach((value) => {
        if (value.name.toLowerCase().includes(term)) {
          score += 2;
        }
      });
    }

    // Match in examples
    if (element.examples) {
      element.examples.forEach((example) => {
        if (example.title.toLowerCase().includes(term)) {
          score += 1;
        }
      });
    }

    // Match in category
    if (element.category && element.category.toLowerCase().includes(term)) {
      score += 1;
    }
  });

  return score;
};

/**
 * Performs a filtered and sorted search among a list of items
 * @param {Array} elements - List of search items
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results (optional)
 * @returns {Array} - Filtered and sorted results
 */
export const searchElements = (elements, query, limit = 8) => {
  if (!query.trim() || !elements || !elements.length) {
    return [];
  }

  const normalizedTerms = normalizeSearchTerms(query);

  // Filter and sort results by relevance
  const results = elements
    .map((element) => ({
      ...element,
      relevance: calculateRelevance(element, normalizedTerms),
    }))
    .filter((element) => element.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);

  // Limit the number of results
  return limit ? results.slice(0, limit) : results;
};

export default {
  normalizeSearchTerms,
  calculateRelevance,
  searchElements,
};
