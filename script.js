// Sample data for demonstration (you can replace this with your API endpoint)
const sampleData = [
    'JavaScript Programming',
    'Python Development',
    'Web Development',
    'Machine Learning',
    'Data Science',
    'Artificial Intelligence',
    'React Framework',
    'Node.js Development',
    'Vue.js Framework',
    'Angular Framework'
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let debounceTimer;

    // Add input event listener
    searchInput.addEventListener('input', (e) => {
        // Clear the previous timer
        clearTimeout(debounceTimer);

        // Set a new timer (debounce for 300ms)
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.trim().toLowerCase();
            
            if (searchTerm.length === 0) {
                searchResults.innerHTML = '';
                return;
            }

            // In a real application, this would be an API call
            // For demonstration, we're using the sample data
            performSearch(searchTerm);
        }, 300);
    });

    function performSearch(searchTerm) {
        // Simulate AJAX call
        // In a real application, you would replace this with a fetch call to your API
        const results = sampleData.filter(item => 
            item.toLowerCase().includes(searchTerm)
        );

        displayResults(results, searchTerm);
    }

    function displayResults(results, searchTerm) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    No results found for "${searchTerm}"
                </div>
            `;
            return;
        }

        const resultsHtml = results.map(result => {
            // Highlight the matching text
            const highlightedText = highlightMatch(result, searchTerm);
            return `
                <div class="result-item">
                    ${highlightedText}
                </div>
            `;
        }).join('');

        searchResults.innerHTML = resultsHtml;
    }

    function highlightMatch(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
});

// For a real API implementation, you would use something like this:
/*
async function performSearch(searchTerm) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        displayResults(data, searchTerm);
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResults.innerHTML = '<div class="no-results">Error fetching results</div>';
    }
}
*/
