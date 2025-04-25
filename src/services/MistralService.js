/**
 * Service for interacting with the Mistral AI API
 * Used for intelligent checking of exercise answers
 */

// Ideally, store this key in environment variables (.env)
// VITE_MISTRAL_API_KEY=your_api_key
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Check an exercise answer using the Mistral API
 * @param {Object} exercise - The complete exercise
 * @param {any} userAnswer - The answer provided by the user
 * @param {string} technology - The technology involved (html, css, js, typescript, vue, react, python...)
 * @returns {Promise<Object>} - Evaluation results
 */
export const checkExerciseAnswer = async (
  exercise,
  userAnswer,
  technology = "general"
) => {
  try {
    // Check if the API key is available
    if (!MISTRAL_API_KEY) {
      console.warn(
        "Clé API Mistral non configurée, utilisation de la vérification basique"
      );
      return fallbackCheck(exercise, userAnswer);
    }

    // Build the prompt according to exercise type and technology
    const prompt = buildPromptForExercise(exercise, userAnswer, technology);

    // Call for Mistral API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest", // or another available model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2, // Low temperature for more deterministic responses
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API Mistral:", errorData);
      return fallbackCheck(exercise, userAnswer);
    }

    const data = await response.json();
    return parseAIResponse(data, exercise);
  } catch (error) {
    console.error("Erreur lors de la vérification avec Mistral:", error);
    return fallbackCheck(exercise, userAnswer);
  }
};

/**
 * Builds a prompt appropriate to the type of exercise and technology
 */
function buildPromptForExercise(exercise, userAnswer, technology) {
  const { type, question, correctAnswer, options } = exercise;

  // Obtain technology-specific information
  const techInfo = getTechnologyContext(technology);

  // Common basis for prompt
  let prompt = `
Tu es un assistant éducatif spécialisé en ${techInfo.name}. Tu dois évaluer la réponse d'un élève.

Question: ${question}
`;

  // Customized for each type of exercise
  switch (type) {
    case "qcm":
      prompt += `
Options disponibles:
${options.map((opt, idx) => `${idx}. ${opt}`).join("\n")}
Réponse correcte: Option ${correctAnswer} (${options[correctAnswer]})
Réponse de l'élève: Option ${userAnswer} (${options[userAnswer]})
`;
      break;

    case "vrai_faux":
      prompt += `
Réponse correcte: ${correctAnswer ? "Vrai" : "Faux"}
Réponse de l'élève: ${userAnswer ? "Vrai" : "Faux"}
`;
      break;

    case "completion":
      prompt += `
Extrait de code à compléter: ${exercise.codeTemplate.replace("[?]", "___")}
Réponse correcte: ${correctAnswer}
Réponse de l'élève: ${userAnswer}
`;
      break;

    case "debugging":
      prompt += `
Code avec bug:
\`\`\`${techInfo.codeLanguage}
${exercise.buggyCode}
\`\`\`

Correction attendue: 
\`\`\`${techInfo.codeLanguage}
${correctAnswer}
\`\`\`

Correction de l'élève:
\`\`\`${techInfo.codeLanguage}
${userAnswer}
\`\`\`
`;
      break;
  }

  // Final instructions for AI
  prompt += `
Évalue si la réponse de l'élève est correcte dans le contexte de ${techInfo.name}. Réponds EXACTEMENT dans ce format:
CORRECT: [oui/non]
EXPLICATION: [explication concise et pédagogique, maximum 2 phrases]

${techInfo.evaluationGuidelines}
`;

  return prompt;
}

/**
 * Returns technology-specific contextual information
 */
function getTechnologyContext(technology) {
  const defaultContext = {
    name: "développement web",
    codeLanguage: "javascript",
    evaluationGuidelines:
      "Pour les exercices de code, évalue le sens et la logique plutôt que la syntaxe exacte. Des variations mineures sont acceptables tant que la solution fonctionne.",
  };

  const contexts = {
    html: {
      name: "HTML",
      codeLanguage: "html",
      evaluationGuidelines:
        "Évalue si la structure HTML est correcte. Les attributs peuvent être dans un ordre différent mais doivent être présents avec les bonnes valeurs.",
    },
    css: {
      name: "CSS",
      codeLanguage: "css",
      evaluationGuidelines:
        "Évalue si les sélecteurs et les propriétés CSS sont corrects. L'ordre des propriétés peut varier mais les valeurs doivent être équivalentes.",
    },
    js: {
      name: "JavaScript",
      codeLanguage: "javascript",
      evaluationGuidelines:
        "Pour les exercices JavaScript, évalue si la logique est correcte. Des approches alternatives qui produisent le même résultat sont acceptables.",
    },
    javascript: {
      name: "JavaScript",
      codeLanguage: "javascript",
      evaluationGuidelines:
        "Pour les exercices JavaScript, évalue si la logique est correcte. Des approches alternatives qui produisent le même résultat sont acceptables.",
    },
    typescript: {
      name: "TypeScript",
      codeLanguage: "typescript",
      evaluationGuidelines:
        "Pour TypeScript, vérifie que les types sont corrects et que la logique est conforme. Le typage statique est important dans l'évaluation.",
    },
    react: {
      name: "React",
      codeLanguage: "jsx",
      evaluationGuidelines:
        "Pour les exercices React, vérifie la structure des composants, l'utilisation correcte des hooks et la gestion de l'état.",
    },
    vue: {
      name: "Vue.js",
      codeLanguage: "vue",
      evaluationGuidelines:
        "Pour Vue.js, évalue l'utilisation correcte des directives, des propriétés réactives et des composants.",
    },
    python: {
      name: "Python",
      codeLanguage: "python",
      evaluationGuidelines:
        "Pour Python, vérifie la syntaxe et l'approche. Les solutions Pythoniques sont privilégiées mais d'autres approches valides sont acceptables.",
    },
  };

  return contexts[technology.toLowerCase()] || defaultContext;
}

/**
 * Analyzes the API response to extract the result
 */
function parseAIResponse(apiResponse, exercise) {
  const content = apiResponse.choices[0].message.content;

  // Evaluation extraction
  const isCorrectMatch = content.match(/CORRECT:\s*(oui|non)/i);
  const isCorrect = isCorrectMatch
    ? isCorrectMatch[1].toLowerCase() === "oui"
    : false;

  // Explanation extraction
  const explanationMatch = content.match(/EXPLICATION:\s*(.+?)(?:\n|$)/is);
  const explanation = explanationMatch
    ? explanationMatch[1].trim()
    : exercise.explanation;

  return {
    isCorrect,
    explanation: explanation || exercise.explanation,
    aiResponse: content, // For debugging
  };
}

/**
 * Simple backup check if API fails
 */
function fallbackCheck(exercise, userAnswer) {
  let isCorrect = false;

  // Basic verification based on type
  switch (exercise.type) {
    case "qcm":
    case "vrai_faux":
      isCorrect = userAnswer === exercise.correctAnswer;
      break;

    case "completion":
      // Flexible checking to allow minor variations
      isCorrect =
        userAnswer.toLowerCase().trim() ===
        exercise.correctAnswer.toLowerCase().trim();
      break;

    case "debugging":
      // For debugging exercises, we make a very basic comparison
      // This method is imperfect, but serves as a last resort
      const normalizedUserAnswer = userAnswer.replace(/\s+/g, " ").trim();
      const normalizedCorrectAnswer = exercise.correctAnswer
        .replace(/\s+/g, " ")
        .trim();
      isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
      break;
  }

  return {
    isCorrect,
    explanation: exercise.explanation,
    fallback: true, // Indicates that the backup method has been used
  };
}

export default {
  checkExerciseAnswer,
};
