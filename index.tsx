/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- MOCK DATA ---
const userProfile = {
  name: "Maria Silva",
  age: 26,
  location: "São Paulo, SP",
  avatarInitial: "M",
  tags: ["Switch", "Intermediário", "Verificado"],
  stats: { matches: 42, conversations: 8, photos: 6 },
  about: "Explorando o mundo BDSM com curiosidade e responsabilidade. Busco conexões genuínas baseadas em confiança e comunicação aberta.",
  memberSince: "Janeiro 2024",
  interests: ["Rope Play", "Impact Play", "Controle Mental", "Aftercare"],
  hardLimits: ["Sem marcas permanentes", "Sem humilhação extrema", "Sem exposição pública"],
};

const communityEvents = [
  {
    title: "Workshop: Introdução ao Shibari",
    category: "Workshop",
    date: "14/02/2024",
    time: "19:00",
    location: "Centro Cultural, São Paulo",
    description: "Aprenda as técnicas básicas de amarração japonesa em um ambiente seguro e educativo.",
    attendees: 24,
    capacity: 30,
  },
  {
    title: "Munch: Encontro Social BDSM",
    category: "Social",
    date: "19/02/2024",
    time: "20:00",
    location: "Café Central, Rio de Janeiro",
    description: "Encontro casual para conhecer pessoas da comunidade em um ambiente vanilla.",
    attendees: 18,
    capacity: 25,
  },
];

const chatConversation = {
    partner: { name: "Alexandra", status: "Online", avatarInitial: "A" },
    messages: [
        { sender: 'partner', text: "Oi! Vi seu perfil e adorei sua abordagem sobre consentimento", time: "14:20" },
        { sender: 'me', text: "Obrigada! É fundamental termos essas conversas abertas", time: "14:22" },
        { sender: 'partner', text: "Concordo totalmente. Que tal conversarmos sobre nossos limites?", time: "14:25" },
        { sender: 'me', text: "Claro! Prefiro sempre começar estabelecendo uma base de confiança", time: "14:27" },
    ]
};


const app = document.getElementById('app');

// --- STATE MANAGEMENT ---
let state = {
  isAuthenticated: false,
  currentScreen: 'profile', // 'discover', 'community', 'messages', 'profile'
  activeView: 'main', // 'main', 'checklist', 'video-check'
};

function setState(newState) {
  state = { ...state, ...newState };
  render();
}

// --- UI COMPONENT BUILDERS ---
// FIX: Added types for function parameters to resolve TypeScript errors on options destructuring.
function createButton(text: string, onClick: (e: MouseEvent) => void, options: { className?: string; icon?: string; disabled?: boolean } = {}) {
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

function createIcon(name) {
    const iconEl = document.createElement('span');
    iconEl.className = 'material-symbols-outlined';
    iconEl.textContent = name;
    return iconEl;
}

// --- SCREEN RENDERERS ---

function renderOnboarding() {
  const container = document.createElement('div');
  container.className = 'onboarding-container';
  container.innerHTML = `
    <h1>Conexões Autênticas na Comunidade BDSM</h1>
    <p>Encontre pessoas que compartilham seus interesses em um ambiente seguro, respeitoso e baseado no consentimento.</p>
    <input type="email" placeholder="Seu melhor email" aria-label="Seu melhor email">
  `;
  const enterButton = createButton('Começar Grátis', () => {
    setState({ isAuthenticated: true, currentScreen: 'discover' });
  });
  container.appendChild(enterButton);
  return container;
}

function renderBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Navegação principal');

    const navItems = [
        { id: 'discover', icon: 'favorite', label: 'Discover' },
        { id: 'community', icon: 'groups', label: 'Community' },
        { id: 'messages', icon: 'chat_bubble', label: 'Messages' },
        { id: 'profile', icon: 'person', label: 'Profile' },
    ];

    navItems.forEach(({ id, icon, label }) => {
        const item = document.createElement('button');
        item.className = `nav-item ${state.currentScreen === id ? 'active' : ''}`;
        item.setAttribute('aria-label', label);
        item.setAttribute('aria-current', state.currentScreen === id ? 'page' : 'false');
        item.onclick = () => setState({ currentScreen: id, activeView: 'main' });
        item.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${label}</span>
        `;
        nav.appendChild(item);
    });

    return nav;
}

function renderDiscoverScreen() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="discover-card">
        <div class="discover-card-image"></div>
        <div class="discover-card-info">
            <h2>Alex, 28</h2>
            <p>Switch | Buscando conexões genuínas</p>
            <div>
              <span class="chip">Iniciante</span>
              <span class="chip">Shibari</span>
              <span class="chip">Aftercare</span>
            </div>
        </div>
      </div>
      <div class="discover-actions">
        <button class="discover-btn deny" aria-label="Dispensar"><span class="material-symbols-outlined">close</span></button>
        <button class="discover-btn super-like" aria-label="Super Like"><span class="material-symbols-outlined">star</span></button>
        <button class="discover-btn like" aria-label="Curtir"><span class="material-symbols-outlined">favorite</span></button>
      </div>
    `;
    return container;
}

function renderProfileScreen() {
    const container = document.createElement('div');
    
    // Header
    const header = document.createElement('header');
    header.className = 'profile-header';
    header.innerHTML = `
        <div class="profile-avatar">
            ${userProfile.avatarInitial}
            <div class="online-indicator"></div>
        </div>
        <h2>${userProfile.name}, ${userProfile.age}</h2>
        <p><span class="material-symbols-outlined" style="font-size: 1em;">location_on</span> ${userProfile.location}</p>
        <div class="profile-tags">
            ${userProfile.tags.map(tag => `<span class="chip ${tag === 'Verificado' ? 'chip-accent' : 'chip-primary'}">${tag}</span>`).join('')}
        </div>
    `;
    
    // Stats
    const stats = document.createElement('div');
    stats.className = 'profile-stats';
    stats.innerHTML = `
        <div class="stat-item"><div class="count">${userProfile.stats.matches}</div><div class="label">Matches</div></div>
        <div class="stat-item"><div class="count">${userProfile.stats.conversations}</div><div class="label">Conversas</div></div>
        <div class="stat-item"><div class="count">${userProfile.stats.photos}</div><div class="label">Fotos</div></div>
    `;

    // About Card
    const aboutCard = document.createElement('div');
    aboutCard.className = 'card';
    aboutCard.innerHTML = `
        <h3>Sobre mim</h3>
        <p>${userProfile.about}</p>
        <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 1rem;"><span class="material-symbols-outlined" style="font-size: 1em;">calendar_today</span> Membro desde ${userProfile.memberSince}</p>
    `;

    // Interests & Limits Card
    const interestsCard = document.createElement('div');
    interestsCard.className = 'card';
    interestsCard.innerHTML = `
        <div class="card-header">
            <h3>Interesses</h3>
        </div>
        <div>${userProfile.interests.map(i => `<span class="chip">${i}</span>`).join('')}</div>
        <hr style="border-color: var(--border-color); margin: 1rem 0;">
        <div class="card-header">
            <span class="material-symbols-outlined" style="color: var(--danger-color);">warning</span>
            <h3>Limites Rígidos</h3>
        </div>
        <div>${userProfile.hardLimits.map(l => `<span class="chip chip-danger">${l}</span>`).join('')}</div>
    `;

    // Settings Card
    const settingsCard = document.createElement('div');
    settingsCard.className = 'card';
    settingsCard.innerHTML = `
        <h3>Configurações</h3>
        <div class="settings-list">
            <div class="setting-item"><span class="material-symbols-outlined">settings</span> Configurações da conta</div>
            <div class="setting-item"><span class="material-symbols-outlined">shield</span> Privacidade e segurança</div>
            <div class="setting-item"><span class="material-symbols-outlined">verified_user</span> Verificação de perfil</div>
        </div>
    `;

    container.appendChild(header);
    container.appendChild(stats);
    container.appendChild(aboutCard);
    container.appendChild(interestsCard);
    container.appendChild(settingsCard);
    return container;
}

function renderCommunityScreen() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="community-header">
            <h2>Comunidade</h2>
            <p>Participe de eventos, workshops e encontros.</p>
        </div>
        <div class="community-grid">
            <div class="category-card">
                <span class="material-symbols-outlined">cable</span>
                <h4>Workshop</h4>
                <p>12 eventos</p>
            </div>
            <div class="category-card">
                <span class="material-symbols-outlined">local_bar</span>
                <h4>Social</h4>
                <p>8 eventos</p>
            </div>
            <div class="category-card">
                <span class="material-symbols-outlined">school</span>
                <h4>Educacional</h4>
                <p>15 eventos</p>
            </div>
            <div class="category-card">
                <span class="material-symbols-outlined">celebration</span>
                <h4>Festa Privada</h4>
                <p>4 eventos</p>
            </div>
        </div>

        <h3>Próximos Eventos</h3>
        ${communityEvents.map(event => `
            <div class="event-card">
                <div class="event-card-header">
                    <h4>${event.title}</h4>
                    <span class="chip">${event.category}</span>
                </div>
                <div class="event-meta">
                    <span><span class="material-symbols-outlined">calendar_today</span> ${event.date}</span>
                    <span><span class="material-symbols-outlined">schedule</span> ${event.time}</span>
                    <span><span class="material-symbols-outlined">location_on</span> ${event.location}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${event.description}</p>
                <div class="event-footer">
                    <span class="attendees"><span class="material-symbols-outlined">groups</span> ${event.attendees}/${event.capacity}</span>
                    <progress value="${event.attendees}" max="${event.capacity}"></progress>
                    <a href="#" class="btn-details">Ver detalhes <span class="material-symbols-outlined">arrow_forward</span></a>
                </div>
            </div>
        `).join('')}

        <div class="card">
            <h3>Diretrizes da Comunidade</h3>
            <ul style="list-style-position: inside; color: var(--text-secondary); font-size: 0.9rem;">
                <li>Respeite os limites e consentimento de todos os participantes.</li>
                <li>Mantenha conversas respeitosas e inclusivas.</li>
                <li>Não compartilhe informações pessoais de outros membros.</li>
                <li>Denuncie comportamentos inadequados imediatamente.</li>
            </ul>
        </div>
    `;
    return container;
}


function renderMessagesScreen() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';

    // Chat Header
    container.innerHTML = `
      <div class="chat-header">
        <div class="avatar">${chatConversation.partner.avatarInitial}</div>
        <div class="info">
          <h3>${chatConversation.partner.name}</h3>
          <p>${chatConversation.partner.status}</p>
        </div>
        <div class="actions">
          <span class="material-symbols-outlined">more_vert</span>
        </div>
      </div>
    `;

    const mainContent = document.createElement('div');
    mainContent.style.flexGrow = '1';
    mainContent.style.overflowY = 'auto';

    if (state.activeView === 'checklist') {
        mainContent.appendChild(renderChecklistView());
    } else {
        // Default to chat view
        mainContent.innerHTML = `
            <div class="chat-messages">
            ${chatConversation.messages.map(msg => `
                <div class="message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}">
                ${msg.text}
                <div class="timestamp">${msg.time}</div>
                </div>
            `).join('')}
            </div>
        `;
    }
    
    // Input Area
    const inputArea = document.createElement('div');
    inputArea.className = 'chat-input-area';
    inputArea.innerHTML = `
        <div class="chat-input-container">
            <button class="icon-btn"><span class="material-symbols-outlined">sentiment_satisfied</span></button>
            <input type="text" placeholder="Digite sua mensagem...">
            <button class="icon-btn"><span class="material-symbols-outlined">lightbulb</span></button>
            <button class="send-btn"><span class="material-symbols-outlined">send</span></button>
        </div>
        <div class="chat-actions">
            <button class="btn btn-secondary"><span class="material-symbols-outlined">videocam</span> Video-Check</button>
            <button id="checklist-btn" class="btn btn-secondary"><span class="material-symbols-outlined">checklist</span> Checklist</button>
        </div>
        <p class="encryption-note"><span class="material-symbols-outlined" style="font-size: 0.8rem;">lock</span> Esta conversa é criptografada de ponta a ponta</p>
    `;

    // FIX: Added a null check and used a generic querySelector to fix the type error on 'onclick'.
    const checklistBtn = inputArea.querySelector<HTMLButtonElement>('#checklist-btn');
    if (checklistBtn) {
        checklistBtn.onclick = () => {
            setState({ activeView: state.activeView === 'checklist' ? 'main' : 'checklist' });
        };
    }

    container.appendChild(mainContent);
    container.appendChild(inputArea);
    return container;
}

function renderChecklistView() {
    const container = document.createElement('div');
    container.className = 'checklist-container';
    container.innerHTML = `
        <div class="checklist-header">
            <h2>Checklist de Segurança</h2>
        </div>
        <div class="checklist-progress">
            <div class="progress-step active">Pré-Sessão</div>
            <div class="progress-step">Durante</div>
            <div class="progress-step">Pós-Sessão</div>
        </div>
        <div class="checklist-section">
            <h3><span class="material-symbols-outlined">radio_button_unchecked</span> Pré-Sessão</h3>
            <div class="checklist-item"><div class="check-circle"></div> Limites rígidos e flexíveis foram discutidos</div>
            <div class="checklist-item"><div class="check-circle"></div> Palavras de segurança foram estabelecidas</div>
            <div class="checklist-item"><div class="check-circle"></div> Fronteiras físicas e emocionais estão claras</div>
            <div class="checklist-item"><div class="check-circle"></div> Plano de aftercare foi definido</div>
            <div class="checklist-item"><div class="check-circle"></div> Ambos estão sóbrios e em condições de consentir</div>
        </div>
        <div class="alert-box">
            <p><strong>Checklist Incompleto:</strong> Complete todos os itens antes de prosseguir. A segurança de ambos é prioridade.</p>
        </div>
    `;
    return container;
}


function renderMainLayout() {
  const fragment = document.createDocumentFragment();
  const main = document.createElement('main');

  // Special case for Messages screen as it has its own layout
  if (state.currentScreen === 'messages') {
    main.style.padding = '0';
    main.style.paddingBottom = '6rem';
    main.appendChild(renderMessagesScreen());
  } else {
    switch(state.currentScreen) {
        case 'discover':
            main.appendChild(renderDiscoverScreen());
            break;
        case 'community':
            main.appendChild(renderCommunityScreen());
            break;
        case 'profile':
            main.appendChild(renderProfileScreen());
            break;
        default:
            main.appendChild(renderDiscoverScreen());
    }
  }

  fragment.appendChild(main);
  fragment.appendChild(renderBottomNav());

  return fragment;
}

// --- MAIN RENDER FUNCTION ---
function render() {
  if (!app) return;
  
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  if (!state.isAuthenticated) {
    app.appendChild(renderOnboarding());
  } else {
    app.appendChild(renderMainLayout());
  }
}

document.addEventListener('DOMContentLoaded', render);
