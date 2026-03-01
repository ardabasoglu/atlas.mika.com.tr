# Under Construction Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a reusable under construction component and a new `/dashboard` page that uses it, updating the sidebar navigation to point the Dashboard item to `/dashboard`.

**Architecture:** Use a small, reusable React component under `src/components` to render the under construction message, and a new app router page at `src/app/dashboard/page.tsx` that composes this component. Update the existing sidebar navigation configuration so the Dashboard link routes to the new page without changing existing CRM layouts or redirects.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS utility classes, existing sidebar navigation components.

---

### Task 1: Add UnderConstruction component

**Files:**
- Create: `src/components/under-construction.tsx`

**Step 1: Create the component file**
- Add a new React component `UnderConstruction` that:
  - Is a named export.
  - Renders a vertically and horizontally centered container.
  - Displays the exact text `Bu sayfa yapım aşamasındadır` inside a card-like box.

**Step 2: Ensure styling uses existing utilities**
- Use Tailwind utility classes (already configured in the project) for flex centering, padding, border, and typography.

### Task 2: Create the /dashboard page

**Files:**
- Create: `src/app/dashboard/page.tsx`

**Step 1: Implement the page component**
- Default export a `DashboardPage` React component.
- Import `UnderConstruction` from `@/components/under-construction`.
- Render `UnderConstruction` inside a `main` element with simple layout classes (for example `className="flex-1"`).

**Step 2: Keep route behavior simple**
- Do not modify the existing root route redirect behavior in `src/app/page.tsx`.
- Rely on the sidebar navigation to reach `/dashboard`.

### Task 3: Update sidebar Dashboard navigation

**Files:**
- Modify: `src/components/app-sidebar.tsx`

**Step 1: Point Dashboard nav item to /dashboard**
- In the `data.navMain` configuration, change the `url` for the `Dashboard` item from `/` to `/dashboard`.

### Task 4: Lint and build

**Files / Commands:**
- Lint: `npm run lint` or `yarn lint` (depending on project preference).
- Build: `npm run build` or `yarn build`.

**Step 1: Run linter**
- Run the linter and ensure there are no new lint errors related to the new component and page.

**Step 2: Run build**
- Run the build command.
- If the build fails, inspect the error output, fix any issues in the new code, and rerun until the build succeeds.

