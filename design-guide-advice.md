# UI Design Spec
**Version 3.2 — Unified Reference for All UI Design and Front-End Code**

---

## How to Read This Document

This document has two layers that work together:

**The UX layer** (Sections 1–6) defines *why* design decisions get made — the principles, the process, and the user-centered reasoning that should precede any code. These are heuristics with strong authority. Violating them requires a justification.

**The implementation layer** (Sections 7–19) defines *how* those decisions get expressed — tokens, component rules, states, motion, overlays, responsive behavior, accessibility, and every major pattern decision. These are rules with hard authority. Violating them is a defect, not a judgment call.

**The new-project layer** (Sections 20–24) covers what to do before and beyond individual screens: bootstrap sequence, information architecture, empty states, component API design, and the decision log. These apply at product level, not screen level.

**Section 25** is the self-check that runs before anything ships. **Section 26** is the automated enforcement hooks. **Section 27** is the working vocabulary.

**Before writing any UI code, read this entire document.**

---

## Part I — UX Principles and Process

---

## 1. Design Principles

Every design decision on every screen must serve at least one of these principles. If it doesn't, remove the element.

### 1.1 Clarity over cleverness

Users must instantly understand where they are, what they can do, and what will happen next. Ambiguity in labels, layout, or interaction patterns is always a defect — never a stylistic choice.

Clever design that requires the user to figure it out is not clever.

### 1.2 Purposeful visual hierarchy

Important things must *look* important. Importance is communicated through size, placement, contrast, and whitespace — not just color.

Every screen must support a three-level read:
- **First read** — The headline, key status, or primary action. What is this?
- **Second read** — Supporting context, secondary content, navigation.
- **Third read** — Details, metadata, edge-case controls.

If a viewer's eye cannot follow this path naturally, the hierarchy is broken.

### 1.3 Consistency with intentional variation

Similar things look and behave the same. Different things look *intentionally* different — not accidentally different because components were styled separately.

Design tokens and shared components are how consistency is enforced. Ad-hoc styling is how it breaks.

### 1.4 User control and immediate feedback

Users must always be able to see what's happening, and must be able to undo or escape when needed. Every significant interaction requires fast, clear feedback — visual at minimum, haptic or audible where appropriate.

"Fast" means within 100ms for immediate reactions; within 1 second for operations; with a visible progress indicator for anything longer.

### 1.5 Reduced cognitive load

The interface should be scannable, predictable, and forgiving of distracted use. Do not require users to remember information from a previous screen if it can be shown on the current one. Reduce the number of decisions required per task, not the number of features.

### 1.6 Accessibility and inclusivity

Contrast, tap target sizes, keyboard navigation, and screen reader compatibility are not optional features — they are baseline requirements. Never rely on color alone to convey meaning or state.

### 1.7 Evidence-based iteration

Designs are hypotheses. Ship them as the best current answer, not the final answer. Every design decision should be testable and adjustable based on real usage.

---

## 2. Pre-Code Process — Required for Every Screen

Do not generate UI code without completing this pipeline. For minor component-level fixes, a shortened version is acceptable. For any screen-level generation, the full pipeline is required.

### Step 1 — Define the screen's job

Write one sentence: *"This screen helps [user type] [accomplish specific task]."*

If you cannot write this sentence, you don't have enough information to design the screen. Ask.

All layout, component, and hierarchy choices must serve this sentence. If an element doesn't support it, it should not be on the screen.

### Step 2 — Know the user

Answer:
- Who is the primary user of this screen? (Role, context, technical level)
- What are they trying to accomplish?
- What do they already know when they arrive here?
- What do they need to know that they don't yet?
- What is the failure mode — what happens if they do the wrong thing?

### Step 3 — Inventory and rank content

List every piece of content and every action the screen needs to contain. Then rank each:

| Rank | Definition |
|---|---|
| **Primary** | Essential to the screen's job — must be immediately visible and accessible |
| **Secondary** | Supports the primary content — present but not dominant |
| **Tertiary** | Available for reference or edge cases — accessible but de-emphasized |

Layout follows this ranking. Primary content gets the most visual weight, the best position (top-left on desktop, top on mobile), and the most contrast.

### Step 4 — Choose a layout pattern

Select the pattern that fits the content and task — not the one that looks most finished:

| Pattern | Use when |
|---|---|
| **Single column** | Linear tasks, forms, long-form reading |
| **List + detail** | Browsing items and viewing one at a time |
| **Card grid** | Parallel items of roughly equal importance |
| **Split pane** | Simultaneous comparison or master-detail navigation |
| **Dashboard** | Monitoring multiple metrics at a glance |
| **Timeline** | Sequential events, history, process steps |
| **Form** | Structured data entry, multi-step workflows |

Do not default to "dashboard layout" for everything. Do not use a card grid for content that has a clear hierarchy.

### Step 5 — Collect the brand brief

For any screen-level or product-level work, confirm:

| Input | What it determines |
|---|---|
| Product type and primary user | Information density; vocabulary; what "done" looks like |
| Brand adjectives (3–5 words) | Color palette character; typeface mood; motion tempo |
| Existing logo or color constraints | What cannot change |
| Density preference | Compact/data-forward vs. open/editorial |
| Visual references | Directional alignment before committing to a palette |

If the brand brief is missing, ask for it or propose explicit options. Do not guess.

From the brief, derive:
1. A typeface pairing (heading + body — see Section 6.1)
2. A custom color palette anchored in the brand adjectives (see Section 6.2)
3. A density level expressed through spacing token selection (see Section 6.5)
4. A motion character: snappy and precise vs. fluid and deliberate (see Section 10)

### Step 6 — Commit to an aesthetic direction

Before touching tokens, name the aesthetic direction this product is going in. Not a mood board reference — a committed point of view that will govern every visual decision.

Pick one direction and name it explicitly. Examples:

| Direction | Character | Typical signals |
|---|---|---|
| **Brutalist / raw** | Unpolished, confrontational, high-contrast | Heavy borders, monospace type, minimal decoration, stark layouts |
| **Editorial / magazine** | Considered, typographic-led, cultured | Strong type scale, restrained palette, generous whitespace, ruled sections |
| **Luxury / refined** | Quiet, precise, expensive-feeling | Tight kerning, muted palette, micro-detail, no excess |
| **Utilitarian / tool** | Dense, functional, zero decoration | Maximum data density, systematic layout, no surface-level styling |
| **Organic / natural** | Warm, textured, human | Irregular forms, earthy palette, imperfect geometry, tactile surface treatments |
| **Playful / toy-like** | Expressive, high-energy, characterful | Bold color, bouncy motion, rounded shapes, illustrated accents |
| **Retro-futuristic** | Nostalgic and forward simultaneously | Period typography, anachronistic detail, controlled neon or warm CRT tones |
| **Minimal / pure** | Restrained to the point of tension | Almost nothing — every element earns its presence |

This list is illustrative, not exhaustive. The right direction is derived from the brand adjectives and product context — not chosen because it looks impressive in a portfolio.

**One question to answer before proceeding:** What is the one thing a user will remember about this interface after they close the tab?

If you cannot answer this, the aesthetic direction is not defined enough. It doesn't need to be loud — a calm, precise, utilitarian tool can be just as memorable as a maximalist one — but it must be intentional.

**Implementation complexity must match the aesthetic vision.** A maximalist direction requires elaborate code: layered backgrounds, choreographed entrance animations, expressive type pairings, rich surface treatments. A minimalist direction requires restraint and precision: exact spacing, careful typographic rhythm, no unnecessary motion. Elegance in both cases comes from executing the chosen direction completely — not from defaulting to a medium level of effort regardless of what the design calls for.

### Step 7 — Map tokens and components

Before writing layout code, identify:
- Which typography tokens apply to each content element
- Which color tokens apply to each surface and text element
- Which spacing tokens define the gaps, padding, and margins
- Which components already exist and should be reused

No ad-hoc CSS values. If a value doesn't map to a defined token, create the token first.

The aesthetic direction established in Step 6 must be reflected in token choices — not just described in words. A luxury direction means choosing a specific warm neutral, a tight tracking value for headings, and a `duration.slow` motion character. A brutalist direction means choosing a stark contrast ratio, zero border-radius, and `duration.instant` for most state changes. Tokens are where the aesthetic direction becomes real.

---

## 3. Visual Hierarchy in Practice

### 3.1 The three-level read

Design each screen so a viewer's eye follows this path without effort:

1. **First read** — One dominant element: the page title, the primary status, or the primary action. This element is bigger, bolder, or higher-contrast than everything else on the screen. There is exactly one of these per screen.

2. **Second read** — Supporting content: section headers, secondary data, navigation. Visually subordinate to the first read but clearly differentiated from the third.

3. **Third read** — Details: metadata, annotations, timestamps, helper text. De-emphasized but readable.

If two things compete for the same visual weight, one of them is at the wrong level. Fix the hierarchy, not the styling.

### 3.2 Type hierarchy rules

Use the text scale defined in Section 6.1. On most screens, use no more than four levels:

- **Display/H1** — Page or screen title. One per screen.
- **H2/Section heading** — Section titles. Multiple allowed.
- **Body** — Primary readable content.
- **Small/Caption** — Metadata, annotations, helper text.

Maintain consistent heading ratios across screens. If H1 is 32px on one screen, it must be 32px on every screen — not 28px on some and 40px on others.

### 3.3 Scanning patterns

Design for natural eye movement:

- **Desktop (F-pattern):** Users scan across the top, then down the left edge, with shorter horizontal scans as they go. Place the primary heading and primary CTA at the top. Place navigation on the left or top. Do not hide critical content in the right column unless it's secondary.

- **Mobile (vertical):** Users scroll vertically. Place the most critical content and actions in the top viewport. Keep primary CTAs within thumb reach — bottom-center of the screen or persistently docked at the bottom.

Practical application:
- Primary CTA: top-right (desktop) or docked bottom (mobile)
- Primary content: top-left or top-center
- Secondary navigation: left sidebar (desktop) or hamburger/tab bar (mobile)
- Tertiary actions: overflow menus, secondary pages

### 3.4 Whitespace as a design element

Whitespace separates unrelated content and groups related content. It is not empty space waiting to be filled.

- Use `space.l` or `space.xl` between distinct sections
- Use `space.m` between related elements within a section
- Use `space.xs` or `space.s` within a single component (internal padding)
- Avoid both extremes: cramped layouts cause stress; over-spaced layouts lose grouping signals

### 3.5 Spatial composition — breaking the default grid intentionally

The grid is a constraint, not a cage. Staying strictly on-grid produces orderly, forgettable layouts. Strategic grid-breaking produces layouts that feel designed rather than generated.

Techniques that are permitted — and often encouraged:

**Asymmetry.** A 7/5 column split is more interesting than a 6/6. A hero section with a left-heavy text block and a right-aligned image creates visual tension that draws the eye. Use asymmetry when content importance is unequal — which it usually is.

**Overlap.** Elements that cross the boundaries between sections, or that allow a prominent image to bleed over a content card, create depth without using actual 3D effects. Use deliberately — overlapping body text is a mistake; overlapping a decorative element is a technique.

**Diagonal flow.** Angled section dividers, rotated typographic elements, or diagonal background shapes direct the eye in a specific path. Reserve for high-impact moments (hero sections, feature calls-out) — not for repeated structural elements.

**Grid-breaking elements.** A pull quote that extends beyond the text column. A number in a large display size anchored to the right edge while body text flows left. A full-bleed image that breaks out of a card-bounded layout. These create visual interest precisely because everything else is disciplined.

**Controlled density variation.** Not every section needs the same spatial density. A denser data section followed by a sparse editorial section creates breathing room and resets visual attention. This is composition, not inconsistency.

**Rules for intentional grid-breaking:**
- Break the grid at most one or two times per screen — every break must be purposeful
- The rest of the layout must be highly disciplined to make the break readable as intentional
- Never break the grid on functional elements (forms, tables, navigation) — only on expressive or structural elements
- If a layout element looks like an accident, it is an accident regardless of intent

### 3.6 Atmosphere and surface treatment

A flat white or dark gray background is a neutral, not a design decision. Backgrounds and surface treatments are the canvas for the rest of the design — they set the emotional register before a user reads a single word.

This does not mean adding noise or gradients indiscriminately. It means making a choice about what the surface communicates.

Techniques to consider, matched to the aesthetic direction established in Step 6:

**Noise/grain overlay.** A subtle grain texture (2–4% opacity) over a solid background adds tactile warmth without pattern. Appropriate for organic, editorial, and luxury directions. Wrong for utilitarian or brutalist directions.

**Geometric pattern.** A repeating geometric motif at low opacity — dots, lines, tessellated shapes — adds structure and visual rhythm to backgrounds. Appropriate for retro-futuristic, art-deco, and systematic product directions.

**Tinted surface differentiation.** Instead of gray-on-white, use a very slightly warm or cool tint on surface cards to differentiate them from the page background. Creates depth without decoration.

**Dominant color with sharp accent.** A product that commits to a strong background color (deep ink, warm cream, cool slate) with a single high-contrast accent reads as designed and confident. Generic SaaS uses white backgrounds because it doesn't commit — committing to a color is a brand signal.

**Full-bleed section backgrounds.** Alternating section backgrounds (base → surface → base) creates page rhythm without relying on cards. Sections feel distinct without borders or shadows.

**What not to do:**
- Do not add surface treatments because a layout feels bare — if the layout feels bare, fix the hierarchy and content, not the background
- Do not stack multiple techniques in the same section (grain + gradient + pattern = noise)
- Do not use dramatic surface treatments on data-dense screens — they compete with the content
- The anti-pattern is generic purple-to-blue gradient; the alternative is not "any other gradient" — it is a *committed, product-specific* surface choice

---

## 4. Interaction Design

### 4.1 Feedback requirements

Every significant user action must produce feedback within a predictable time:

| Response time | Required feedback |
|---|---|
| < 100ms | Visual state change (button press, toggle flip) |
| 100ms–1s | Loading indicator (spinner, progress bar) |
| > 1s | Progress indicator with contextual label |
| > 10s | Progress with estimated completion or cancellation option |

### 4.2 Microinteractions

Microinteractions are small moments that confirm actions, communicate state, or prevent errors. They should be:
- Simple — one clear purpose per interaction
- Purposeful — only present where they add information
- Aligned with the product's tone — a fintech product and a creative tool have different tempos

Use microinteractions for: button presses, form submissions, toggles and switches, tab switching, notification appearances, loading states. See Section 10 for motion token specifications.

### 4.3 Error prevention and recovery

The best error message is one the user never sees. Design to prevent errors first:
- Disable actions that aren't currently valid (and explain why via tooltip)
- Use input constraints to prevent invalid data entry
- Show confirmation dialogs for destructive or irreversible actions

When errors do occur:
- Show the error message adjacent to the exact field or element that caused it
- Explain what went wrong in plain language, not error codes
- Tell the user what to do, not just what happened
- Do not use blaming language ("You entered an invalid value" → "This field requires a date after today")

### 4.4 User control

Users must always be able to:
- Undo the last significant action where technically feasible
- Cancel or dismiss any in-progress operation
- Navigate back without losing unsaved work (or receive a warning)
- Understand the current system state without having to request it

---

## 5. Form Design

Forms are where users do their highest-stakes work. Poor form design causes errors, abandonment, and distrust.

### 5.1 Structure

- Group related fields into logical sections with a clear section heading
- One column for most forms — multi-column forms increase error rates except for genuinely paired fields (first name / last name, city / state)
- Order fields by logical flow, not by database schema
- Progress indicators for multi-step forms showing current position and total steps

### 5.2 Labels and placeholders

- Labels must be visible at all times — above the input, not inside it as a placeholder
- Placeholder text is for example values only ("e.g. jane@company.com"), never for the label
- Required fields should be marked — use an asterisk (*) with a legend, or mark optional fields instead if most are required

### 5.3 Validation

- Validate on blur (when the user leaves a field), not on keystroke
- Exception: validate on keystroke for password strength indicators and real-time search
- Show success indicators for fields that are correct when the user has reason to doubt (e.g. email format, username availability)
- Group-level error summaries at the top of the form for server-side validation errors, in addition to inline field-level messages

---

## 6. Navigation and Wayfinding

Navigation is the skeleton of a product. Users should always know three things without effort: where they are, where they can go, and how to get back. If any of these is unclear, the navigation is broken regardless of how it looks.

### 6.1 Wayfinding requirements

Every screen must answer these questions passively — without requiring the user to look for the answer:

- **Where am I?** — The current location must be visually indicated in the navigation. Active state, breadcrumb, or page title. Never all three at once; pick the appropriate one for the product's depth.
- **Where can I go?** — The available destinations must be visible or one deliberate step away (e.g. opening a nav drawer). Hidden navigation that requires discovery is a failure.
- **How do I go back?** — For any flow deeper than two levels, a back affordance must exist. Browser back is not sufficient — it is a fallback, not a design.

### 6.2 Navigation pattern selection

Choose the pattern that fits the product's structure — not the one that looks most like a SaaS product:

| Pattern | Use when | Avoid when |
|---|---|---|
| **Top navigation bar** | 3–7 top-level destinations, peer relationships, no hierarchy | Product has deep nesting or many sections |
| **Left sidebar** | 5–15 destinations, hierarchy within sections, power users | Mobile-primary products; very simple products |
| **Bottom tab bar** | Mobile-primary, 3–5 top-level destinations, thumb-reachable | Desktop products; more than 5 destinations |
| **Hamburger / drawer** | Secondary navigation, infrequent destinations, mobile overflow | Primary navigation on desktop; frequent actions |
| **Breadcrumb** | Deep hierarchy (3+ levels), content-browsing products | Flat products; primary navigation (supplement, not replace) |
| **Contextual / inline** | Wizard flows, step-by-step processes, single-path tasks | Multi-destination products needing orientation |
| **Tabs** | Switching views of the same content or context | Top-level navigation; more than 6 options |

**Rules:**
- Do not combine a top nav and a left sidebar unless the product has two genuinely independent navigation dimensions (e.g. global destinations + contextual section nav)
- Mobile navigation must be thumb-reachable — top-left hamburgers fail on large phones
- Never use navigation patterns as decoration — a tabbed interface that always shows the same content is not a tab interface

### 6.3 Active and current states

The active state of a navigation item is the most important state in the system — it tells the user where they are. It must be:

- Visually unambiguous at a glance — not just a slightly different color
- Distinct from hover state — a user hovering over a nav item should not mistake it for their current location
- Persistent — it must not flicker or reset during loading states

Recommended treatments in priority order:
1. Background fill + high-contrast text (most reliable)
2. Left or bottom border accent + weight change
3. Icon fill change + label weight change (icon-primary navs)

Do not use only a color change for the active state — users with color vision deficiencies will not perceive it reliably.

### 6.4 Breadcrumbs

Use breadcrumbs when a product has three or more navigation levels and users need to understand their position in a hierarchy — not as decoration on flat products.

- Show the full path from root to current location
- Make each ancestor level a clickable link — not just the parent
- Truncate middle sections with an ellipsis (`…`) when the full path exceeds ~4 levels, preserving root and current
- Do not repeat the current page title as both the breadcrumb terminus and the page H1 — one or the other

### 6.5 Focus management across navigation

When a route change or navigation event occurs:

- Move focus to the main content area or the new page's primary heading — not to the top of the document or to the nav bar
- For single-page apps, announce the route change via an `aria-live` region: "Page changed to [destination name]"
- Preserve scroll position when navigating back, restore to top when navigating forward

---

## Part II — Implementation Rules

---

## 7. Design Tokens — Single Source of Truth

Every visual property must be expressed through tokens. No ad-hoc inline values. No one-off overrides. If a value doesn't have a token, create one before using it.

### 7.1 Typography tokens

**Typeface families:**

```
font.heading   — A distinctive display or strong sans. Not Inter. Not system-ui.
font.body      — Optimized for readability at 14–16px. Can differ from heading.
font.mono      — Only if the product benefits: dev tools, fintech, data tables.
```

**Text scale:**

```
text.2xs    — 10px / line-height 1.4   (labels, badges, legal fine print)
text.xs     — 12px / line-height 1.5   (captions, helper text, metadata)
text.s      — 14px / line-height 1.6   (secondary body, table content)
text.base   — 16px / line-height 1.7   (primary body — default)
text.m      — 18px / line-height 1.5   (lead paragraphs, emphasized body)
text.l      — 24px / line-height 1.3   (section headings, H2)
text.xl     — 32px / line-height 1.2   (page headings, H1)
text.2xl    — 48px / line-height 1.1   (hero headings, display)
text.3xl    — 64px+ / line-height 1.0  (editorial display only)
```

**Weight scale:**

```
weight.regular   — 400  (body text default)
weight.medium    — 500  (emphasized labels, active nav items)
weight.semibold  — 600  (use sparingly — sub-headings only)
weight.bold      — 700  (headings only — not body emphasis)
```

**Line length:** 55–80 characters for body text on desktop. Narrower on mobile. Enforce via `max-width` on text containers, not viewport width.

**Tracking (letter-spacing):** Only on uppercase labels at `0.06–0.1em`. Never on body text.

Do not use `system-ui` or generic `sans-serif` as the primary font unless no brand font is available.

### 7.2 Typeface selection and pairing

Defining `font.heading` and `font.body` as tokens is only half the job. Choosing the right typefaces is a design decision that shapes the entire product's personality. This section gives practical guidance for making that choice well.

**How to evaluate a heading typeface:**

The heading typeface carries the most brand weight. It should be:
- Distinctive enough to be recognizable as a choice — not just "a sans-serif"
- Legible at both large display sizes and medium heading sizes (24–32px)
- Available in at least three weights (regular, medium, bold) — single-weight display fonts are impractical for UI

Ask: if you removed all color and layout, would the heading font alone communicate the brand adjectives? A brutalist product's heading font should feel different from a luxury product's. If both could swap fonts without anyone noticing, neither made a real choice.

**How to evaluate a body typeface:**

The body typeface is read at 14–16px for sustained periods. Optimize for:
- Open counters (the enclosed spaces in letters like e, a, o) — they preserve legibility at small sizes
- Clear differentiation between similar characters: l, I, 1 — critical for passwords, codes, and data
- Comfortable default spacing — fonts that require letter-spacing corrections at body size are wrong for body use
- Neutral enough not to compete with the heading font's personality

**Pairing principles:**

Good pairings have contrast in one dimension and harmony in another:
- A high-contrast serif heading + a neutral humanist sans body (contrast: structure; harmony: warmth)
- A geometric sans heading + a humanist mono body (contrast: personality; harmony: precision)
- A condensed display heading + a wide, open body (contrast: proportion; harmony: both are contemporary)

Avoid pairing two fonts that are similar but not the same — two different humanist sans-serifs, two geometric sans-serifs. They create low-level visual tension without a clear reason.

**Reliable sources:**
- Google Fonts (free, variable fonts available): Fraunces, DM Serif Display, Space Mono, Syne, Epilogue, Instrument Serif, Anybody
- Adobe Fonts (subscription): Neue Haas Grotesk, Freight Display, Acumin, Proxima Nova
- Type foundries for custom/licensed use: Klim, Commercial Type, Grilli Type, Dinamo

**Never use these as primary heading fonts** — they are overexposed and read as default choices:
- Inter, Roboto, Open Sans, Lato (SaaS defaults)
- Montserrat, Raleway (overused in "premium" templates)
- Space Grotesk (recent AI/tech default — already a cliché)
- Playfair Display (the default "editorial" choice — used on too many blog templates)

### 7.3 Color tokens

**Surface tokens** (define for both light and dark mode explicitly):

```
color.bg.base       — Page background. Lightest surface.
color.bg.alt        — Subtle page section variant. Barely perceptible.
color.bg.surface    — Cards, panels, elevated containers.
color.bg.elevated   — Dropdowns, tooltips, popovers, modals.
color.bg.overlay    — Scrim behind modals. Semi-transparent.
```

**Text tokens:**

```
color.text.primary     — Primary readable text. Maximum contrast.
color.text.secondary   — Supporting and descriptive text. Mid contrast.
color.text.muted       — Metadata, placeholders, disabled labels.
color.text.onAccent    — Text on accent-colored backgrounds.
color.text.inverse     — Text on dark surfaces when in light mode.
```

**Accent tokens:**

```
color.accent.primary   — Core brand action. Used deliberately, < 15% surface area.
color.accent.subtle    — Tinted background for accent-adjacent surfaces.
color.accent.strong    — Darker accent for pressed states and borders.
```

**Border tokens:**

```
color.border.subtle    — Default hairline borders. Light separation.
color.border.strong    — Emphasized borders for active and highlighted states.
color.border.focus     — Keyboard focus ring. Must be high contrast — not subtle.
```

**State tokens:**

```
color.state.success       — Positive outcomes, confirmations.
color.state.success.bg    — Success tinted background surface.
color.state.warning       — Caution, needs review.
color.state.warning.bg    — Warning tinted background surface.
color.state.error         — Invalid input, destructive action, failure.
color.state.error.bg      — Error tinted background surface.
color.state.info          — Neutral informational content.
color.state.info.bg       — Info tinted background surface.
```

**Palette rules:**
- The accent palette must not be indigo or violet without explicit brand justification and customized execution
- Accent color must cover less than 15% of visible surface area per view
- Neutrals must feel specific to this product's character — warm, cool, or balanced — not default gray-50 to gray-900
- Never use color alone to communicate state — pair with icon or label

### 7.4 Radius tokens

```
radius.none  — 0       (tables, ruled layouts, inline elements)
radius.xs    — 2px     (tight chips, dense UI elements)
radius.s     — 4px     (default chips, tags, compact buttons)
radius.m     — 8px     (standard inputs, cards, default buttons)
radius.l     — 16px    (major containers, feature panels, modals)
radius.pill  — 9999px  (deliberate pill shapes only — not a default)
```

**Rules:**
- Cards use `radius.m` by default, `radius.l` only for major feature containers
- Pill shapes (`radius.pill`) are a deliberate choice for a specific element type — not a global default
- When using single-sided borders (border-left accent, border-top rule), set `border-radius: 0`
- Not everything is the same radius. Deliberate variation signals hierarchy.

### 7.5 Shadow tokens

```
shadow.low     — Subtle card depth. 1–2px y, 4–8px blur, low opacity.
shadow.mid     — Elevated surfaces, dropdowns. 2–4px y, 8–16px blur.
shadow.high    — Floating elements, modals. 4–8px y, 24–32px blur.
```

**Rules:**
- Shadows communicate elevation and interactivity — not decoration
- In dark mode, replace `shadow.low` with a `color.border.subtle` border treatment — dark cards with dark shadows are invisible
- Do not apply `shadow.high` to inline content

### 7.6 Spacing tokens

Base grid: 4px. Every spacing value must be a multiple.

```
space.2xs  — 4px    (dense list row padding, tight icon gaps)
space.xs   — 8px    (within-component gaps, icon-to-label spacing)
space.s    — 12px   (compact form element spacing)
space.m    — 16px   (standard internal padding, form field gaps)
space.l    — 24px   (between related components, card padding)
space.xl   — 32px   (between sections, major content separators)
space.2xl  — 48px   (section-level vertical rhythm)
space.3xl  — 64px   (hero sections, major page divisions)
space.4xl  — 96px   (landing page spacing, editorial sections)
```

**No magic numbers.** Every margin, padding, and gap must use a token. If a value is not on the 4px grid, fix the layout — do not invent a custom value to make it work.

### 7.7 Z-index layering tokens

Z-index values without a token system turn into an arms race — components keep incrementing to stay on top, and the result is a product full of `z-index: 9999` that nobody understands.

Define a strict layering stack and never deviate from it:

```
layer.base        — 0     (default document flow)
layer.raised      — 10    (sticky headers, floating labels, inline overlays)
layer.dropdown    — 100   (select menus, autocomplete lists, contextual menus)
layer.sticky      — 200   (sticky table headers, fixed toolbars)
layer.overlay     — 300   (drawer backdrops, non-modal overlays)
layer.drawer      — 400   (side drawers, slide-in panels)
layer.modal       — 500   (modal dialogs, lightboxes)
layer.toast       — 600   (toast notifications, snackbars — must appear above modals)
layer.tooltip     — 700   (tooltips — must appear above everything except system UI)
```

**Rules:**
- Never hardcode a z-index value — always use a layer token
- If a component needs to be above its current layer, question whether it's the right component — do not just bump the token value
- Modals must trap focus and prevent interaction with lower layers — z-index alone is not sufficient; use `inert` on the background DOM or an overlay that intercepts pointer events
- Toasts must always appear above modals — a confirmation that fires while a modal is open must still be visible

---

## 8. What "AI Slop" Looks Like — and Why It Fails

"AI slop" is a specific, diagnosable failure mode. It occurs when UI is generated by pattern-matching to the statistical average of what interfaces look like online, rather than by reasoning about a specific product, its users, and its brand. The result looks finished at a glance but contains no actual decisions.

### 8.1 Visual anti-patterns — never do these

**Color:**
- Blue-to-purple or pink-to-purple gradient backgrounds or hero sections
- Indigo or violet as the default accent with no brand justification
- Accent color at full saturation across more than 15% of the visible surface area
- Dark mode implemented by inverting the light palette

**Typography:**
- Inter as the only font for both headings and body
- `system-ui` or `sans-serif` as the primary typeface with no override
- No meaningful typographic hierarchy — headings and body are the same font at different sizes
- Only regular and bold weights, used without deliberate intention

**Layout:**
- Everything centered with no justification in the content
- Top nav + left sidebar + grid of identical stat cards — default SaaS dashboard, unreformed
- Hero section with one big card and three equal cards below it
- Massive vertical whitespace with no structural purpose

**Components:**
- Every element wrapped in a rounded gray card with a soft shadow ("cardocalypse")
- `border-radius: 9999px` on everything — all elements pill-shaped
- Heavy glassmorphism as the dominant visual motif
- Identical card treatment for content of different importance

**Imagery and icons:**
- Generic 3D blob or gradient sphere as the primary visual
- "AI brain," circuit board, or robot illustrations as the product identity
- Mixed icon styles in the same context (filled + outline + duotone)
- Default Lucide or Heroicons at their default stroke weight

**Copy:**
- "Unlock the power of X"
- "Supercharge your workflow"
- "The AI-powered platform for Y"
- "Next-generation Z for modern teams"
- Any headline that makes equal sense on a competitor's product

If the screen could be mistaken for a shadcn demo or a Tailwind UI starter, start over.

---

## 9. Component Standards

### 9.1 Component hierarchy

Define each major component once (structure, tokens, states) and reuse that definition. Do not clone a component and tweak it arbitrarily — if a variation is needed, extend the component formally and document why.

### 9.2 Card discipline — avoiding cardocalypse

Cards group closely related information or actions that need visual separation from other groups. They are not a default container for everything.

A screen should contain:
- Some cardless sections — plain content with well-set typography, no border or background required
- Some cards, with varied size and treatment reflecting differences in content importance

Cards must not:
- All be the same size when the content differs in importance
- Use the same background, border, and shadow treatment regardless of hierarchy
- Be used to wrap individual list items that read better as a plain list

### 9.3 Button hierarchy

Define exactly four levels. Each must be visually distinct from the others.

| Level | Use | Quantity |
|---|---|---|
| **Primary** | The main action for this view | One per primary context |
| **Secondary** | Alternative action of meaningful weight | One or two per view |
| **Tertiary/Ghost** | Low-emphasis supporting action | As needed |
| **Destructive** | Irreversible or dangerous actions | Separate from the primary |

Only one primary button per primary action context. If everything is a primary button, nothing is.

### 9.4 Input and form components

- Labels above inputs, always visible — not inside as placeholders
- Helper text below the input for non-trivial fields
- Error message below the input, replacing or following helper text on validation failure
- Group related fields within a labeled section

### 9.5 Data display — density over decoration

Tables and data lists must look like professional tools, not stacked cards.

- Row height: `space.xs` top/bottom padding. Not `space.l`.
- Remove vertical borders unless they genuinely aid scanning. Use horizontal rules or zebra striping.
- **Numbers right-aligned. Text left-aligned. Column headers match their data.**
- Sortable columns must show sort state visually (icon + direction)
- Row hover state required — subtle background shift
- Empty state required — not a blank table

### 9.6 Interactive states — required for every component

Every interactive component is incomplete without all states. No exceptions.

| State | Requirement |
|---|---|
| **Default** | Fully styled resting state |
| **Hover** | Clearly distinct from default. Not just a cursor change. |
| **Active/pressed** | Visibly depressed — lightened, shifted, or darkened |
| **Focus** | Keyboard-visible without hovering. High-contrast ring. Cannot be removed — only restyled. |
| **Disabled** | Reduced opacity or desaturated. Non-interactive cursor. Reason accessible via tooltip. |
| **Loading** | Spinner, skeleton, or progress indicator. Disable interaction during load. |
| **Error** | Border color change + error message. For inputs. |
| **Success** | Confirmation state. For forms and async actions. |
| **Empty** | For any component that displays data — explain why empty and what to do. |

**Focus state requirements (critical):**
- Must be visible during keyboard navigation without hover
- Must meet 3:1 contrast ratio against adjacent background
- Must never be `outline: none` without a complete custom visible replacement
- Must be visible in both light and dark mode — often requires different colors in each

---

## 10. Overlay Patterns — Modals, Drawers, and Alternatives

Overlays are among the most commonly misused patterns in UI. The default response to "this needs more space" is a modal. It is usually wrong. Every overlay type has a specific use case — using the wrong one creates friction, interrupts flow, and breaks mobile layouts.

### 10.1 Decision tree — which overlay to use

Work through this in order:

**1. Does this need to be an overlay at all?**
If the content or form can live inline (an expanded row, a sidebar panel, a new page), it should. Overlays interrupt the user's context. Only use one if the interruption is intentional and justified — confirmation dialogs, critical errors, focused creation flows where background context is irrelevant.

**2. Is user action required before continuing?**
- Yes → Modal dialog (blocks the underlying page, requires a decision)
- No → Drawer, popover, or toast (non-blocking, user can ignore or dismiss)

**3. How much content does it contain?**
- A single action or short confirmation → Modal (max 2–3 inputs, one primary action)
- A form, detail view, or multi-step flow → Drawer or new page
- A single data point or helper text → Popover or tooltip
- A status update requiring no action → Toast

**4. Does the user need to see the underlying page while interacting with the overlay?**
- Yes → Drawer (slides in from edge, keeps background visible and partially interactive)
- No → Modal (full backdrop scrim, background interaction blocked)

### 10.2 Modal dialogs

Use for: confirmation of destructive actions, critical errors requiring a decision, short focused creation flows (create new item, send a message).

**Rules:**
- One primary action per modal. The primary action must be visually dominant.
- Always include an explicit close affordance (× button) in addition to any cancel button — some users look for the × before reading the modal content
- The cancel/close action must always be lower visual weight than the primary action
- Destructive primary actions (delete, remove, disconnect) must use `color.state.error` not `color.accent.primary` — visual weight alone is not enough to signal danger
- Max width: 560px for simple dialogs, 720px for complex forms. Full-screen modals are almost never correct on desktop.
- On mobile: modals should become bottom sheets — full-width, sliding up from the bottom edge, with a visible drag handle

**Focus management:**
- On open: focus moves to the first interactive element inside the modal, or to the modal container itself if there are no inputs
- On close: focus returns to the element that triggered the modal
- Tab key must cycle only within the modal while it is open (focus trap)
- Escape key always closes the modal

### 10.3 Drawers and side panels

Use for: detail views, filter panels, settings, editing forms that benefit from keeping the underlying content visible, secondary workflows that don't require full page context.

**Rules:**
- Drawers slide in from the right edge on desktop; bottom edge on mobile
- Width: 320–480px on desktop. Never more than 50% of viewport width — the user needs to see the page they came from.
- A backdrop scrim is optional for drawers — use one when the drawer contains a form that should be submitted before returning to the background; omit it when the drawer is purely informational
- Drawers should not contain wizards or multi-step flows — if the task has multiple steps, use a modal with step indicators or a dedicated page

### 10.4 Popovers and tooltips

Use popovers for: contextual actions, inline editing triggers, secondary information that is optional to read.
Use tooltips for: label clarification on icon-only controls, truncated text expansion, keyboard shortcut hints.

**Rules:**
- Tooltips are informational only — they must not contain interactive elements (links, buttons)
- Popovers can contain interactive elements but must be dismissible via Escape and by clicking outside
- Tooltip delay: 300–500ms on hover. Zero delay on focus (keyboard users need it immediately).
- Position: prefer above or below the trigger. Only use left/right when vertical space is genuinely constrained.
- Never use a tooltip to explain a button that should just have a better label

### 10.5 Toast notifications

Use for: confirmation of async actions, non-critical status updates, undo affordances after destructive actions.

**Rules:**
- Position: bottom-center on mobile, bottom-right or top-right on desktop — consistent within a product
- Duration: 4–6 seconds for informational toasts; persistent (until dismissed) for errors and warnings
- Maximum one toast visible at a time; queue subsequent toasts
- Toasts for destructive actions must include an undo action inline: "Deleted 3 items — Undo"
- Never use a toast for errors that require user action — use a modal or inline error instead

---

## 11. Copy and Microcopy

### 11.1 Screen and section headings

Good copy names the specific user, describes the specific action or outcome, uses domain vocabulary, and makes no commitment that any other product could also make.

**Prohibited:**
- "Unlock the power of…"
- "All-in-one platform for…"
- "Supercharge your productivity"
- "Next-generation AI for…"
- "Seamlessly integrate…"
- "Built for modern teams"

The problem is not these specific phrases — it is the pattern of writing copy that could appear on any product. If the headline could belong to a competitor without modification, it is wrong.

**Bad:** "Unlock the power of your data with AI-driven insights."
**Better:** "See which of your pages are losing traffic — before your clients do."

### 11.2 Microcopy requirements

Every interactive element needs real copy, not placeholders:

| Element | Requirement |
|---|---|
| Button labels | Describe the specific action — "Save changes," "Create project," "Send invoice" — not "Submit" or "OK" |
| Empty states | Explain why it's empty and what the user should do — not "No data" or "Nothing here yet" |
| Loading states | Describe what's happening — not just an unlabeled spinner |
| Error messages | Say what went wrong and how to fix it — not "An error occurred" |
| Success states | Confirm what happened specifically — not just "Done" or a checkmark |
| Disabled state tooltips | Explain why the action is unavailable — not just a grayed-out element |
| Placeholder text | Example values only — not labels, not instructions |

---

## 12. Motion and Interaction

### 12.1 Motion principles

Motion communicates state changes, confirms actions, and guides orientation. It is not decoration.

Motion must be:
- **Subtle** — fast enough not to feel sluggish; slow enough to be perceived
- **Purposeful** — every animation has a reason: something appears, something changes, something responds
- **Consistent** — the same type of event always uses the same easing and duration

Motion must not be:
- Showy scroll effects whose only purpose is to look impressive
- Applied to every element indiscriminately
- Mismatched — different easing curves for similar events in the same product
- Blocking — animations must never prevent user interaction

### 12.2 Easing tokens

Define and apply consistently across all components:

```
ease.enter   — ease-out          (elements appearing — decelerate into resting state)
ease.exit    — ease-in           (elements disappearing — accelerate out)
ease.inout   — ease-in-out       (elements repositioning or changing state)
ease.spring  — cubic-bezier(0.34, 1.56, 0.64, 1)   (subtle overshoot — use sparingly)
```

### 12.3 Duration tokens

```
duration.instant  — 0ms    (no animation — disabled states, immediate feedback)
duration.fast     — 100ms  (hover states, small toggles, icon swaps)
duration.base     — 200ms  (most state transitions — buttons, inputs, tabs)
duration.slow     — 300ms  (reveals, dropdowns appearing, modal entrance)
duration.slower   — 500ms  (large layout shifts, page-level transitions, complex reveals)
```

**Application guide:**

| Event type | Easing | Duration |
|---|---|---|
| Button hover | `ease.inout` | `duration.fast` |
| Button press | `ease.inout` | `duration.fast` |
| Input focus ring | `ease.enter` | `duration.fast` |
| Dropdown open | `ease.enter` | `duration.slow` |
| Dropdown close | `ease.exit` | `duration.base` |
| Modal enter | `ease.enter` | `duration.slow` |
| Modal exit | `ease.exit` | `duration.base` |
| Toast appear | `ease.enter` | `duration.slow` |
| Tab switch | `ease.inout` | `duration.base` |
| Page transition | `ease.inout` | `duration.slower` |

Always wrap animations in `@media (prefers-reduced-motion: reduce)` to disable them for users who have requested it.

### 12.4 Entrance choreography — sequencing over scattering

One well-orchestrated entrance sequence is worth more than a dozen scattered microinteractions. A page load with staggered content reveals — where elements appear in a deliberate sequence that mirrors the visual hierarchy — creates a sense of craft and intention that users feel even if they can't articulate it.

**The principle:** Animate the page once, on load, in hierarchy order. Then stop. Don't animate everything on every interaction.

**How to build an entrance sequence:**

1. Identify the first-read element (heading, primary action, key status). It enters first.
2. Second-read elements follow with a stagger delay — `animation-delay: 80–120ms` per tier.
3. Third-read elements and supporting details follow last, or don't animate at all.
4. Total sequence duration should complete within 600–800ms. If the full sequence takes longer, cut elements or reduce delays.

```css
/* Example stagger pattern */
.hero-heading    { animation-delay: 0ms; }
.hero-subhead    { animation-delay: 80ms; }
.hero-cta        { animation-delay: 160ms; }
.hero-supporting { animation-delay: 240ms; }
```

**Rules:**
- Stagger by hierarchy — not by DOM order or left-to-right position
- Use `ease.enter` (`ease-out`) for all entrance animations — elements decelerate into their resting position
- Translate + fade is the most universally appropriate entrance: `transform: translateY(8px)` → `translateY(0)` combined with `opacity: 0` → `opacity: 1`
- Do not bounce, spin, or scale dramatically on entrance — these draw attention to the animation rather than the content
- After the page-load sequence, most elements should not animate on scroll — scroll-triggered animations are appropriate only for long editorial pages, not for application UIs
- Never animate structural elements (navigation, sidebars, persistent headers) on every page load — only on first visit or significant state change

---

## 13. Dark Mode

Dark mode is a required deliverable, not an optional feature. Every token must have an explicit dark-mode value.

**Rules:**
- Never implement dark mode via `filter: invert()` or CSS `color-scheme` alone
- Every `color.*` token must be defined for both themes independently — not derived
- In dark mode, shadows often become invisible. Switch to `color.border.subtle` border treatments for elevation signals on dark surfaces.
- Cards in dark mode should use subtle border differentiation, not heavy background contrast
- Focus indicators must be explicitly defined in dark mode — the light-mode ring color often fails against dark backgrounds

**Contrast verification — required before shipping dark mode:**

| Token pair | Minimum ratio |
|---|---|
| `color.text.primary` on `color.bg.base` | 7:1 (preferred) / 4.5:1 (minimum) |
| `color.text.secondary` on `color.bg.base` | 4.5:1 |
| `color.text.muted` on `color.bg.surface` | 3:1 |
| `color.text.onAccent` on `color.accent.primary` | 4.5:1 |
| State text on respective `.bg` tints | 4.5:1 |
| Focus ring against adjacent background | 3:1 |

---

## 14. Loading and Skeleton States

Loading states are not an afterthought — they are part of the component's design. A loading state that doesn't match the component's loaded layout causes jarring layout shifts that erode perceived performance even when actual performance is fast.

### 14.1 Choosing the right loading pattern

| Pattern | Use when | Avoid when |
|---|---|---|
| **Skeleton screen** | Content has a predictable layout (lists, cards, profile pages) | Content shape is unknown or highly variable |
| **Spinner (inline)** | A single element or small area is loading | Full-page loads; content with known layout |
| **Spinner (full-page)** | Entire page or route is loading and layout is unknown | Any case where a skeleton is feasible |
| **Progress bar** | Operation has measurable progress (upload, multi-step process) | Operations with no reliable progress signal |
| **Optimistic UI** | Action result is nearly certain and reversible (toggle, like, reorder) | Destructive or irreversible actions |

### 14.2 Skeleton screen design

Skeletons must match the shape of the content they represent. A skeleton that doesn't match the loaded layout causes layout shift — which is worse than a plain spinner because it creates a false expectation.

**Rules:**
- Match the skeleton to the loaded component's exact structure: same number of lines, same image aspect ratio, same card dimensions
- Use `color.bg.alt` for skeleton blocks with a shimmer animation moving left-to-right
- Shimmer animation: `background-position` shift from `-200%` to `200%` over 1.5–2s, `ease.inout` easing, looped
- Skeleton text lines should reflect approximate real content length — not all the same width. Vary: 100%, 80%, 60% for a three-line block.
- Never show skeleton states for less than 200ms — a flash of skeleton followed by real content looks like a glitch; use a 200ms delay before showing the skeleton at all

```css
/* Skeleton shimmer base */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-alt) 25%,
    var(--color-bg-surface) 50%,
    var(--color-bg-alt) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 14.3 Optimistic UI

Optimistic UI shows the result of an action immediately, before the server confirms it. It improves perceived speed for reversible, high-certainty operations.

**Appropriate for:** toggles (follow/unfollow, like/unlike), reordering, checkbox completion, non-critical preference saves.

**Not appropriate for:** payment submission, account deletion, sending messages, any operation where failure would be surprising or consequential.

**Requirements:**
- Always provide an undo affordance via a toast notification ("Unfollowed — Undo")
- On failure, revert the UI state and show an inline error explaining what happened
- Never use optimistic UI for operations where the server might reject the action based on business logic the client doesn't know about (permission checks, quota limits, validation)

---

## 15. Responsive Behavior

Mobile-first is a code discipline — write base styles for the smallest viewport, then add complexity at larger breakpoints. This section covers the design decisions that responsive behavior requires.

### 15.1 Breakpoint strategy

Define breakpoints based on content needs, not device names:

```
bp.xs   — 320px   (small phones — minimum supported width)
bp.s    — 480px   (large phones, portrait)
bp.m    — 768px   (tablets, landscape phones)
bp.l    — 1024px  (small desktops, tablets landscape)
bp.xl   — 1280px  (standard desktop)
bp.2xl  — 1536px  (large desktop, wide monitors)
```

**Rules:**
- Design for `bp.xs` first. If it works at 320px, it works everywhere.
- Do not add a breakpoint for every device — add one when the layout genuinely breaks or wastes space
- Breakpoints are not device targets — a 768px breakpoint does not mean "tablet layout." It means the layout changes at that width, wherever that occurs.

### 15.2 Component reflow patterns

Components that work on desktop often need a fundamentally different treatment on mobile — not just smaller versions of themselves:

| Component | Desktop | Mobile |
|---|---|---|
| **Data table** | Full columns | Priority columns only; or card-per-row; or horizontal scroll with frozen first column |
| **Multi-column form** | 2–3 column fields | Single column, stacked |
| **Navigation** | Left sidebar or top nav | Bottom tab bar or hamburger drawer |
| **Split pane** | Side-by-side master + detail | Full-screen list → full-screen detail (drill-down) |
| **Modal** | Centered dialog with backdrop | Bottom sheet, full-width |
| **Toolbar** | Horizontal row of actions | Overflow menu (…) with top 2–3 actions exposed |
| **Card grid** | 3–4 column grid | Single column or 2-column, reduced padding |

**The data table on mobile is a real design problem.** Horizontal scrolling is acceptable for data-heavy tools where users expect it. For product UI, prefer a card-per-row layout that surfaces the 2–3 most important fields with an expand affordance. Define which columns are "priority" columns at design time — not at implementation time.

### 15.3 Touch interaction

- Minimum tap target: 44×44px
- Swipe gestures: only use for patterns users already expect — dismiss a toast, swipe back. Do not invent novel swipe interactions.
- Long press: only when a secondary action is genuinely secondary and an alternative exists — long press is not discoverable
- Hover states do not exist on touch. Any functionality that only appears on hover is inaccessible on mobile. All hover-revealed content must have a touch-accessible equivalent.

### 15.4 Viewport and content safety

- Never use `100vw` for full-width elements — on mobile this includes the scrollbar width and causes horizontal overflow. Use `100%` instead.
- Safe area insets for notched devices: use `env(safe-area-inset-bottom)` for fixed bottom bars and floating action buttons
- Minimum body font size on mobile: 16px. Below this, iOS auto-zooms inputs on focus, causing a jarring layout shift.

---

## 16. Accessibility

Accessibility is built in from the start, not added at the end.

### 16.1 Contrast

- Body text on background: minimum 4.5:1 (WCAG AA)
- Large text (18px+ regular, 14px+ bold): minimum 3:1
- Interactive component boundaries (input borders, button outlines): minimum 3:1 against adjacent background
- Focus indicators: minimum 3:1

Never rely on color alone to convey meaning or state. All state changes must include an icon or label alongside the color change.

### 16.2 Keyboard navigation

Every interactive element must be reachable and operable by keyboard. Tab order must follow visual flow. Do not use `tabindex="-1"` to remove elements from focus without a keyboard-accessible alternative.

### 16.3 Hit areas

Minimum 44×44px hit area on all interactive elements, regardless of visual size. Use padding or a pseudo-element to expand the hit area without changing the visible element.

### 16.4 Semantic HTML and ARIA

- Use semantic HTML elements: `<button>` for actions, `<a>` for navigation, `<h1>`–`<h6>` for headings, `<nav>`, `<main>`, `<aside>` for landmark regions
- Icon-only buttons must have `aria-label`
- Form inputs must be associated with a label via `for`/`id` or `aria-labelledby`
- Dynamic content updates must use `aria-live` regions
- Do not overuse ARIA — semantic HTML takes precedence; ARIA fills the gaps

---

## 17. Iconography in Depth

### 17.1 When icons add value and when they don't

Icons add value when:
- The concept is universal and the icon communicates it faster than text (home, search, close, settings)
- They supplement a label to improve scannability in dense contexts (status icons in tables, category icons in lists)
- Space precludes a full text label and the icon is unambiguous in context

Icons do not add value when:
- They are decorative — placed beside text purely to break up visual monotony
- The meaning is ambiguous without the label (a "flame" for trending, a "sparkle" for AI, a "bolt" for speed — none of these are universal)
- The same action is conveyed by label alone with complete clarity

**Rule:** If removing the icon would not change whether the user understands the element, remove the icon.

### 17.2 Sizing and optical alignment

Icons set to `1em` are rarely the right size. Most icon sets have internal padding that makes them appear smaller than adjacent text at equal size.

| Context | Icon size | Notes |
|---|---|---|
| Inline with body text (16px) | 16–18px | May need `position: relative; top: -1px` for optical centering |
| Inline with small text (14px) | 14–16px | |
| Button with label | 16–20px | Align to cap-height, not baseline |
| Standalone action (no label) | 20–24px | Smaller is ambiguous |
| Feature / illustrative | 24–32px | Use consistently across the feature set |

**Optical alignment:** Icons and text are often optically misaligned when centered purely by CSS — the visual center of most icons is not their mathematical center. Use `align-items: center` as a baseline, then adjust with `position: relative; top: ±1px` based on the specific icon and font pairing.

### 17.3 Icon-only controls

Icon-only controls are appropriate only when:
- The icon is genuinely universal (× for close, ← for back, ⋯ for more options)
- Dense context makes a label impractical
- Surrounding context makes the action obvious

Every icon-only control requires:
- `aria-label` describing the action, not the icon ("Close dialog" not "X button")
- A tooltip on hover showing the same text
- On mobile: either a visible label, or a sufficiently large hit area with the label available on long press

### 17.4 Consistency rules

- Use exactly one icon library. Not one for most icons and another "for the ones we couldn't find."
- Lock the stroke weight for outline icons across the entire product. A `stroke-width` of 1.5 and 2 in the same view reads as unfinished.
- Lock the corner rounding for outline icons. Mixed round and sharp corners at the same size is a tell.
- Icon color must use a color token — never a hardcoded value
- Supplementary/decorative icons: `color.text.muted`
- Interactive or primary-action icons: `color.text.primary` or `color.accent.primary`

---

## 18. Reduced Motion and Print

### 25.1 Reduced motion

The `prefers-reduced-motion: reduce` media query is not just about accessibility compliance — it signals that a user has explicitly opted out of motion for reasons that may include vestibular disorders, epilepsy, or migraine sensitivity. Treat it with the same seriousness as contrast requirements.

**Rules:**
- Every animation and transition in the product must be wrapped in or overridden by `@media (prefers-reduced-motion: reduce)`
- "Reduced" does not mean "removed" — it means instant or near-instant state changes with no easing curves. A button can still change color on press; it just doesn't animate.
- The correct reduced-motion fallback for most transitions is `transition: none` and `animation: none`
- Exceptions: progress indicators (spinners, progress bars) can use a static or minimal version — a spinning loader can become a pulsing dot

```css
/* Apply to all transitions globally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Test this.** Enable "Reduce Motion" in your OS accessibility settings and navigate through the product. Any remaining animation that feels jarring or disorienting is a failure.

### 25.2 Print styles

Products that display information users may need to print or save as PDF (invoices, reports, itineraries, reference documents) require explicit print styles.

**Rules:**
- Define a `@media print` block for any product where printing is a reasonable use case
- Hide: navigation, sidebars, buttons, interactive controls, ads, chat widgets, cookie banners
- Show: all content, including content hidden behind accordions or tabs — print readers cannot expand them
- Set body font to black on white. Remove background colors and images unless they are essential to understanding the content (charts, diagrams).
- Set font size to 12pt minimum for print. Screen sizes do not translate directly.
- Use `page-break-inside: avoid` on cards, table rows, and figures — broken content across pages is hard to read

```css
@media print {
  nav, aside, .sidebar, .toolbar, button, .toast { display: none !important; }
  body { color: #000; background: #fff; font-size: 12pt; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 10pt; }
  .card, tr, figure { page-break-inside: avoid; }
}
```

---

## 19. Focus Management for Dynamic Content

Focus management is the most commonly missing accessibility implementation. Keyboard and screen reader users rely on focus being in the right place — when dynamic content changes, focus often ends up stranded or lost.

### 19.1 When to move focus

| Event | Where to move focus |
|---|---|
| Modal opens | First interactive element inside modal, or modal container with `tabindex="-1"` if no interactive elements |
| Modal closes | Element that triggered the modal |
| Drawer opens | First interactive element inside drawer |
| Drawer closes | Element that triggered the drawer |
| Route / page change (SPA) | Main content `<h1>` or `<main>` element (use `tabindex="-1"` to make it focusable without it being in tab order) |
| Inline content expands (accordion) | The expanded content container |
| Toast appears | Do not move focus — use `aria-live` region instead |
| Form step advances | The new step's heading or first input |
| Error summary appears | The error summary container |

### 19.2 Focus trapping

Modals, dialogs, and drawers must trap focus — tab must cycle only within the overlay while it is open. Users must not be able to tab to background content behind a modal.

Implementation pattern:
1. On open: find all focusable elements within the overlay (`a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])`)
2. Add `keydown` listener: on Tab, if the last focusable element is focused, wrap to the first; if Shift+Tab on the first, wrap to the last
3. On close: remove listener and return focus to the trigger element

### 19.3 Skip links

Every product must have a skip navigation link as the first focusable element on each page. It allows keyboard users to skip past repeated navigation to the main content.

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

The skip link is visually hidden by default but becomes visible on focus:

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: var(--space-s) var(--space-m);
  background: var(--color-accent-primary);
  color: var(--color-text-onAccent);
  z-index: var(--layer-tooltip);
}
.skip-link:focus { top: 0; }
```

---

## 20. New Project Bootstrap Sequence

Starting a new product from zero has a correct order of operations. Getting this sequence wrong means rebuilding decisions later — defining a color palette before locking a typeface, building components before establishing spacing, designing screens before mapping information architecture. This section defines the sequence.

### 25.1 Phase 1 — Information architecture before any screens

Before designing a single screen, map the full product:

**1. Define the user's primary jobs to be done.**
List the 3–5 core tasks the product exists to support. Everything else is secondary. These jobs map directly to the product's top-level navigation sections.

**2. Inventory all screens.**
List every distinct view the product needs. Name each one clearly ("Invoice detail", not "Page 4"). Group into sections that share navigation context.

**3. Map the primary user flows.**
For each primary job, trace the path a user takes from entry to completion. Identify:
- Entry points (where does the user start?)
- Decision points (where can they go in multiple directions?)
- Terminal states (what does "done" look like?)
- Error paths (what happens when something goes wrong?)

**4. Validate the IA before building.**
The navigation structure should emerge from the screen inventory and flows — not from assumption. If you have 12 screens and only 3 nav items, some groupings are doing too much work. If you have 8 nav items for 6 screens, the structure is over-engineered.

Only after this phase is complete should you start designing individual screens. The pre-code process in Section 2 applies per-screen. This phase applies to the product.

### 25.2 Phase 2 — Design system bootstrap sequence

When establishing a design system from zero, build in this order. Each layer depends on the one before it.

**Step 1: Lock the typeface pairing.**
Typography shapes everything — spacing, layout density, component sizing. Choose heading and body fonts before touching color. See Section 7.1–7.2.

The typeface decision should take into account: licensing (self-hosted vs. CDN), variable font availability (reduces weight bloat), rendering quality on both Mac and Windows, and fallback stack behavior.

**Step 2: Establish the spacing scale.**
Define the 4px base grid and the full token set from `space.2xs` to `space.4xl`. Every future spacing decision references this scale. See Section 7.6.

**Step 3: Define the color palette.**
With typefaces and spacing locked, define the full color token set. Start with neutrals (bg.base through bg.elevated), then accent, then state colors. Define both light and dark mode values for every token at this step — retrofitting dark mode later costs significantly more time. See Section 7.3.

**Step 4: Define radius, shadow, and layer tokens.**
These are quick to define and almost never change. Lock them now so components are consistent from the first one built. See Sections 7.4, 7.5, 7.7.

**Step 5: Build the base component set.**
Build in this order — each depends on the previous:
1. Typography components (heading levels, body, caption, label)
2. Button hierarchy (all four levels, all states)
3. Form inputs (text input, textarea, select — all states)
4. Card (base card, with `radius.m` and `shadow.low`)
5. Navigation shell (top bar or sidebar — whichever the IA requires)

Do not build specialist components (data tables, modals, charts) until the base set is complete and visually consistent.

**Step 6: Build the first real screen — the empty state of the most important view.**
The first screen to build is not the landing page or the onboarding flow. It is the primary view of the product in its empty state — the screen a new user sees immediately after setup. This forces every token and component to be used together in context for the first time, and surfaces inconsistencies before they propagate.

### 25.3 Phase 3 — CSS architecture

How the token system is implemented in code determines how maintainable it is. Decide the architecture before writing a single component.

**Choose one implementation strategy and stick to it:**

| Strategy | Best for | Avoid when |
|---|---|---|
| **CSS custom properties** (native variables) | Any project — universal, framework-agnostic, runtime-themeable | Never avoid — this is the default |
| **Utility classes** (Tailwind, UnoCSS) | Rapid prototyping, teams comfortable with the mental model | When design tokens need runtime switching (e.g. user-selectable themes) |
| **CSS-in-JS** (styled-components, Emotion) | React-heavy projects needing component-scoped styles | SSR-heavy apps (hydration cost); non-JS environments |
| **CSS Modules** | Projects needing scoped styles without runtime cost | When token sharing across components is frequent |

For most projects: **CSS custom properties for tokens + CSS Modules or utility classes for components**. This gives you runtime-themeable tokens with scoped component styles and no runtime cost.

**File structure for CSS custom properties:**

```
/styles
  /tokens
    _typography.css     — font-family, font-size, line-height, tracking tokens
    _colors.css         — all color tokens, light + dark mode
    _spacing.css        — space.* tokens
    _radii.css          — radius.* tokens
    _shadows.css        — shadow.* tokens
    _layers.css         — layer.* z-index tokens
    _motion.css         — ease.* and duration.* tokens
  /base
    _reset.css          — CSS reset / normalize
    _root.css           — imports all token files, sets :root variables
    _typography.css     — base prose styles (p, h1-h6, lists)
  /components
    button.css
    input.css
    card.css
    ...
  main.css              — imports base, components in order
```

**Token naming convention for CSS custom properties:**

Map token dot-notation to kebab-case with double-dash prefix:

```css
:root {
  /* color.bg.base → --color-bg-base */
  --color-bg-base: #ffffff;
  --color-bg-surface: #f8f7f4;
  --color-text-primary: #1a1916;
  --color-accent-primary: #c84b2f;

  /* space.m → --space-m */
  --space-m: 16px;
  --space-l: 24px;

  /* radius.m → --radius-m */
  --radius-m: 8px;

  /* layer.modal → --layer-modal */
  --layer-modal: 500;

  /* duration.base → --duration-base */
  --duration-base: 200ms;
  --ease-enter: ease-out;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-base: #141412;
    --color-bg-surface: #1e1d1a;
    --color-text-primary: #e8e6df;
    /* ... all color tokens redefined */
  }
}
```

**Rules:**
- Every token defined in the spec has a corresponding CSS custom property — no exceptions
- Components reference only token variables — never raw values
- Dark mode is defined via `prefers-color-scheme` media query on `:root` — not via a `.dark` class unless runtime switching is explicitly required
- Never define a CSS custom property in a component file — tokens live only in token files

---

## 21. Information Architecture Patterns

### 21.1 Screen inventory template

Before designing, complete this inventory. One row per distinct screen.

| Screen name | User type | Job | Entry points | Exit points | Data dependencies | Empty state needed? | Notes |
|---|---|---|---|---|---|---|---|
| Invoice list | Billing admin | Review all invoices | Nav: Billing | Invoice detail, Create invoice | invoices[] | Yes — first-run | Default sort: newest first |
| Invoice detail | Billing admin | Review single invoice | Invoice list | Invoice list, Download PDF | invoice, lineItems[] | No | Read-only view |
| Create invoice | Billing admin | Create new invoice | Invoice list CTA | Invoice list (on save/cancel) | clients[], products[] | N/A | Multi-step form |

Fill in every row before designing any screen. If you cannot fill in the "job" column, the screen should not exist.

### 21.2 User flow notation

Document primary flows before building them. Use this lightweight notation:

```
[Entry point] → Screen name → (Decision: label) → Screen A
                                                 → Screen B
                           → Terminal: label
                           → Error: label → Recovery screen
```

Example:
```
[Nav: Invoices] → Invoice list → (Action: New invoice) → Create invoice → (Save) → Invoice detail
                                                                         → (Cancel) → Invoice list
                              → (Row click) → Invoice detail → (Download) → Terminal: PDF saved
                                                             → (Delete) → (Confirm modal) → Invoice list
                                                                        → (Cancel) → Invoice detail
```

Keep flows to one page. If a flow diagram spans more than one page, it needs to be split into sub-flows.

### 21.3 Navigation depth rules

- **Flat (1 level):** 3–7 top-level destinations, no hierarchy. Appropriate for simple tools and single-purpose apps.
- **Two levels:** Top-level nav sections + sub-navigation within sections. Maximum 5 sub-items per section. Appropriate for most SaaS products.
- **Three levels:** Top-level + section + item. Avoid. Three levels of navigation means the IA is carrying too much. Consider whether content can be reorganised, filtered, or searched instead of navigated.
- **Deeper than three levels:** Almost always wrong. Restructure the IA before building.

---

## 22. Empty States and First-Run Experience

Empty states are not edge cases — for a new product, they are the *first* thing every user sees. They are a design category requiring as much attention as any populated state.

### 22.1 Types of empty states

| Type | Occurs when | Design goal |
|---|---|---|
| **First-run / onboarding** | User has just signed up, no data exists | Show value; motivate first action; reduce intimidation |
| **User-created empty** | User deleted all items or hasn't created any yet | Acknowledge the state; provide the primary action |
| **Filtered empty** | User applied filters that return no results | Explain why; offer to clear filters |
| **Search empty** | Search returns no matches | Explain; suggest alternatives or broader terms |
| **Error empty** | Data failed to load | Explain clearly; provide recovery action |
| **No-permission empty** | User lacks access to this content | Explain what they're missing; who to contact |

Each type requires distinct copy and distinct actions. Do not use a single generic "no data" empty state for all of these.

### 22.2 First-run experience design

The first-run experience is the product's most important UX moment. A user who doesn't see value in the first session rarely returns.

**Principles:**

- **Show value before asking for work.** Don't start with a 6-field setup form. Show the user what the product looks like when it's working — even if with demo data — before asking them to populate it.
- **One first action, clearly signposted.** The first-run screen has one primary CTA. Not three options. Not a wizard with eight steps. One next step.
- **Sample/demo data is legitimate.** Showing the product with realistic demo content is not dishonest — it is helpful. It lets the user see what they're building toward. Provide a clear way to clear demo data when the user is ready.
- **Progressive disclosure.** Don't require full setup to get to a useful state. Let users start with the minimum viable configuration and discover additional settings through use.

**First-run empty state anatomy:**

```
[Illustration or product preview — optional, brand-specific]

[Heading: What this screen will show when it has data]
[Subheading: One-sentence benefit statement, not a feature list]

[Primary CTA: The single most important first action]
[Secondary link: "Import from X" or "See an example" — optional]
```

The illustration, if used, must be product-specific — not a generic "empty box" or 3D blob. A sketch of the actual UI populated with example data is more effective than any illustration.

### 22.3 Empty state copy rules

- The heading describes what the screen will contain when it has data — not the absence of data. "Your invoices will appear here" is better than "No invoices yet."
- The subheading gives a single concrete benefit. "Send professional invoices in under 2 minutes" — not "Create invoices to bill your clients."
- The CTA label is specific: "Create your first invoice" — not "Get started" or "Add new."
- Never use: "Nothing here", "No data", "Empty", "N/A", "—" as standalone empty states without context.

### 22.4 Onboarding checklist patterns

For products requiring setup before the user can get value (connecting accounts, adding team members, importing data), a checklist-style onboarding dashboard is often appropriate.

**Rules:**
- Maximum 5 items. If setup requires more than 5 steps, group them or reconsider what's truly required upfront.
- Show progress (e.g. "2 of 5 complete") — not just a list of unchecked items.
- Each item must have a clear CTA that goes directly to the action — not to a documentation page.
- Completed items remain visible and checked — they provide positive reinforcement and show progress.
- The checklist should be dismissible once a meaningful subset is complete (typically 3 of 5) — don't hold users hostage to full setup.
- Once dismissed, it must be findable again (settings, help menu) — users may want to return.

---

## 23. Component API Design

Components are interfaces, not just visual objects. A component with a bad API will be used incorrectly, leading to inconsistencies that undermine the design system. This section defines what makes a component API well-designed.

### 23.1 Variant props vs. composition

The central tension in component API design is between configurability and flexibility:

**Variant props** control predefined variations of a component:
```jsx
<Button variant="primary" size="lg" loading={true}>Save</Button>
```

**Composition** builds complex components from simpler ones:
```jsx
<Button>
  <Icon name="save" />
  Save changes
</Button>
```

**Rule:** Use variant props for variations that must stay visually consistent across the product (button hierarchy, input size, card elevation). Use composition for variations that are context-specific and don't need system-wide consistency (icon placement, label formatting, embedded content).

If you find yourself adding a prop for every possible visual permutation (`hasIcon`, `iconPosition`, `iconSize`, `iconColor`), the component is doing too much — switch to composition.

### 23.2 Required vs. optional props

- Props that directly affect accessibility (`aria-label` on icon-only buttons, `alt` on images) should be **required** — not optional with a fallback.
- Props that affect visual appearance should be **optional with sensible defaults** — a button without a `size` prop should default to `md`, not throw an error.
- Props that accept arbitrary values (raw CSS, inline styles, arbitrary classNames for overrides) should not exist on design system components. They create escape hatches that bypass the token system. If an override is needed, add a new variant instead.

### 23.3 Naming conventions for props

| Pattern | Correct | Avoid |
|---|---|---|
| Boolean props | `disabled`, `loading`, `selected` | `isDisabled`, `isLoading`, `isSelected` (redundant `is` prefix) |
| Variant enums | `variant="primary"` | `type="primary"` (conflicts with HTML `type` attribute) |
| Size enums | `size="sm"` \| `"md"` \| `"lg"` | `small={true}` (Boolean explosion) |
| Event handlers | `onClick`, `onChange`, `onSubmit` | `handleClick`, `clickHandler` |
| Slot content | `children` for primary content | `content`, `body`, `text` (non-standard) |
| Named slots | `startIcon`, `endIcon`, `footer` | `left`, `right`, `bottom` (directional — breaks RTL) |

### 23.4 The component contract

Every component in the design system must document:

1. **Purpose** — One sentence. What is this component for?
2. **Variants** — All valid variant/size/state combinations with visual examples
3. **Props table** — Name, type, default, required, description for every prop
4. **Usage rules** — When to use, when not to use, what it should never contain
5. **Accessibility** — Keyboard behaviour, ARIA roles, screen reader output
6. **Token mapping** — Which design tokens this component consumes

Without this contract, components get used in ways they weren't designed for, and the design system silently breaks.

### 23.5 Component extension pattern

When a component needs a variation that doesn't fit the existing prop set, extend rather than fork:

```jsx
// Don't clone Button and modify it
const IconButton = ({ icon, ...props }) => (
  <Button {...props}>
    <Icon name={icon} />
  </Button>
);
```

A forked component that starts as "Button but for icons" becomes a second, slightly different button that drifts independently. Extend with composition. The original component's token mapping and state handling are preserved.

---

## 24. Decision Log

Design decisions that aren't documented get relitigated. This is expensive the first time and demoralising every subsequent time. A decision log captures the *why* behind choices so that future contributors understand the constraints that led to them.

### 24.1 What to log

Log any decision that:
- Will not be obvious from the code or the design file
- Required a trade-off between two reasonable options
- Is likely to be questioned by a future contributor
- Represents a deviation from a convention or default

Typical entries include: typeface selection rationale, color palette choices, spacing scale derivation, navigation pattern selection, any place where the spec was deliberately violated with justification.

### 24.2 Decision log format

Keep entries short. A decision log is not a design document — it is a reference for future-you and future-contributors.

```
## [Component or area name]
**Date:** YYYY-MM-DD
**Decision:** [What was decided, in one sentence]
**Options considered:** [The alternatives that were evaluated]
**Rationale:** [Why this option was chosen over the others]
**Trade-offs:** [What was given up by making this choice]
**Revisit when:** [Condition under which this decision should be reconsidered, if any]
```

Example:
```
## Heading typeface
**Date:** 2024-03-15
**Decision:** Fraunces (variable, optical size axis) for headings
**Options considered:** DM Serif Display, Instrument Serif, custom wordmark
**Rationale:** Fraunces has an optical size axis that works at both 64px display
and 24px section headings without manual adjustments. Instrument Serif looked
too neutral against our warm earthy palette. DM Serif Display has no variable
axis, requiring multiple weight files.
**Trade-offs:** Less neutral than Instrument Serif — commits us to an editorial
direction that may feel wrong if the product pivots toward enterprise/B2B.
**Revisit when:** Product moves significantly upmarket or rebrands.
```

### 24.3 Where to store it

- Co-locate with the codebase: `/docs/design-decisions.md`
- Keep it in version control — decisions should be as traceable as code changes
- Link to it from the README so new contributors find it immediately
- Do not put it in Notion, Confluence, or any tool that is not version-controlled alongside the code — it will drift and become stale

---

## 25. Self-Check Before Shipping

Run this checklist on every screen. Do not ship if any item is marked no.

### 25.1 UX clarity

- [ ] Can a user identify what this screen is for within 3 seconds?
- [ ] Is the primary action immediately visible and accessible?
- [ ] Is there a clear three-level visual read (first, second, third)?
- [ ] Does every element on the screen serve the screen's defined job?
- [ ] Are labels specific, action-oriented, and jargon-free for this audience?

### 25.2 Visual anti-patterns

- [ ] Does any background use a blue-to-purple or pink-to-purple gradient? → Remove.
- [ ] Is Inter the only font? → Add a distinctive heading typeface.
- [ ] Is the accent color indigo or violet with no brand justification? → Change.
- [ ] Are more than 60% of content elements wrapped in identical rounded cards? → Reduce.
- [ ] Is `border-radius: 9999px` applied to more than one element type? → Restrict.
- [ ] Is glassmorphism the primary visual motif? → Remove or reduce to one deliberate usage.
- [ ] Could this screen be mistaken for a shadcn demo? → It needs more specificity.

### 25.3 Token compliance

- [ ] Are there any magic numbers in spacing (not on the 4px grid)? → Replace.
- [ ] Are there any hardcoded color values not from the token system? → Replace.
- [ ] Are there any font-size values not in the defined scale? → Replace or add a token.
- [ ] Are dark-mode values explicitly defined for every color token? → Define them.

### 25.4 State completeness

- [ ] Does every button have hover, active, focus, and disabled states?
- [ ] Does every input have hover, focus, error, disabled, and filled states?
- [ ] Is the focus state keyboard-visible on every interactive element?
- [ ] Are loading states handled for all async actions?
- [ ] Is there an empty state for every data-displaying component?
- [ ] Are destructive actions guarded with a confirmation step?

### 25.5 Dark mode

- [ ] Are all color token pairs verified for contrast in dark mode (not assumed)?
- [ ] Are card shadows replaced with borders in dark mode where needed?
- [ ] Are focus rings visible in dark mode?
- [ ] Is any surface illegible or invisible in dark mode?

### 25.6 Copy

- [ ] Does any headline use prohibited generic marketing language?
- [ ] Do button labels describe the specific action?
- [ ] Do empty states explain why and what to do?
- [ ] Do error messages say what went wrong and how to fix it?
- [ ] Are loading states labeled with context?

### 25.7 Accessibility

- [ ] Do all text elements meet minimum contrast ratios?
- [ ] Is every interactive element keyboard-reachable with a visible focus state?
- [ ] Do interactive elements have 44×44px minimum hit areas on mobile?
- [ ] Are icon-only buttons labeled for screen readers?
- [ ] Are form inputs associated with visible labels?
- [ ] Do state changes use both color and a secondary indicator (icon or label)?
- [ ] Is there a skip navigation link as the first focusable element?
- [ ] Does focus return to the trigger element when a modal or drawer closes?
- [ ] Is focus trapped within open modals and drawers?

### 25.8 Navigation

- [ ] Does the active navigation item have a visually unambiguous active state?
- [ ] Is the active state distinct from the hover state?
- [ ] Does the user always know where they are in the product without looking for the answer?
- [ ] On mobile, is primary navigation thumb-reachable?
- [ ] For SPAs, is there a route-change announcement for screen readers?

### 25.9 Overlays

- [ ] Is every modal limited to one primary action?
- [ ] Does every modal have an explicit close affordance (×)?
- [ ] Does the Escape key close all modals, drawers, and popovers?
- [ ] Do destructive modal actions use error color, not accent color?
- [ ] Do toasts for destructive actions include an undo option?
- [ ] Are overlays using the correct pattern for their content type (modal vs. drawer vs. toast)?

### 25.10 Responsive

- [ ] Does the layout work at 320px without horizontal scrolling?
- [ ] Are all hover-only interactions replaced with touch alternatives on mobile?
- [ ] Does any data table have a defined mobile treatment (not just horizontal scroll)?
- [ ] Are fixed bottom bars using `env(safe-area-inset-bottom)` for notched devices?
- [ ] Is body font size at least 16px on mobile?

### 25.11 Motion and reduced motion

- [ ] Are all animations wrapped in or overridden by `prefers-reduced-motion: reduce`?
- [ ] Does the product function without any motion when reduced motion is enabled?
- [ ] Does the entrance choreography complete within 600–800ms?
- [ ] Are structural elements (nav, sidebar) not animated on every page load?

### 25.12 New project (run once at project start)

- [ ] Is the full screen inventory complete before any screens were designed?
- [ ] Is the primary user flow documented for each core job-to-be-done?
- [ ] Were tokens defined in bootstrap order (typeface → spacing → color → radius/shadow/layer)?
- [ ] Is a CSS architecture chosen and documented before the first component was built?
- [ ] Does every screen have a defined empty state treatment?
- [ ] Is there a decision log file in version control?
- [ ] Is the first-run experience designed as a distinct flow, not an afterthought?

---

## 26. Automated Enforcement Hooks

If automated checks are added to the pipeline, codify these rules:

| Check | Rule |
|---|---|
| Gradient detector | Flag `background` containing purple, violet, indigo, or pink in any gradient |
| Centered content ratio | Flag screens where >60% of content nodes use `text-align: center` or `margin: auto` |
| Radius homogeneity | Flag when the same `border-radius` value appears on >3 distinct element types |
| Shadow proliferation | Flag when `box-shadow` is applied to >40% of visible elements |
| Slogan detector | Flag copy matching any phrase from the Section 9.1 prohibited list |
| Magic number detector | Flag any spacing value not divisible by 4 |
| Dark mode completeness | Flag any CSS custom property without a corresponding dark-mode override |
| Contrast checker | WCAG audit on all text/background pairs in both modes |
| Icon style audit | Flag when filled and outline icon variants appear in the same view |
| Focus detector | Flag any `outline: none` or `outline: 0` without a visible custom replacement |

These tools are advisory. This spec is the source of truth.

---

## 27. Working Vocabulary

| Term | Definition |
|---|---|
| **AI slop** | UI generated by statistical pattern-matching rather than product-specific reasoning |
| **Bootstrap sequence** | The correct order of operations for establishing a design system from zero: typeface → spacing → color → radius/shadow/layer → base components → first real screen |
| **Brand adjectives** | 3–5 words describing the product's personality, used to anchor all design decisions |
| **Breakpoint** | A viewport width at which the layout meaningfully changes — defined by content needs, not device names |
| **Cardocalypse** | A screen where all content is wrapped in visually identical rounded cards |
| **Component contract** | The documentation that defines a component's purpose, variants, props, usage rules, accessibility, and token mapping |
| **Decision log** | A version-controlled record of design decisions, the options considered, and the rationale — stored alongside the codebase |
| **Design token** | A named, reusable design value (color, size, spacing) — single source of truth |
| **Elevation** | The perceived depth of a surface, communicated via shadow or border treatment |
| **Entrance choreography** | A staggered reveal sequence on page load that animates elements in hierarchy order |
| **First/second/third read** | The three levels of visual hierarchy a viewer's eye should follow naturally |
| **First-run experience** | The designed flow a new user encounters before they have any data — the product's most critical UX moment |
| **Focus trap** | Constraining Tab navigation to within an overlay (modal, drawer) while it is open |
| **Information architecture (IA)** | The structure of all screens, their relationships, and the navigation paths between them — defined before any screen is designed |
| **Job to be done** | A specific task a user needs to accomplish — the unit of analysis for IA and screen design |
| **Layer token** | A named z-index value that places a component at a defined point in the stacking order |
| **Magic number** | A spacing or size value not derived from the token scale — always a defect |
| **Optimistic UI** | Showing the result of an action immediately before server confirmation, with rollback on failure |
| **Screen inventory** | A complete list of all distinct views in a product, mapped before design begins |
| **Screen's job** | The one-sentence description of what a screen helps a specific user accomplish |
| **Skeleton screen** | A loading state that mimics the shape of the content it will replace |
| **State completeness** | A component that has all required interactive states fully designed and coded |
| **Surface** | A background layer on which content is placed — bg.base, bg.surface, bg.elevated |
| **Typographic hierarchy** | The visual ranking of text elements by size, weight, contrast, and placement |
| **Wayfinding** | The system of signals (active states, breadcrumbs, headings) that tells users where they are |