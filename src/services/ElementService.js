/**
 * Service to retrieve element data
 * Eventually, this service will make calls to the Strapi API.
 * For the moment, it loads static JSON data
 */

// Cache to store data already loaded
let elementsCache = {
  html: null,
  css: null,
  js: null,
};

/**
 * Loads a JSON file of element data
 * @param {string} type - Type of elements (html, css, js)
 * @returns {Promise<Object>} - The collection of elements
 */
const loadElements = async (type) => {
  if (elementsCache[type]) {
    return elementsCache[type];
  }

  try {
    // Load the JSON file corresponding to the type
    const response = await fetch(`/data/${type}-elements.json`);

    if (!response.ok) {
      throw new Error(`Impossible de charger les données (${response.status})`);
    }

    const data = await response.json();
    elementsCache[type] = data;
    return data;
  } catch (error) {
    console.error(`Erreur lors du chargement des éléments ${type}:`, error);
    throw error;
  }
};

/**
 * Retrieves a specific element by its identifier
 * @param {string} type - Element type (html, css, js)
 * @param {string} id - Element identifier
 * @returns {Promise<Object>} - Element data
 */
const getElement = async (type, id) => {
  try {
    const elements = await loadElements(type);
    return elements[id] || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'élément ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves all elements of a type
 * @param {string} type - Element type (html, css, js)
 * @returns {Promise<Array>} - List of items
 */
const getAllElements = async (type) => {
  try {
    const elements = await loadElements(type);
    // Convert object to array
    return Object.values(elements);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des éléments ${type}:`,
      error
    );
    throw error;
  }
};

export default {
  getElement,
  getAllElements,
};
