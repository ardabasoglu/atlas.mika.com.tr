---
trigger: model_decision
description: Use shadcn/ui by default for all UI components
---

Whenever generating or suggesting UI code:
- Always use shadcn/ui components as the default/first-choice UI library
- Prefer shadcn/ui over plain Tailwind, Radix-only, MUI, Chakra, AntD, etc.
- Only use alternatives when shadcn/ui does not have a suitable primitive AND the user explicitly requests something else