# Planning Test Prompt — MCTicket

> **Usage:** Paste this entire prompt into any AI coding agent.  
> **Goal:** Test the agent's planning and reasoning ability without writing a single line of code.

---

You are an AI coding agent. Your task is to **plan** — not build — a SaaS application called **MCTicket**, a ticketing/job-sheet system for computer repair shops.

Read the context first, then respond with a structured plan covering all 9 sections below.

## Context

Computer repair shops need to track customer devices from drop-off to delivery. MCTicket replaces paper job sheets or Excel spreadsheets with a simple, fast, web-based ticketing system.

## Constraints (Read Carefully)

- NO database implementation — do not write SQL or ORM setup.
- NO real authentication — do not implement login, OAuth, or sessions.
- NO deployment — do not discuss Vercel, Docker, servers, or CI/CD.
- UI/UX prototype comes FIRST — the initial deliverable is a clickable frontend.
- Use DUMMY / static data only — hardcoded JSON, not API calls.
- Do not turn this into a full PRD, technical spec, or implementation guide. Keep it focused as a planning test answer.

## Your Task

Produce a plan covering these 9 areas:

### 1. Project Understanding
Explain MCTicket in your own words. What problem does it solve? Who uses it? What does a typical workflow look like (drop-off → repair → delivery)?

### 2. Recommended Modules
Break the system into logical modules or feature groups. Example: Ticketing, Customer Management, Inventory, etc.

### 3. User Roles & Permissions
Identify distinct user roles (e.g., Owner, Technician, Front Desk). For each role, describe what they can and cannot do.

### 4. Suggested Data Model / Tables
List proposed database tables (NO SQL). Just table names, primary fields, and relationships. Example:
- `customers` (id, name, phone, email)  1—M → `tickets`
- `tickets` (id, customer_id, device, issue, status, created_at, assigned_to)
- …and so on.

### 5. UI Pages / Routes
List every page/route the prototype needs. Group by role if applicable. Example:
- `/` — Dashboard (summary stats)
- `/tickets` — Ticket list
- `/tickets/:id` — Ticket detail / job sheet
- `/customers` — Customer directory
- …

### 6. Development Phases
Propose 3–5 phases in order of priority. Each phase should have a clear goal and a small scope.

### 7. Risk List
Identify risks, assumptions, and unknowns. What could go wrong? What needs clarification from a real product owner?

### 8. What to Build First & Why
Choose the single most valuable page or feature to prototype first. Justify your choice in 2–3 sentences.

### 9. What NOT to Do Yet
List at least 5 things the agent must explicitly avoid right now. Be specific. Example: "Do not set up NextAuth." "Do not create database migrations."

---

**Respond now with your structured plan. Keep it concise — this is not a design document.**
