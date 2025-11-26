# ⭐ AstraScore

> A joyful, modern scoreboard + festival management web app for Sports, Academic, Cultural and Esports events.

AstraScore lets schools, colleges, clubs and tournament hosts create beautiful, fully-customized scoreboards in a few clicks. From a single football match to a multi-day interschool fest with dozens of events, AstraScore handles it all with a clean step-by-step interface.

---

## 🎯 Features

### Single Scoreboard Mode
- Supports **Sports, Academic, Cultural, Esports** events  
- Category-aware setup (football vs quiz vs dance vs Valorant, etc.)
- Participant builder: teams / individuals / houses
- Custom scoring rules (points, rounds, judges, penalties, etc.)
- Optional schools / houses / organisations mapping
- Layout controls + extra rows/columns for custom stats
- Multiple board types:
  - Leaderboard  
  - Scoresheet  
  - Block Scoreboard  
  - Sports Scorebug with timer  
  - Counter

### Festival / Mega Event Mode
- Create a **Festival** with many **sub-events** (e.g. “Football U17”, “Science Quiz Senior”, “Solo Dance”)
- Add **stages/rounds/matches** for each sub-event
- Define **schools / houses / teams** at festival level
- Attach a personalized scoreboard to every stage (reuses Single Scoreboard)
- Ready for an **overall points leaderboard** across all events

### Views
- `create.html` – creation wizard for scoreboards & festivals  
- `dashboard.html` – overview of created scoreboards  
- `admin.html` – live control (scores, timers, judges)  
- `board.html` – clean public display view for projectors/screens  
- `festival-dashboard.html` (planned) – full festival hub

All pages share a playful, pastel, competition-vibe UI with light gradients, rounded cards and smooth transitions.

---

## 🏗 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **State:** Browser memory / `localStorage` (for now)  
- **Backend (planned):** Python + Supabase (auth, storage, realtime)

No frontend frameworks are required, everything runs in a plain browser.

---

## 📂 Project Structure

```text
.
├── index.html            # Landing page
├── create.html           # Multi-step creation wizard
├── dashboard.html        # Scoreboard overview/dashboard
├── admin.html            # Admin control panel
├── board.html            # Public scoreboard view
├── app.js                # Core frontend logic & state
└── README.md
