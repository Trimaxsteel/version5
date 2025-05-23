// Load content from JSON
fetch('data.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load data');
    return res.json();
  })
  .then(data => {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    data.achievements.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.year ? `${item.title} (${item.year})` : item.title;
      li.className = 'mb-2';
      achievementsList.appendChild(li);
    });

    const hobbiesList = document.getElementById('hobbies-list');
    hobbiesList.innerHTML = '';
    data.hobbies.forEach(hobby => {
      const li = document.createElement('li');
      li.textContent = hobby;
      li.className = 'mb-2';
      hobbiesList.appendChild(li);
    });

    const testimonialsList = document.getElementById('testimonials-list');
    testimonialsList.innerHTML = '';
    data.testimonials.forEach(testi => {
      const li = document.createElement('li');
      li.textContent = `"${testi.comment}" — ${testi.name}`;
      li.className = 'mb-2';
      testimonialsList.appendChild(li);
    });
  })
  .catch(err => {
    console.error('Error loading data:', err);
    document.getElementById('achievements-list').textContent = 'Failed to load achievements.';
    document.getElementById('hobbies-list').textContent = 'Failed to load hobbies.';
    document.getElementById('testimonials-list').textContent = 'Failed to load testimonials.';
  });

// Quote from API with fallback to data.json
fetch('https://api.quotable.io/random')
  .then(res => {
    if (!res.ok) throw new Error('API error');
    return res.json();
  })
  .then(q => {
    document.getElementById('quote-text').textContent = `"${q.content}"`;
    document.getElementById('quote-author').textContent = q.author ? `— ${q.author}` : '';
  })
  .catch(() => {
    // Fallback: try to load a random quote from data.json
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.quotes.length);
          const q = data.quotes[randomIndex];
          document.getElementById('quote-text').textContent = `"${q.text || q.content}"`;
          document.getElementById('quote-author').textContent = q.author ? `— ${q.author}` : '';
        } else {
          document.getElementById('quote-text').textContent = 'Could not load quote.';
        }
      })
      .catch(() => {
        document.getElementById('quote-text').textContent = 'Could not load quote.';
      });
  });

// Hamburger toggle
const toggleBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
toggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('hidden');
  navMenu.classList.toggle('show');
});

// Scroll to top
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  darkToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark);
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
  darkToggle.textContent = 'Light Mode';
}

// Spinner
window.addEventListener('load', () => {
  const spinner = document.getElementById('spinner');
  setTimeout(() => {
    spinner.style.display = 'none';
  }, 500);
});