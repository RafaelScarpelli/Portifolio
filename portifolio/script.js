document.addEventListener('DOMContentLoaded', () => {

    const languageSelect = document.getElementById('language-select');
    let currentLang = languageSelect.value;
    let translations = {};
    const projectsContainer = document.getElementById('projects-grid');

    const repositories = [
        "platformer-2D",
        "Maven-Hibernate",
        "chess-system-java"
    ];

    fetch('traducao.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLang);
            loadProjects();
        })
        .catch(error => {
            console.error('Erro ao carregar traduções:', error);
        });

    function applyTranslations(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    languageSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        applyTranslations(currentLang);
    });

    function loadProjects() {
        repositories.forEach(repo => {
            fetch(`https://api.github.com/repos/RafaelScarpelli/${repo}`)
                .then(response => response.json())
                .then(data => {
                    const card = document.createElement('div');
                    card.classList.add('project-card');

                    const image = document.createElement('img');
                    image.src = `images/projects/${repo}.png`;
                    image.alt = repo;

                    const title = document.createElement('h3');
                    title.textContent = data.name;

                    const description = document.createElement('p');
                    description.textContent = data.description || translations[currentLang]['no-description'];

                    const link = document.createElement('a');
                    link.href = data.html_url;
                    link.target = '_blank';
                    link.textContent = translations[currentLang]['view-github'];

                    card.appendChild(image);
                    card.appendChild(title);
                    card.appendChild(description);
                    card.appendChild(link);

                    projectsContainer.appendChild(card);
                })
                .catch(err => {
                    console.error('Erro ao carregar repositório:', repo, err);
                    const errorMsg = document.createElement('p');
                    errorMsg.textContent = translations[currentLang]['error-loading'];
                    projectsContainer.appendChild(errorMsg);
                });
        });
    }

    document.getElementById("whatsapp-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const message = document.getElementById("message").value;
        const text = `Olá, meu nome é ${name}. ${message}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5544997635718&text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    });
});
