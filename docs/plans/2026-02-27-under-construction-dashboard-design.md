## Under Construction Component and Dashboard Page - Design

**Goal:** Provide a simple dashboard page that clearly communicates the page is under construction, using a reusable component that can be used on other pages if needed.

**Routes and Navigation**
- The new dashboard page will live at `/dashboard`.
- The existing sidebar `Dashboard` navigation item will be updated to point to `/dashboard` instead of `/`.
- The existing root route `/` will continue to behave as currently implemented (redirect logic left unchanged).

**Component Design**
- Create a new React component `UnderConstruction` in `src/components/under-construction.tsx`.
- The component will:
  - Render a centered card-like container.
  - Display the Turkish message text: `Bu sayfa yapım aşamasındadır`.
  - Use existing Tailwind CSS utility classes for basic spacing, borders, and typography.
- The component will not accept props initially to keep the design minimal and focused on this specific use case.

**Dashboard Page Design**
- Create a new Next.js app router page at `src/app/dashboard/page.tsx`.
- The page will:
  - Be a server component (no `"use client"` directive).
  - Import and render the `UnderConstruction` component inside a `main` container.
  - Use simple layout classes (`flex-1`, vertical spacing) so it integrates cleanly with any surrounding layout or shell.

**Reuse and Extensibility**
- If future pages also need an under-construction state, they can import and reuse the `UnderConstruction` component.
- If customization is needed later (e.g., different messages or icons), the component can be extended with props without breaking the initial usage on the dashboard page.

