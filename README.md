# Agent Test Lab

Controlled sandbox for testing and comparing AI coding agents before using them on real production projects.

This repository uses a sample SaaS idea called **MCTicket**, a ticketing and job-sheet system for computer repair shops. Each test folder checks different software-development skills: planning, TypeScript coding, frontend UI, code review, and scoring.

## Sample Project: MCTicket

MCTicket helps computer repair shops track customer devices from drop-off to delivery.

Core product ideas:

- Create and manage repair tickets / job sheets
- Track device intake, diagnostics, repair status, and delivery
- Manage customer lookup and communication history
- Assign technicians and view workload
- Track parts inventory per job

## Repository Structure

| Folder | Purpose |
| --- | --- |
| `00-brief/` | Project context and shared constraints for all tests. |
| `01-planning-test/` | Planning prompt and model responses for MCTicket product planning. |
| `02-coding-test/` | TypeScript utility-module submissions from multiple agents. |
| `03-frontend-test/` | Single-file React + TypeScript + Tailwind dashboard submissions. |
| `04-review-test/` | Buggy dashboard review prompt, target file, and agent review outputs. |
| `99-scorecard/` | Comparative scoring and final rankings across test rounds. |
| `frontend-preview/` | Vite React preview app for rendering selected frontend submissions. |

## Test Rounds

### 1. Planning Test

Prompt: `01-planning-test/planning-test-prompt.md`

Goal: evaluate an agent's ability to reason and plan without writing code.

Agents must produce a concise structured plan covering project understanding, modules, roles, data model, routes, development phases, risks, first build target, and out-of-scope items.

### 2. Coding Test

Folder: `02-coding-test/`

Goal: evaluate TypeScript utility-module quality, including exported types, ticket summary calculations, grouping, overdue logic, SLA-risk logic, urgent queue logic, and reusable API design.

### 3. Frontend/UI Test

Prompt: `03-frontend-test/frontend-test-prompt.md`

Goal: evaluate React + TypeScript + Tailwind frontend execution from one detailed spec.

Submissions build a responsive MCTicket dashboard with summary cards, ticket list/table, status badges, priority badges, technician display, filter UI, empty state, and static ticket data.

### 4. Review Test

Prompt: `04-review-test/review-test-prompt.md`

Target: `04-review-test/review-target-buggy-dashboard.tsx`

Goal: evaluate code-review judgment, bug detection, requirement checking, TypeScript/React critique, UI/UX critique, responsive-design critique, and practical fix suggestions.

### 5. Scorecard

File: `99-scorecard/agent-scorecard.md`

Goal: compare outputs across agents using criteria such as instruction following, correctness, reasoning, practicality, UI completeness, responsiveness, code readability, and overall usefulness.

## Frontend Preview

`frontend-preview/` is a local Vite React app used to preview selected dashboard components.

Run locally:

```bash
cd frontend-preview
npm install
npm run dev
```

Build locally:

```bash
cd frontend-preview
npm run build
```

## Constraints

- No database implementation.
- No production credentials.
- No real authentication.
- No deployment requirements.
- Static or mocked data only.
- Local development and evaluation only.

## Security Note

This repository was scanned before publishing. No `.env` files, private keys, certificates, API tokens, or production secrets were found.

The root `.gitignore` excludes common sensitive or generated files such as `.env*`, `*.pem`, `*.key`, `node_modules/`, `dist/`, `build/`, logs, and local editor files.

## Current Highlights

Based on `99-scorecard/agent-scorecard.md`:

- Best planning response: `kimi-k2p6.md`
- Planning backup: `deepseek-v4-pro.md`
- Best TypeScript coding response: `glm-5p1.ts`
- Coding backup: `deepseek-v4-pro.ts`
- Best frontend/UI response: `kimi-k2p6.tsx`
- Frontend backup: `glm-5p1.tsx`

## License

No license has been selected yet.
