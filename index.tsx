/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const app = document.getElementById('app');

// Simple state management
let state = {
  isAuthenticated: false,
  currentScreen: 'matching', // The screen to show after authentication
};

function setState(newState) {
  state = { ...state, ...newState };
  render();
}

// --- UI Component Builders ---

// FIX: Added types for function parameters to resolve errors on the 'options' object.
function createButton(text: string, onClick: (e: MouseEvent) => void, options: { className?: string; icon?: string; disabled?: boolean; } = {}) {
  const { className = 'btn-primary', icon, disabled = false } = options;
  const button = document.createElement('button');
  button.className = `btn ${className}`;
  button.onclick = onClick;
  button.disabled = disabled;

  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.className = 'material-symbols-outlined';
    iconEl.textContent = icon;
    button.appendChild(iconEl);
  }
  
  const textNode = document.createTextNode(text);
  button.appendChild(textNode);
  
  return button;
}


// --- Screen Renderers ---

function renderOnboarding() {
  const container = document.createElement('div');
  container.className = 'onboarding-container';
  
  container.innerHTML = `
    <h1>KinkConnect</h1>
    <p>Um espaço seguro para explorar, conectar e consentir.</p>
  `;

  const ageGate = document.createElement('div');
  ageGate.className = 'age-gate';
  ageGate.innerHTML = `<input type="checkbox" id="age-confirm" aria-labelledby="age-label"><label id="age-label" for="age-confirm">Confirmo que tenho 18 anos ou mais.</label>`;
  
  const enterButton = createButton('Entrar', () => {
    setState({ isAuthenticated: true });
  }, { disabled: true });

  const checkbox = ageGate.querySelector('#age-confirm');
  checkbox.addEventListener('change', (e) => {
    enterButton.disabled = !(e.target as HTMLInputElement).checked;
  });

  container.appendChild(ageGate);
  container.appendChild(enterButton);

  return container;
}


function renderBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navegação principal');

    const navItems = [
        { id: 'matching', icon: 'favorite', label: 'Matching' },
        { id: 'community', icon: 'groups', label: 'Comunidade' },
        { id: 'chat', icon: 'chat_bubble', label: 'Chat' },
        { id: 'profile', icon: 'person', label: 'Perfil' },
    ];

    navItems.forEach(({ id, icon, label }) => {
        const item = document.createElement('button');
        item.className = `nav-item ${state.currentScreen === id ? 'active' : ''}`;
        item.setAttribute('aria-label', label);
        item.setAttribute('aria-current', state.currentScreen === id ? 'page' : 'false');
        item.onclick = () => setState({ currentScreen: id });
        item.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${label}</span>
        `;
        nav.appendChild(item);
    });

    return nav;
}

function renderMatchingScreen() {
    const container = document.createElement('div');

    container.innerHTML = `
      <div class="matching-card">
        <div class="matching-card-image"></div>
        <div class="matching-card-info">
            <h2>Alex, 28</h2>
            <p>Switch | Buscando conexões genuínas</p>
            <div>
              <span class="chip">Iniciante</span>
              <span class="chip">Shibari</span>
              <span class="chip">Aftercare</span>
            </div>
        </div>
      </div>
      <div class="matching-actions">
        <button class="match-btn deny" aria-label="Dispensar"><span class="material-symbols-outlined">close</span></button>
        <button class="match-btn super-like" aria-label="Super Like"><span class="material-symbols-outlined">star</span></button>
        <button class="match-btn like" aria-label="Curtir"><span class="material-symbols-outlined">favorite</span></button>
      </div>
    `;
    return container;
}

function renderPlaceholderScreen(title, icon) {
    const container = document.createElement('div');
    container.className = 'placeholder-content';
    container.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <h2>${title}</h2>
        <p>Esta área está em construção.</p>
    `;
    return container;
}

function renderMainLayout() {
  const fragment = document.createDocumentFragment();
  const main = document.createElement('main');

  switch(state.currentScreen) {
      case 'matching':
          main.appendChild(renderMatchingScreen());
          break;
      case 'community':
          main.appendChild(renderPlaceholderScreen('Comunidade & Eventos', 'groups'));
          break;
      case 'chat':
          main.appendChild(renderPlaceholderScreen('Chat', 'chat_bubble'));
          break;
      case 'profile':
          main.appendChild(renderPlaceholderScreen('Seu Perfil', 'person'));
          break;
      default:
          main.appendChild(renderMatchingScreen());
  }

  fragment.appendChild(main);
  fragment.appendChild(renderBottomNav());

  return fragment;
}


// --- Main Render Function ---

function render() {
  if (!app) return;
  
  // Clear the app container
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  if (!state.isAuthenticated) {
    app.appendChild(renderOnboarding());
  } else {
    app.appendChild(renderMainLayout());
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', render);
