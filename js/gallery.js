// ==========================
// Gallery Page JavaScript
// ==========================

let buildingsData = [];
let filteredBuildings = [];

document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});

async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) return;
    
    try {
        const data = await fetchJSON('data/buildings.json');
        
        if (!data || !data.buildings) {
            galleryGrid.innerHTML = '<p class="error-message">Unable to load gallery. Please check back later.</p>';
            return;
        }
        
        buildingsData = data.buildings;
        filteredBuildings = [...buildingsData];
        
        renderGallery(filteredBuildings);
        
        // Add animation to cards
        setTimeout(() => {
            const cards = document.querySelectorAll('.building-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('fade-in');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p class="error-message">Unable to load gallery. Please check back later.</p>';
    }
}

function renderGallery(buildings) {
    const galleryGrid = document.getElementById('galleryGrid');
    const noResults = document.getElementById('noResults');
    
    if (!galleryGrid) return;
    
    if (buildings.length === 0) {
        galleryGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    galleryGrid.innerHTML = buildings.map(building => {
        const tags = building.tags ? building.tags.slice(0, 3) : [];
        const readingTime = calculateReadingTime(building.fullStory || building.description);
        
        return `
            <div class="building-card hover-lift" data-id="${building.id}">
                <img src="${building.mainImage}" alt="${building.title}" class="building-card-image" loading="lazy">
                <div class="building-card-content">
                    <h3>${building.title}</h3>
                    <p class="building-location">${building.location}</p>
                    <p class="building-description">${truncateText(building.description, 120)}</p>
                    <div class="building-meta">
                        <span class="read-time">${readingTime} min read</span>
                        ${building.yearBuilt ? `<span>Built: ${building.yearBuilt}</span>` : ''}
                    </div>
                    ${tags.length > 0 ? `
                        <div class="building-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers to cards
    const cards = document.querySelectorAll('.building-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const buildingId = card.dataset.id;
            window.location.href = `stories/${buildingId}.html`;
        });
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Check for URL parameters on load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            // Capitalize first letter to match filter values
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.value = formattedCategory;
        }
    }
});
