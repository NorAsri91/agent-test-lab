# MCTicket Code Review / Bug Detection Agent Test

Use this prompt to compare AI agents on code review, bug detection, requirement checking, TypeScript/React judgment, UI/UX critique, responsive design critique, and practical improvement suggestions.

## Agent Instructions

You are reviewing a deliberately flawed React + TypeScript + Tailwind component for MCTicket, a SaaS ticketing and job-sheet system for computer repair shops.

This is a review-only task.

Do not edit files. Do not rewrite the whole component. Do not install packages. Do not create an app. You may include small corrected snippets only where they clarify a specific fix.

Be specific and evidence-based. Reference exact code, behavior, or requirement gaps. Prioritize real bugs, incorrect logic, missing requirements, TypeScript/React problems, UX issues, and practical fixes.

When finished, save your review answer as:

`04-review-test/[agent-name]-review.md`

Examples:

`04-review-test/deepseek-v4-pro-review.md`

`04-review-test/glm-5p1-review.md`

`04-review-test/kimi-k2p6-review.md`

## Expected Product Requirements

The component should represent a dashboard widget for MCTicket with these requirements:

1. Show exactly 12 sample tickets.
2. Cover these statuses at least once: `new`, `diagnosing`, `waiting_parts`, `ready`, `completed`, `cancelled`.
3. Cover these priorities at least once: `low`, `normal`, `high`, `urgent`.
4. Calculate open revenue from non-completed and non-cancelled tickets only.
5. Calculate overdue tickets using the real due date, where a ticket is overdue only if its due date is before the current date and its status is not `completed` or `cancelled`.
6. Display user-visible due dates that match the dates used by the logic.
7. Use Tailwind classes only for styling. Do not use inline styles.
8. Include a working empty state toggle so reviewers can verify the empty table/card state.
9. Include a visible Apply/Filter button for the search/status/priority filters.
10. Be mobile responsive and usable on narrow screens.
11. Use sound TypeScript types. Avoid `any` and weak stringly typed code where narrower types are appropriate.
12. Render lists with stable keys.
13. Use status badge colors that match the semantic status.
14. Use correct priority logic and visual treatment for urgent/high tickets.
15. Keep the implementation clear and avoid overbuilt or confusing code that does not serve the requirements.

## Review Target

Review the component in this file:

`04-review-test/review-target-buggy-dashboard.tsx`

Do not move, edit, or rewrite the target file. Treat it as the submitted implementation under review.

## Required Review Output

Produce your review using exactly these sections:

1. Executive summary
2. Critical issues
3. Major issues
4. Minor issues
5. Requirement compliance checklist
6. TypeScript/React review
7. UI/UX review
8. Responsive design review
9. Suggested fixes
10. Final verdict: pass, pass with changes, or fail

For the requirement compliance checklist, mark each requirement as one of: `Pass`, `Partial`, or `Fail`.

Remember: this is review-only. Do not rewrite the whole component. Include only small corrected snippets where helpful.
