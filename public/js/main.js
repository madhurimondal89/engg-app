// Main JavaScript file for common functionality

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function () {
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
        themeToggle.addEventListener('click', function () {
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
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            filterCalculators(searchTerm);
        });
    }
});

// Filter calculators based on search term
function filterCalculators(searchTerm) {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        const links = card.querySelectorAll('.calc-link');

        const cardMatch = title.includes(searchTerm) || desc.includes(searchTerm);

        let hasVisibleLink = false;
        links.forEach(link => {
            const linkText = link.textContent.toLowerCase();
            const linkMatch = linkText.includes(searchTerm);

            if (cardMatch || linkMatch) {
                link.style.display = 'flex';
                hasVisibleLink = true;
            } else {
                link.style.display = 'none';
            }
        });

        card.style.display = hasVisibleLink ? 'block' : 'none';
    });

    // Hide empty sections
    document.querySelectorAll('section.categories').forEach(section => {
        const visibleCards = Array.from(section.querySelectorAll('.category-card')).filter(card => card.style.display !== 'none');
        section.style.display = visibleCards.length > 0 ? 'block' : 'none';
    });
}