# Section Actions Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the affected action-container classes and set the desktop title-to-actions spacing to exactly 15px.

**Architecture:** Reuse the existing shared `.section__actions` layout instead of adding a second variant. Change only the shared grid column gap; preserve the existing mobile row gap.

**Tech Stack:** HTML, SCSS, Vite

---

### Task 1: Correct the section action containers

**Files:**

- Modify: `src/content/home.html:238`
- Modify: `src/content/home.html:741`

- [ ] **Step 1: Verify the incorrect classes exist**

Run: `rg -n 'sections__actions' src/content/home.html`
Expected: two matches.

- [ ] **Step 2: Apply the existing component class**

Replace both instances:

```html
<div class="sections__actions"></div>
```

with:

```html
<div class="section__actions"></div>
```

- [ ] **Step 3: Verify the incorrect class is gone**

Run: `rg -n 'sections__actions' src`
Expected: no matches.

### Task 2: Set and verify the spacing

**Files:**

- Modify: `src/styles/components/_content.scss:308`

- [ ] **Step 1: Set the exact desktop column gap**

Replace the prefixed and standard `1rem` declarations with:

```scss
-moz-column-gap: 15px;
column-gap: 15px;
```

- [ ] **Step 2: Run project validation**

Run: `npm run build`
Expected: successful Vite production build.

- [ ] **Step 3: Review the final diff**

Run: `git diff --check`
Expected: no output and exit code 0.
