// requestbin/static/js/script.js

// Method to Tailwind color mapping for badges
const METHOD_COLORS = {
  GET: "bg-blue-600",
  POST: "bg-green-600",
  PUT: "bg-yellow-600",
  DELETE: "bg-red-600",
  PATCH: "bg-purple-600",
  HEAD: "bg-gray-500",
  OPTIONS: "bg-indigo-600",
};

const requestLog = document.getElementById("request-log");
const loadingIndicator = document.getElementById("loading-indicator");
const newRequestAlert = document.getElementById("new-request-alert");

/**
 * Helper function to create the HTML for a single request card.
 * @param {object} req - The request object.
 * @param {boolean} isNew - Flag to apply new request animation classes.
 * @returns {string} - The full HTML for the request card.
 */
function createRequestCardHTML(req, isNew = false) {
  const methodColor = METHOD_COLORS[req.method] || "bg-gray-500";
  const timestamp = new Date(req.timestamp).toLocaleTimeString();

  // Pretty-print and highlight JSON body if possible
  let formattedBody = req.body;
  let bodyCodeBlock = "";
  let bodyIsJson = false;

  try {
    if (req.body.trim().startsWith("{") || req.body.trim().startsWith("[")) {
      const bodyObj = JSON.parse(req.body);
      formattedBody = JSON.stringify(bodyObj, null, 2);
      bodyIsJson = true;
    }
  } catch (e) {
    // Not a valid JSON, use plain text
  }

  if (formattedBody) {
    // Use PrismJS for syntax highlighting
    const language = bodyIsJson ? "json" : "clike";
    const highlightedBody = Prism.highlight(
      formattedBody,
      Prism.languages[language],
      language
    );
    bodyCodeBlock = `
            <pre class="overflow-x-auto text-sm p-3 bg-gray-900 rounded-md mt-2"><code class="language-${language}">${highlightedBody}</code></pre>
        `;
  }

  const headerRows = Object.entries(req.headers)
    .map(
      ([key, value]) =>
        `<tr>
            <td class="px-4 py-2 font-mono text-gray-400 border-t border-gray-600 w-1/4">${key}</td>
            <td class="px-4 py-2 font-mono text-gray-300 border-t border-gray-600">${value}</td>
        </tr>`
    )
    .join("");

  // Card structure with collapsible sections
  return `
        <div class="request-card bg-gray-700 p-6 rounded-xl shadow-lg transition-opacity duration-1000 ${
          isNew ? "opacity-0 scale-95" : "opacity-100"
        }" id="req-${req.timestamp.replace(/[:.]/g, "")}">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-600">
                <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 text-sm font-semibold rounded-full text-white ${methodColor}">${
    req.method
  }</span>
                    <span class="text-xl font-medium text-gray-200">${
                      req.path
                    }</span>
                </div>
                <div class="text-sm text-gray-400">
                    Received at: ${timestamp}
                </div>
            </div>

            <div class="mb-4">
                <button onclick="toggleCollapse(this, 'headers')" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                    Headers (${
                      Object.keys(req.headers).length
                    }) <span class="ml-2 text-xl">▼</span>
                </button>
                <div id="headers-content" class="hidden mt-2 bg-gray-800 rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-600">
                        <tbody class="divide-y divide-gray-700">
                            ${headerRows}
                        </tbody>
                    </table>
                </div>
            </div>

            ${
              req.body
                ? `
            <div class="mb-4">
                <button onclick="toggleCollapse(this, 'body')" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                    Body (${req.body.length} bytes) <span class="ml-2 text-xl">▼</span>
                </button>
                <div id="body-content" class="hidden">
                    ${bodyCodeBlock}
                </div>
            </div>
            `
                : `<p class="text-gray-400 italic">No request body.</p>`
            }
            
            ${
              Object.keys(req.query_params).length > 0
                ? `
            <div class="mb-2">
                <button onclick="toggleCollapse(this, 'query-params')" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
                    Query Params <span class="ml-2 text-xl">▼</span>
                </button>
                <div id="query-params-content" class="hidden mt-2 bg-gray-800 p-3 rounded-md">
                    ${Object.entries(req.query_params)
                      .map(
                        ([key, value]) =>
                          `<p class="font-mono text-sm"><span class="text-yellow-400">${key}:</span> <span class="text-gray-300">${value}</span></p>`
                      )
                      .join("")}
                </div>
            </div>
            `
                : `<p class="text-gray-400 italic">No query parameters.</p>`
            }

        </div>
    `;
}

// Global function to handle collapsible sections (attached to the window for inline HTML calls)
window.toggleCollapse = function (button, sectionId) {
  const card = button.closest(".request-card");
  const content = card.querySelector(`#${sectionId}-content`);
  const icon = button.querySelector("span");

  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    icon.textContent = "▲";
  } else {
    content.classList.add("hidden");
    icon.textContent = "▼";
  }
};

/**
 * Animates the "New Request Arrived!" alert.
 */
function animateNewRequestAlert() {
  newRequestAlert.classList.remove("hidden");
  // 1. Start from right (translate-x-full) and move into view (translate-x-0)
  setTimeout(() => {
    newRequestAlert.classList.remove("translate-x-full");
  }, 10);

  // 2. Hide after a short delay
  setTimeout(() => {
    newRequestAlert.classList.add("translate-x-full");
  }, 2000);

  // 3. Remove 'hidden' when animation is complete
  setTimeout(() => {
    newRequestAlert.classList.add("hidden");
  }, 2500);
}

/**
 * Fetches the initial log and then sets up a polling mechanism
 * to simulate a real-time feed (to keep it a pure Flask/JS demo).
 */
let lastLogLength = 0;
function fetchAndRenderLog() {
  fetch("/bin/demo/log")
    .then((response) => response.json())
    .then((requests) => {
      loadingIndicator.classList.add("hidden");

      // Check for new requests
      const newRequests = requests.slice(0, requests.length - lastLogLength);

      // Render new requests at the top
      newRequests.forEach((req) => {
        const newCard = document.createElement("div");
        newCard.innerHTML = createRequestCardHTML(req, true);

        // Prepend the new card to the log container
        requestLog.prepend(newCard.firstChild);

        // Animate the card after a very short delay
        const insertedCard = requestLog.firstChild;
        setTimeout(() => {
          insertedCard.classList.remove("opacity-0", "scale-95");
        }, 50);

        // Show the global alert for new requests
        animateNewRequestAlert();
      });

      // Re-render the whole log if the number of new requests is less than the current log length
      // This prevents duplicate rendering but requires checking if an element already exists.
      if (requests.length > lastLogLength) {
        // If this is the initial load (lastLogLength === 0) or there are new items,
        // we clear the container and re-render everything to be safe.
        if (lastLogLength === 0) {
          requestLog.innerHTML = ""; // Clear the initial loading indicator
          requests.forEach((req) => {
            const card = document.createElement("div");
            card.innerHTML = createRequestCardHTML(req, false);
            requestLog.appendChild(card.firstChild);
          });
        }
        lastLogLength = requests.length;
      }

      if (requests.length === 0) {
        requestLog.innerHTML = `
                    <div class="text-center p-10 bg-gray-700 rounded-xl shadow-inner">
                        <p class="text-xl text-yellow-400">Log is Empty!</p>
                        <p class="text-sm text-gray-400 mt-2">
                            Send a request to <code class="text-white">/bin/demo</code> to see it appear here.
                        </p>
                    </div>
                `;
      }
    })
    .catch((error) => {
      console.error("Error fetching log:", error);
      loadingIndicator.innerHTML =
        '<p class="text-xl text-red-500">Error fetching log data.</p>';
    })
    .finally(() => {
      // Poll for updates every 1.5 seconds (simulates real-time)
      setTimeout(fetchAndRenderLog, 1500);
    });
}

// Start the log fetching process when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only run on the view page
  if (document.getElementById("request-log")) {
    fetchAndRenderLog();
  }
});
