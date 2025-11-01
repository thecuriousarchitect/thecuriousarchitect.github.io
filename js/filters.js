// ==========================
// Filters JavaScript
// ==========================

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});

function initFilters() {
    const regionFilter = document.getElementById('regionFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const eraFilter = document.getElementById('eraFilter');
    const resetButton = document.getElementById('resetFilters');
    
    if (!regionFilter || !categoryFilter || !eraFilter) return;
    
    // Add event listeners to filters
    regionFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    eraFilter.addEventListener('change', applyFilters);
    
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
    
    // Apply filters if URL parameters exist
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && categoryFilter) {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.value = formattedCategory;
        setTimeout(applyFilters, 500); // Wait for data to load
    }
}

function applyFilters() {
    const regionFilter = document.getElementById('regionFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const eraFilter = document.getElementById('eraFilter');
    
    if (!regionFilter || !categoryFilter || !eraFilter) return;
    
    const selectedRegion = regionFilter.value;
    const selectedCategory = categoryFilter.value;
    const selectedEra = eraFilter.value;
    
    filteredBuildings = buildingsData.filter(building => {
        const regionMatch = selectedRegion === 'all' || building.region === selectedRegion;
        const categoryMatch = selectedCategory === 'all' || building.category === selectedCategory;
        const eraMatch = selectedEra === 'all' || (building.era && building.era.includes(selectedEra));
        
        return regionMatch && categoryMatch && eraMatch;
    });
    
    renderGallery(filteredBuildings);
    
    // Update URL with current filters (optional)
    updateURL(selectedRegion, selectedCategory, selectedEra);
}

function resetFilters() {
    const regionFilter = document.getElementById('regionFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const eraFilter = document.getElementById('eraFilter');
    
    if (regionFilter) regionFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (eraFilter) eraFilter.value = 'all';
    
    filteredBuildings = [...buildingsData];
    renderGallery(filteredBuildings);
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
}

function updateURL(region, category, era) {
    const params = new URLSearchParams();
    
    if (region !== 'all') params.set('region', region);
    if (category !== 'all') params.set('category', category);
    if (era !== 'all') params.set('era', era);
    
    const newURL = params.toString() ? 
        `${window.location.pathname}?${params.toString()}` : 
        window.location.pathname;
    
    window.history.replaceState({}, '', newURL);
}

// Advanced filtering function (for future enhancements)
function filterByMultipleCriteria(buildings, criteria) {
    return buildings.filter(building => {
        return Object.keys(criteria).every(key => {
            if (!criteria[key] || criteria[key] === 'all') return true;
            
            if (Array.isArray(building[key])) {
                return building[key].includes(criteria[key]);
            }
            
            return building[key] === criteria[key];
        });
    });
}

// Search functionality (can be added later)
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                filteredBuildings = [...buildingsData];
            } else {
                filteredBuildings = buildingsData.filter(building => {
                    return (
                        building.title.toLowerCase().includes(searchTerm) ||
                        building.location.toLowerCase().includes(searchTerm) ||
                        building.description.toLowerCase().includes(searchTerm) ||
                        (building.architect && building.architect.toLowerCase().includes(searchTerm)) ||
                        (building.tags && building.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                    );
                });
            }
            
            renderGallery(filteredBuildings);
        }, 300));
    }
}
