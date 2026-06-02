const title = document.getElementById('glitchText');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789[]#%&_<>*+";

const glitchEffect = (target) => {
    const originalText = target.dataset.text || target.innerText;
    let iterations = 0;
    const interval = setInterval(() => {
        target.innerText = originalText.split("")
            .map((letter, index) => {
                if(index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("");

        if(iterations >= originalText.length) clearInterval(interval);
        iterations += 1/3;
    }, 30);
};

if(title) {
    title.addEventListener('mouseover', () => glitchEffect(title));
    setTimeout(() => glitchEffect(title), 500);
}

const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.highlightable').forEach(codeBlock => {
    codeBlock.addEventListener('click', function() {
        let textToCopy;

        if (this.dataset.copy) {
            textToCopy = this.dataset.copy;
        } else {
            const clone = this.cloneNode(true);
            const feedback = clone.querySelector('.copy-feedback');
            if (feedback) feedback.remove();
            textToCopy = clone.innerText.trim();
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            this.classList.add('copied');
            setTimeout(() => this.classList.remove('copied'), 1500);
        });
    });
});

document.addEventListener('click', (e) => {
    const header = e.target.closest('.crypto-header');
    if (header) {
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.crypto-toggle');
        content.classList.toggle('active');
        toggle.textContent = content.classList.contains('active') ? '[-]' : '[+]';
        return;
    }
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const getTheme = () => document.documentElement.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const updateToggleText = () => {
        themeToggle.textContent = getTheme() === 'light' ? 'THEME: LIGHT' : 'THEME: DARK';
    };
    updateToggleText();
    themeToggle.addEventListener('click', () => {
        const next = getTheme() === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleText();
    });
}

// Vitae modal
(function () {
    const vitaeTab     = document.getElementById('vitae-tab');
    const modal        = document.getElementById('vitae-modal');
    const closeBtn     = document.getElementById('vitae-close');
    const overlay      = document.getElementById('vitae-modal-overlay');

    if (!vitaeTab || !modal) return;

    function openModal() {
        modal.removeAttribute('hidden');
        vitaeTab.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeModal() {
        modal.setAttribute('hidden', '');
        vitaeTab.classList.remove('active');
        document.body.style.overflow = '';
        vitaeTab.focus();
    }

    vitaeTab.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });
})();

// GitHub Projects Integration
(function() {
    const backupProjects = [
        {
            name: "coolSearch",
            description: "coolSearch is designed for extreme speed. While traditional search tools crawl your folders one by one, coolSearch talks directly to your hard drive's \"internal map\" (the Master File Table) to find every single file on your computer in less than a second. It combines the raw power of Rust with a sleek, modern React interface.",
            language: "TypeScript",
            stargazers_count: 3,
            forks_count: 0,
            html_url: "https://github.com/straculencuandrei/coolSearch",
            updated_at: "2026-05-15T12:00:00Z"
        },
        {
            name: "srs-modding-tools",
            description: "srs modding tools. Features - run game checks and verify module integrity. Extraction - tools to help extract and manage game archives. RE - scripts for searching strings and analyzing game logic.",
            language: "Python",
            stargazers_count: 1,
            forks_count: 0,
            html_url: "https://github.com/straculencuandrei/srs-modding-tools",
            updated_at: "2026-05-10T12:00:00Z"
        },
        {
            name: "low-level-kernel-experiments",
            description: "A collection of low-level kernel driver experiments and OS research written in C++ and Assembly. Explores memory isolation and process protection.",
            language: "C++",
            stargazers_count: 5,
            forks_count: 1,
            html_url: "https://github.com/straculencuandrei/low-level-kernel-experiments",
            updated_at: "2026-04-20T12:00:00Z"
        },
        {
            name: "binary-analyzer-tool",
            description: "Static and dynamic binary analysis scripts utilizing Capstone and Unicorn engines to inspect x86/x64 instruction flows.",
            language: "Python",
            stargazers_count: 2,
            forks_count: 0,
            html_url: "https://github.com/straculencuandrei/binary-analyzer-tool",
            updated_at: "2026-03-12T12:00:00Z"
        },
        {
            name: "crypto-wallet-verifier",
            description: "An offline cryptographic wallet integrity and signature verifier for public-private key validation.",
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            html_url: "https://github.com/straculencuandrei/crypto-wallet-verifier",
            updated_at: "2026-02-05T12:00:00Z"
        }
    ];

    let allProjects = [];
    let filteredProjects = [];
    let currentPage = 1;
    const pageSize = 6;

    const container = document.getElementById('projects-container');
    const loadingEl = document.getElementById('projects-loading');
    const errorEl = document.getElementById('projects-error');
    const fallbackEl = document.getElementById('projects-fallback-msg');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const paginationContainer = document.getElementById('projects-pagination-container');
    const searchInput = document.getElementById('project-search');
    const langFilter = document.getElementById('project-lang-filter');
    const sortSelect = document.getElementById('project-sort');

    if (!container) return;

    async function initProjects() {
        try {
            const response = await fetch('https://api.github.com/users/straculencuandrei/repos');
            if (!response.ok) throw new Error('API request failed');
            
            const repos = await response.json();
            // Filter out forks
            let fetched = repos.filter(repo => !repo.fork);
            
            // Check if we have at least 5 projects
            if (fetched.length < 5) {
                fallbackEl.style.display = 'block';
                // Merge with backup projects to ensure at least 5 and variety
                const fetchedNames = new Set(fetched.map(r => r.name.toLowerCase()));
                backupProjects.forEach(bp => {
                    if (!fetchedNames.has(bp.name.toLowerCase())) {
                        fetched.push(bp);
                    }
                });
            }
            allProjects = fetched;
        } catch (e) {
            console.error('Error fetching GitHub repos:', e);
            errorEl.style.display = 'block';
            fallbackEl.style.display = 'block';
            allProjects = backupProjects;
        } finally {
            loadingEl.style.display = 'none';
            setupLangFilter();
            applyFilterAndSort();
        }
    }

    function setupLangFilter() {
        const languages = new Set();
        allProjects.forEach(repo => {
            if (repo.language) languages.add(repo.language);
        });
        languages.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang;
            opt.textContent = lang.toUpperCase();
            langFilter.appendChild(opt);
        });
    }

    function applyFilterAndSort() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedLang = langFilter.value;
        const sortBy = sortSelect.value;

        // Filter
        filteredProjects = allProjects.filter(repo => {
            const matchesQuery = repo.name.toLowerCase().includes(query) || 
                                 (repo.description && repo.description.toLowerCase().includes(query));
            const matchesLang = !selectedLang || repo.language === selectedLang;
            return matchesQuery && matchesLang;
        });

        // Sort
        filteredProjects.sort((a, b) => {
            if (sortBy === 'stars') {
                return (b.stargazers_count || 0) - (a.stargazers_count || 0);
            } else {
                // Default: updated
                return (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0);
            }
        });

        currentPage = 1;
        renderProjects();
    }

    function renderProjects() {
        container.innerHTML = '';
        const limit = currentPage * pageSize;
        const toShow = filteredProjects.slice(0, limit);

        if (toShow.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--fg-dim); font-family: var(--font-mono);">
                [ NO PROJECTS MATCH THE SEARCH CRITERIA ]
            </div>`;
            paginationContainer.style.display = 'none';
            return;
        }

        toShow.forEach(repo => {
            let customClass = '';
            const lowerName = repo.name.toLowerCase();
            if (lowerName === 'coolsearch') {
                customClass = 'cool-search';
            } else if (lowerName === 'srs-modding-tools' || lowerName === 'srs-modding') {
                customClass = 'srs-modding';
            }

            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.className = `project-card ${customClass}`;
            
            card.innerHTML = `
                <div class="card-header">
                  <span>
                    <span class="project-title">${escapeHTML(repo.name)}</span>
                    &nbsp;&nbsp;
                    <span class="project-lang">| ${escapeHTML(repo.language || 'Plain Text')}</span>
                  </span>
                  <span class="project-status">[${repo.stargazers_count || 0} ★ / ${repo.forks_count || 0} ⑂]</span>
                </div>
                <div class="card-body">
                  <div>
                    <p class="project-desc">${escapeHTML(repo.description || 'Fără descriere disponibilă.')}</p>
                  </div>
                </div>
            `;
            container.appendChild(card);
        });

        if (filteredProjects.length > limit) {
            paginationContainer.style.display = 'block';
        } else {
            paginationContainer.style.display = 'none';
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Event listeners
    searchInput.addEventListener('input', applyFilterAndSort);
    langFilter.addEventListener('change', applyFilterAndSort);
    sortSelect.addEventListener('change', applyFilterAndSort);
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderProjects();
    });

    initProjects();
})();
