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
                    <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
                    </svg>
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
