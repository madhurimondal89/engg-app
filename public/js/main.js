// Main JavaScript file for common functionality

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterCalculators(searchTerm);
        });
    }
});

// Filter calculators based on search term
function filterCalculators(searchTerm) {
    const calculatorLinks = document.querySelectorAll('.calc-link');
    const categoryCards = document.querySelectorAll('.category-card');
    
    calculatorLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        link.style.display = isVisible ? 'flex' : 'none';
    });
    
    // Hide categories with no visible calculators
    categoryCards.forEach(card => {
        const visibleLinks = card.querySelectorAll('.calc-link[style="display: flex"], .calc-link:not([style])');
        const hasVisibleLinks = Array.from(visibleLinks).some(link => 
            !link.style.display || link.style.display === 'flex'
        );
        card.style.display = hasVisibleLinks ? 'block' : 'none';
    });
}