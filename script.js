const searchInput = document.getElementById("search");
const suggestionsList = document.getElementById("suggestions");
const searchWrapper = searchInput.closest(".search-wrapper");

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Example API call function (replace URL with your real API endpoint)
async function fetchSuggestionsFromAPI(query) {
  if (!query) return [];
  try {
    searchWrapper.classList.add("loading");
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  } catch (e) {
    console.error("API Error:", e);
    return [];
  } finally {
    searchWrapper.classList.remove("loading");
  }
}

// Function to update suggestions
async function updateSuggestions(query) {
  suggestionsList.innerHTML = "";
  if (!query) {
    suggestionsList.style.display = "none";
    return;
  }

  const filtered = await fetchSuggestionsFromAPI(query);
  filtered.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.title || item;
    li.addEventListener("click", () => {
      searchInput.value = item.title || item;
      suggestionsList.style.display = "none";
    });
    suggestionsList.appendChild(li);
  });
  suggestionsList.style.display = filtered.length ? "block" : "none";
}

// Debounced version of updateSuggestions (300ms delay)
const debouncedUpdate = debounce(updateSuggestions, 300);

// Event listener using debounced function
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  debouncedUpdate(query);
});

document.addEventListener("click", (e) => {
  if (e.target !== searchInput) {
    suggestionsList.style.display = "none";
  }
});
