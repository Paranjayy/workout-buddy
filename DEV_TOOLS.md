# 🛠️ Dev Tools & Resources

Tools, linters, and quality assurance utilities for this project and general dev work.

---
. 
## Code Quality & Cleanup

| Tool | Purpose | Link |
|------|---------|------|
| **Knip** | Find unused files, deps, and exports in JS/TS | [knip.dev](https://knip.dev/) · [GitHub](https://github.com/webpro-nl/knip) |
| **jscpd** | Copy/paste detector for source code | [jscpd.dev](https://jscpd.dev/) |
| **fallow** | Find unused code with flow analysis | [fallow.tools](https://fallow.tools/) |
| **Wallace CLI** | CSS analytics on the CLI | [GitHub](https://github.com/projectwallace/wallace-cli) |

## Linting & Formatting

| Tool | Purpose | Link |
|------|---------|------|
| **ESLint** | JavaScript/TypeScript linting | [eslint.org](https://eslint.org/) |
| **StyleLint** | CSS linting | [stylelint.io](https://stylelint.io/) |
| **Prettier** | Code formatting | [prettier.io](https://prettier.io/) |
| **clint** | Convention linting for commits | [GitHub](https://github.com/nicolo-ribaudo/clint) |

## Testing & Debugging

| Tool | Purpose | Link |
|------|---------|------|
| **Sentry** | Error tracking & performance monitoring | [sentry.io](https://sentry.io/) |
| **Spotlight** | Sentry's local dev companion | Sentry docs |
| **Vitest** | Fast unit testing for Vite | [vitest.dev](https://vitest.dev/) |
| **Playwright** | E2E browser testing | [playwright.dev](https://playwright.dev/) |

## Browser & Headless Tools

| Tool | Purpose | Link |
|------|---------|------|
| **agent-browser** | Headless browser for AI agents | GitHub |
| **chrome-devtools-mcp** | MCP server for Chrome DevTools | GitHub |
| **Lightpanda** | Ultra-fast headless browser | [lightpanda.io](https://lightpanda.io/) |

## Documentation & AI

| Tool | Purpose | Link |
|------|---------|------|
| **Context7** | Up-to-date docs for AI coding | [context7.com](https://context7.com/) |
| **Storybook AI** | Component discovery with AI | Storybook docs |
| **TanStack Code Mode** | AI-aware code patterns | TanStack docs |

## Task Management

| Tool | Purpose | Link |
|------|---------|------|
| **dex** | Developer experience CLI | GitHub |
| **beads** | Task/todo management for devs | GitHub |

## Performance

| Tool | Purpose | Link |
|------|---------|------|
| **Lighthouse** | Web performance auditing | Chrome DevTools |
| **Vite Bundle Analyzer** | Visualize bundle sizes | `vite-plugin-visualizer` |
| **web-vitals** | Core Web Vitals measurement | [web.dev](https://web.dev/vitals/) |

---

## Quick Commands

```bash
# Run Knip to find unused code
npx knip

# CSS analytics
npx wallace-cli src/style.css

# Copy/paste detection
npx jscpd src/

# Lint
npx eslint src/
npx stylelint "src/**/*.css"
```

---

## Project-Specific Notes

- **Framework**: Vite + Vanilla JS (no React/Vue overhead)
- **Storage**: LocalStorage (offline-first, no backend)
- **Styling**: Vanilla CSS with custom properties design system
- **Fonts**: Fraunces (display) + Instrument Sans (body) via Google Fonts
- **Icons**: Inline SVG (no icon library dependency)

> Source: Inspired by [Syntax.fm #998 — How to Fix Vibe Coding](https://syntax.fm/998)
