const searchInput = document.getElementById("search");
const suggestionsList = document.getElementById("suggestions");
const searchWrapper = searchInput.closest(".search-wrapper");
const actionButton = document.getElementById("action-button");

let selectedIndex = -1;
let suggestions = [];
let selectedItem = null;

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

function highlightSuggestion(index) {
  const items = suggestionsList.querySelectorAll("li");
  items.forEach((item) => item.classList.remove("selected"));

  selectedIndex = index;
  if (index >= 0 && index < items.length) {
    items[index].classList.add("selected");
    items[index].scrollIntoView({ block: "nearest" });
  }
}

function performAction() {
  if (selectedItem) {
    // Example action - you can customize this
    console.log("Performing action with:", selectedItem);
    alert(`Action performed for: ${selectedItem.title || selectedItem}`);
  }
}

function updateActionButton(show, item = null) {
  actionButton.style.display = show ? "flex" : "none";
  setTimeout(() => actionButton.classList.toggle("visible", show), 0);
  selectedItem = item;
}

// Function to update suggestions
async function updateSuggestions(query) {
  suggestionsList.innerHTML = "";
  selectedIndex = -1;
  updateActionButton(false);

  if (!query) {
    suggestionsList.style.display = "none";
    return;
  }

  const filtered = await fetchSuggestionsFromAPI(query);
  suggestions = filtered; // Store for keyboard navigation

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.title || item;
    li.addEventListener("click", () => {
      searchInput.value = item.title || item;
      suggestionsList.style.display = "none";
      selectedIndex = -1;
      updateActionButton(true, item);
    });
    li.addEventListener("mouseover", () => {
      highlightSuggestion(index);
    });
    suggestionsList.appendChild(li);
  });

  suggestionsList.style.display = filtered.length ? "block" : "none";
}

// Keyboard navigation
searchInput.addEventListener("keydown", (e) => {
  const items = suggestionsList.querySelectorAll("li");

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (suggestionsList.style.display === "block") {
        highlightSuggestion(selectedIndex < items.length - 1 ? selectedIndex + 1 : 0);
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      if (suggestionsList.style.display === "block") {
        highlightSuggestion(selectedIndex > 0 ? selectedIndex - 1 : items.length - 1);
      }
      break;

    case "Enter":
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        searchInput.value = selected.title || selected;
        suggestionsList.style.display = "none";
        updateActionButton(true, selected);
        selectedIndex = -1;
      }
      break;

    case "Escape":
      suggestionsList.style.display = "none";
      selectedIndex = -1;
      updateActionButton(false);
      break;
  }
});

// Action button click handler
actionButton.addEventListener("click", performAction);

// Debounced version of updateSuggestions (300ms delay)
const debouncedUpdate = debounce(updateSuggestions, 300);

// Event listener using debounced function
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  debouncedUpdate(query);
});

document.addEventListener("click", (e) => {
  if (e.target !== searchInput && !e.target.closest(".action-button")) {
    suggestionsList.style.display = "none";
    selectedIndex = -1;
  }
});
