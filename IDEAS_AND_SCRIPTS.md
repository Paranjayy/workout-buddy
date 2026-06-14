# Project Gravity: Ideas & Scripts
A collection of high-velocity automation ideas for Mac, Obsidian, and Raycast.

---

## 🛠️ Mac Automation (Python/Zsh)

### 1. The Orchestrator (File Organizer)
A script to solve the "hoarded mess" problem without LLMs.
- **Logic:** Walks through `Downloads` and `Desktop`.
- **Classification:** Sorts by extension (`.pdf` -> `Docs`, `.png` -> `Images`) and Date (`Last 7 Days`, `Last 30 Days`, `Ancient`).
- **Action:** Moves to a structured `~/Archive/Organized/YYYY/MM/` folder.
- **Audit Log:** Creates a `manifest.txt` in the root of the archive so you can still search for where things went.

### 2. "Ghost" Cleanup
A script to find and delete:
- Empty folders.
- `.DS_Store` files.
- `node_modules` in projects not touched in 6 months.
- Temporary download fragments (`.crdownload`, `.part`).

---

## 🔮 Obsidian Enhancements

### 1. Dictionary Smart-Linker
Automatically identify "difficult" words in your notes and add a subtle hover definition.
- **How:** Use the Webster's JSON data. If a word exists in the dictionary and isn't in a "common 5000 words" list, highlight it.

### 2. Contextual Research Hub
A sidebar that automatically searches the word under your cursor across:
- Your local vault.
- Webster's Dictionary.
- Wikipedia.
- Arxiv / Google Scholar.

---

## ⚡ Raycast Extensions (Script Commands)

### 1. Webster's Quick Search
A script command that uses the same split JSON logic to show definitions in the Raycast dashboard.
- **Speed:** Instant lookup because it only loads one small `.json` file based on the first letter.

### 2. Workspace Warp
Quickly jump between projects.
- **Command:** `warp`
- **Action:** Lists all directories in `~/Developer/` or `~/Downloads/2work/`.
- **Selection:** Opens in Cursor, iTerm2, and Browser (if a local dev server is running).

---

## 📈 Website Saturation Roadmap (Workout Buddy / Portfolio)

### Core Portfolio (95% -> 100%)
- [ ] **Mobile Sovereignty:** Fix the navigation overlap on small screens.
- [ ] **Custom 404:** A sleek, animated 404 page that points back to the dashboard.
- [ ] **SEO Hardening:** Add OpenGraph tags for every route.

### Content Discovery (60% -> 90%)
- [ ] **RSS Feed:** `/rss.xml` for blog/updates.
- [ ] **Search History:** Save last 5 searches in `localStorage` for the ⌘K menu.
- [ ] **Surprise Me:** A random project/note generator for exploration.

### Academic Features (40% -> 80%)
- [ ] **Citation Generator:** One-click copy APA/MLA citations for articles.
- [ ] **Interactive Timeline:** A Framer Motion powered history of the subject.
- [ ] **Downloadable CV:** A dynamic PDF generator from the site's data.
