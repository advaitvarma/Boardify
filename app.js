/**
 * ASTRASCORE - Shared Logic & Mock Backend
 * Handles Theme, Routing logic, and LocalStorage State
 */

// --- 1. STATE MANAGEMENT & MOCK DATA ---
const defaultData = [
    {
        id: "demo-football",
        name: "Inter-High Football Final",
        category: "sports",
        subcategory: "Football",
        status: "live",
        scale: "Inter-school",
        config: { duration: 90, halves: 2 },
        teams: [
            { name: "Red Dragons", color: "bg-red-500", score: 2 },
            { name: "Blue Knights", color: "bg-blue-500", score: 1 }
        ],
        timer: { minutes: 42, seconds: 15, isRunning: true, period: "1st Half" },
        logs: ["Match Started", "Goal! Red Dragons (12')", "Goal! Blue Knights (25')", "Goal! Red Dragons (40')"]
    },
    {
        id: "demo-quiz",
        name: "Science Wizard 2025",
        category: "academic",
        subcategory: "Quiz",
        status: "upcoming",
        scale: "City",
        config: { rounds: 5 },
        teams: [
            { name: "Team Alpha", score: 0 },
            { name: "Team Beta", score: 0 },
            { name: "Team Gamma", score: 0 }
        ],
        timer: { minutes: 0, seconds: 0, isRunning: false, period: "Round 1" },
        logs: []
    }
];

// Initialize Data
function initData() {
    if (!localStorage.getItem('astra_events')) {
        localStorage.setItem('astra_events', JSON.stringify(defaultData));
    }
}

function getEvents() {
    return JSON.parse(localStorage.getItem('astra_events')) || [];
}

function getEvent(id) {
    const events = getEvents();
    return events.find(e => e.id === id);
}

function saveEvent(updatedEvent) {
    const events = getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
        events[index] = updatedEvent;
        localStorage.setItem('astra_events', JSON.stringify(events));
        return true;
    }
    return false; // New event
}

function createNewEvent(eventData) {
    const events = getEvents();
    events.push(eventData);
    localStorage.setItem('astra_events', JSON.stringify(events));
}

// --- 2. THEME HANDLING ---
function initTheme() {
    const savedTheme = localStorage.getItem('astra_theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('astra_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if(btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// --- 3. PAGE ROUTING & LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    initData();
    initTheme();

    // Global Theme Toggle Listener
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Page Specific Logic based on Body ID
    const pageId = document.body.id;

    if (pageId === 'dashboard-page') renderDashboard();
    if (pageId === 'create-page') initWizard();
    if (pageId === 'admin-page') initAdmin();
    if (pageId === 'board-page') initBoard();
});

/* --- DASHBOARD LOGIC --- */
function renderDashboard() {
    const grid = document.getElementById('scoreboard-grid');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('category-filter');
    const events = getEvents();

    function render(filter = '', category = 'all') {
        grid.innerHTML = '';
        const filtered = events.filter(e => {
            const matchesText = e.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCat = category === 'all' || e.category === category;
            return matchesText && matchesCat;
        });

        filtered.forEach(e => {
            const card = document.createElement('div');
            card.className = `bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-l-8 ${getCategoryColor(e.category)} relative overflow-hidden group`;
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 rounded-full">${e.subcategory}</span>
                    <span class="px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(e.status)}">${e.status}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-1">${e.name}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${e.scale || 'Local Event'}</p>
                <div class="flex gap-3">
                    <a href="admin.html?id=${e.id}" class="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition shadow-md shadow-indigo-500/30">Admin</a>
                    <a href="board.html?id=${e.id}" class="flex-1 text-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-lg font-medium transition">View</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    render();

    searchInput.addEventListener('input', (e) => render(e.target.value, filterSelect.value));
    filterSelect.addEventListener('change', (e) => render(searchInput.value, e.target.value));
}

/* --- WIZARD LOGIC --- */
function initWizard() {
    let currentStep = 1;
    let wizardData = { teams: [], config: {} };

    const showStep = (step) => {
        document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('hidden'));
        document.getElementById(`step-${step}`).classList.remove('hidden');
        
        // Update Stepper UI
        document.querySelectorAll('.stepper-dot').forEach((dot, idx) => {
            if (idx + 1 <= step) dot.classList.replace('bg-slate-300', 'bg-indigo-600');
            else dot.classList.replace('bg-indigo-600', 'bg-slate-300');
        });
    };

    // Category Selection
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('ring-4', 'ring-indigo-500'));
            card.classList.add('ring-4', 'ring-indigo-500');
            wizardData.category = card.dataset.cat;
        });
    });

    // Next Buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Simple validation
            if(currentStep === 1 && !wizardData.category) return alert("Please select a category");
            
            if(currentStep === 1) {
                // Populate Subcategories based on selection
                const subs = getSubcategories(wizardData.category);
                const subGrid = document.getElementById('subcategory-grid');
                subGrid.innerHTML = subs.map(s => `
                    <div class="subcat-card cursor-pointer p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition bg-white dark:bg-slate-800" data-sub="${s.name}">
                        <h4 class="font-bold text-slate-800 dark:text-white">${s.name}</h4>
                        <p class="text-xs text-slate-500">${s.desc}</p>
                    </div>
                `).join('');
                
                // Add listeners to new elements
                document.querySelectorAll('.subcat-card').forEach(c => {
                    c.addEventListener('click', () => {
                        document.querySelectorAll('.subcat-card').forEach(x => x.classList.remove('border-indigo-500', 'ring-2', 'ring-indigo-500'));
                        c.classList.add('border-indigo-500', 'ring-2', 'ring-indigo-500');
                        wizardData.subcategory = c.dataset.sub;
                    });
                });
            }

            if(currentStep === 2 && !wizardData.subcategory) return alert("Please select a type");

            if(currentStep === 3) {
                wizardData.name = document.getElementById('event-name').value;
                wizardData.scale = document.getElementById('event-scale').value;
                if(!wizardData.name) return alert("Please enter a name");
                
                // Setup Team Inputs
                renderTeamInputs();
            }
            
            if(currentStep === 4) {
               // Collect Teams
               wizardData.teams = [];
               document.querySelectorAll('.team-input').forEach(inp => {
                   if(inp.value) wizardData.teams.push({ name: inp.value, score: 0 });
               });
               if(wizardData.teams.length < 1) return alert("Add at least one team/participant");
               renderSummary();
            }

            currentStep++;
            showStep(currentStep);
        });
    });

    // Final Create
    document.getElementById('create-btn').addEventListener('click', () => {
        const newId = 'evt-' + Date.now();
        const newEvent = {
            id: newId,
            ...wizardData,
            status: 'upcoming',
            timer: { minutes: 0, seconds: 0, isRunning: false },
            logs: ["Event Created"]
        };
        createNewEvent(newEvent);
        window.location.href = `admin.html?id=${newId}`;
    });

    function renderTeamInputs() {
        // Simple dynamic list logic
        const container = document.getElementById('team-list-container');
        container.innerHTML = `
            <div class="space-y-2">
                <input type="text" class="team-input w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border-none" placeholder="Team/Participant 1 Name">
                <input type="text" class="team-input w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border-none" placeholder="Team/Participant 2 Name">
            </div>
            <button id="add-team-btn" class="mt-2 text-sm text-indigo-500 font-bold">+ Add Another</button>
        `;
        document.getElementById('add-team-btn').addEventListener('click', () => {
            const div = document.createElement('div');
            div.innerHTML = `<input type="text" class="team-input w-full p-3 mt-2 rounded-lg bg-slate-100 dark:bg-slate-700 border-none" placeholder="Next Team/Participant">`;
            container.querySelector('.space-y-2').appendChild(div);
        });
    }

    function renderSummary() {
        document.getElementById('summary-content').innerHTML = `
            <p><strong>Category:</strong> ${wizardData.category} / ${wizardData.subcategory}</p>
            <p><strong>Name:</strong> ${wizardData.name}</p>
            <p><strong>Teams:</strong> ${wizardData.teams.length}</p>
        `;
    }
}

/* --- ADMIN LOGIC --- */
function initAdmin() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    let eventData = getEvent(id);

    if (!eventData) return alert("Event not found");

    // Bind Header
    document.getElementById('admin-title').innerText = eventData.name;
    document.getElementById('admin-badge').innerText = eventData.subcategory;
    document.getElementById('admin-status').innerText = eventData.status;
    document.getElementById('public-link').href = `board.html?id=${id}`;

    // Render Control Layout based on Category
    const container = document.getElementById('controls-container');
    
    // RENDER SPORTS LAYOUT
    if(eventData.category === 'sports' || eventData.category === 'esports') {
        let html = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">`;
        
        // Team A
        html += createScoreCard(0, eventData.teams[0]);
        
        // Timer Center
        html += `
        <div class="bg-slate-800 rounded-2xl p-6 text-center flex flex-col justify-center items-center text-white shadow-lg">
            <div class="text-sm uppercase text-slate-400 font-bold mb-2" id="timer-period">${eventData.timer.period || '1st Half'}</div>
            <div class="text-6xl font-mono font-bold mb-4 tracking-widest" id="timer-display">
                ${formatTime(eventData.timer.minutes, eventData.timer.seconds)}
            </div>
            <div class="flex gap-2">
                <button onclick="toggleTimer('${id}')" id="timer-btn" class="px-6 py-2 ${eventData.timer.isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} rounded-lg font-bold transition">
                    ${eventData.timer.isRunning ? 'Pause' : 'Start'}
                </button>
                <button onclick="resetTimer('${id}')" class="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold"><i class="fas fa-undo"></i></button>
            </div>
        </div>`;

        // Team B
        html += createScoreCard(1, eventData.teams[1]);
        html += `</div>`;
        
        container.innerHTML = html;
    } 
    // RENDER GENERIC/QUIZ LAYOUT
    else {
        let html = `<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                    <tr>
                        <th class="p-4">Participant</th>
                        <th class="p-4 text-center">Score</th>
                        <th class="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">`;
        
        eventData.teams.forEach((t, idx) => {
            html += `
            <tr>
                <td class="p-4 font-bold text-lg dark:text-white">${t.name}</td>
                <td class="p-4 text-center text-2xl font-bold text-indigo-500">${t.score}</td>
                <td class="p-4 text-center">
                    <div class="flex justify-center gap-2">
                        <button onclick="updateScore('${id}', ${idx}, 1)" class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 font-bold">+</button>
                        <button onclick="updateScore('${id}', ${idx}, 5)" class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 font-bold">+5</button>
                        <button onclick="updateScore('${id}', ${idx}, -1)" class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-bold">-</button>
                    </div>
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    }

    // Render Logs
    renderLogs(eventData.logs);

    // Timer Loop
    if(eventData.category === 'sports' || eventData.category === 'esports') {
        setInterval(() => {
            const current = getEvent(id);
            if(current.timer.isRunning) {
                current.timer.seconds++;
                if(current.timer.seconds >= 60) {
                    current.timer.seconds = 0;
                    current.timer.minutes++;
                }
                saveEvent(current);
                // Update DOM directly to avoid full re-render flicker
                const disp = document.getElementById('timer-display');
                if(disp) disp.innerText = formatTime(current.timer.minutes, current.timer.seconds);
            }
        }, 1000);
    }
}

function createScoreCard(idx, team) {
    return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg border-t-4 border-indigo-500">
        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2 truncate">${team.name}</h3>
        <div class="text-7xl font-black text-slate-900 dark:text-white mb-4">${team.score}</div>
        <div class="flex justify-center gap-3">
            <button onclick="updateScore('${getParams('id')}', ${idx}, 1)" class="w-12 h-12 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-xl transition transform active:scale-95">+</button>
            <button onclick="updateScore('${getParams('id')}', ${idx}, -1)" class="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xl transition transform active:scale-95">-</button>
        </div>
    </div>`;
}

/* --- BOARD LOGIC --- */
function initBoard() {
    const id = getParams('id');
    
    const render = () => {
        const data = getEvent(id);
        if(!data) return;

        document.getElementById('board-title').innerText = data.name;
        document.getElementById('board-subtitle').innerText = `${data.scale || 'Competition'} • ${data.subcategory}`;

        const container = document.getElementById('board-content');

        // Sports Layout
        if(data.category === 'sports' || data.category === 'esports') {
            container.innerHTML = `
                <div class="flex items-center justify-center gap-8 md:gap-24 h-full">
                    <div class="text-center animate-pulse-slow">
                        <h2 class="text-4xl md:text-6xl font-bold text-white mb-4 opacity-90">${data.teams[0].name}</h2>
                        <div class="text-[10rem] md:text-[16rem] leading-none font-black text-white drop-shadow-lg">${data.teams[0].score}</div>
                    </div>
                    
                    <div class="flex flex-col items-center bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                        <div class="text-2xl md:text-3xl font-bold text-yellow-400 uppercase tracking-widest mb-4">${data.timer.period}</div>
                        <div class="text-6xl md:text-8xl font-mono font-bold text-white mb-4">${formatTime(data.timer.minutes, data.timer.seconds)}</div>
                        <div class="px-4 py-1 bg-red-600 text-white text-sm font-bold uppercase rounded animate-pulse">${data.status}</div>
                    </div>

                    <div class="text-center animate-pulse-slow">
                        <h2 class="text-4xl md:text-6xl font-bold text-white mb-4 opacity-90">${data.teams[1].name}</h2>
                        <div class="text-[10rem] md:text-[16rem] leading-none font-black text-white drop-shadow-lg">${data.teams[1].score}</div>
                    </div>
                </div>
            `;
        } 
        // List/Rank Layout
        else {
            // Sort by score
            const sorted = [...data.teams].sort((a,b) => b.score - a.score);
            let listHtml = `<div class="max-w-5xl mx-auto w-full grid gap-4">`;
            
            sorted.forEach((t, idx) => {
                const isFirst = idx === 0;
                listHtml += `
                    <div class="flex items-center justify-between p-6 md:p-8 rounded-2xl ${isFirst ? 'bg-yellow-500/20 border-2 border-yellow-400 scale-105' : 'bg-white/10'} backdrop-blur-sm transition-all">
                        <div class="flex items-center gap-6">
                            <div class="text-3xl md:text-4xl font-black ${isFirst ? 'text-yellow-400' : 'text-white/50'}">#${idx + 1}</div>
                            <div class="text-3xl md:text-5xl font-bold text-white">${t.name}</div>
                        </div>
                        <div class="text-5xl md:text-7xl font-black text-white">${t.score}</div>
                    </div>
                `;
            });
            listHtml += `</div>`;
            container.innerHTML = listHtml;
        }
    };

    render();
    // Poll for updates every second
    setInterval(render, 1000);
}


/* --- UTILS & ACTIONS --- */
// Made global for inline onclick handlers
window.updateScore = function(id, teamIdx, amount) {
    const event = getEvent(id);
    event.teams[teamIdx].score += amount;
    if(event.teams[teamIdx].score < 0) event.teams[teamIdx].score = 0;
    
    const msg = `${event.teams[teamIdx].name} score updated to ${event.teams[teamIdx].score}`;
    event.logs.unshift(msg);
    
    saveEvent(event);
    if(document.body.id === 'admin-page') {
        initAdmin(); // Simple re-render
    }
};

window.toggleTimer = function(id) {
    const event = getEvent(id);
    event.timer.isRunning = !event.timer.isRunning;
    saveEvent(event);
    // Update button text immediately
    const btn = document.getElementById('timer-btn');
    btn.innerText = event.timer.isRunning ? 'Pause' : 'Start';
    btn.classList.toggle('bg-green-500');
    btn.classList.toggle('bg-red-500');
};

window.resetTimer = function(id) {
    const event = getEvent(id);
    event.timer.minutes = 0;
    event.timer.seconds = 0;
    event.timer.isRunning = false;
    saveEvent(event);
    initAdmin();
}

function renderLogs(logs) {
    const el = document.getElementById('event-logs');
    if(!el) return;
    el.innerHTML = logs.slice(0, 10).map(l => `
        <div class="text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 py-2">
            <span class="text-xs text-slate-400 block">${new Date().toLocaleTimeString()}</span>
            ${l}
        </div>
    `).join('');
}

function getCategoryColor(cat) {
    const map = { sports: 'border-orange-500', academic: 'border-blue-500', cultural: 'border-pink-500', esports: 'border-purple-500' };
    return map[cat] || 'border-gray-500';
}

function getStatusColor(status) {
    return status === 'live' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
}

function getSubcategories(cat) {
    const data = {
        sports: [{name: 'Football', desc: 'Goals, Halves'}, {name: 'Basketball', desc: 'Points, Quarters'}, {name: 'Cricket', desc: 'Runs, Overs'}],
        academic: [{name: 'Quiz', desc: 'Rounds, Points'}, {name: 'Debate', desc: 'Judged Score'}],
        cultural: [{name: 'Dance', desc: 'Judged Score'}, {name: 'Music', desc: 'Judged Score'}],
        esports: [{name: 'Valorant', desc: 'Rounds'}, {name: 'FIFA', desc: 'Goals'}]
    };
    return data[cat] || [];
}

function formatTime(m, s) {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getParams(key) {
    return new URLSearchParams(window.location.search).get(key);
}