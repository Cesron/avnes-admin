---
name: "AVNES"
description: "Existing visual system and shipped admin/coordinator weekly dashboard."
colors:
  primary: "oklch(0.685 0.169 237.323)"
  primary-foreground: "oklch(0.145 0 0)"
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.685 0.169 237.323)"
  destructive: "oklch(0.577 0.245 27.325)"
  amber-subtle: "oklch(0.962 0.059 90)"
  amber-subtle-foreground: "oklch(0.5 0.15 75)"
  blue-subtle: "oklch(0.95 0.04 230)"
  blue-subtle-foreground: "oklch(0.42 0.18 230)"
  sidebar: "oklch(0.985 0 0)"
  sidebar-foreground: "oklch(0.145 0 0)"
  sidebar-accent: "oklch(0.97 0 0)"
  sidebar-accent-foreground: "oklch(0.205 0 0)"
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.205 0 0)"
  dark-card-foreground: "oklch(0.985 0 0)"
  dark-muted: "oklch(0.269 0 0)"
  dark-muted-foreground: "oklch(0.708 0 0)"
  dark-accent: "oklch(0.269 0 0)"
  dark-accent-foreground: "oklch(0.985 0 0)"
  dark-border: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-destructive: "oklch(0.704 0.191 22.216)"
  dark-amber-subtle: "oklch(0.22 0.06 75)"
  dark-amber-subtle-foreground: "oklch(0.86 0.14 80)"
  dark-blue-subtle: "oklch(0.2 0.05 230)"
  dark-blue-subtle-foreground: "oklch(0.85 0.1 230)"
  dark-sidebar: "oklch(0.205 0 0)"
  dark-sidebar-foreground: "oklch(0.985 0 0)"
  dark-sidebar-accent: "oklch(0.269 0 0)"
  dark-sidebar-accent-foreground: "oklch(0.985 0 0)"
typography:
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  caption:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "28px"
  8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  button-ghost:
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  input:
    rounded: "{rounded.md}"
    padding: "4px 12px"
  navigation-item:
    rounded: "{rounded.md}"
    padding: "8px"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System: AVNES

## Overview

**Creative North Star: "Clear operational reading"**

AVNES uses its existing blue accent, neutral surfaces and Geist typography for a restrained Spanish-language administration interface. Borders establish structure; color and weight distinguish actions, measures and state. The user retained the palette and delegated dashboard composition.

This record captures existing global tokens and the shipped admin/coordinator dashboard only. Operate is the mode of the dashboard surface brief, not a new identity imposed on every screen. The mentor dashboard and other screens were not redesigned by this work. No image composition was approved and no new imagery was introduced.

The north-star wording describes the shipped interface; it is not a new brand commitment.

**Key Characteristics:**

- Existing blue identity in light and dark themes.
- Compact labelled controls and explicit state text.
- Dashboard comparisons with aligned measures and tabular numbers.

## Colors

The established blue sits on neutral light or dark surfaces. Frontmatter preserves the canonical OKLCH values from src/app/globals.css. The dark-prefixed entries document .dark overrides; unchanged tokens retain the same value in both themes. Runtime components use original semantic custom properties, not the documentation's dark-prefixed names.

### Primary

AVNES blue supplies actions, focus and attendance measures. Its foreground remains the existing dark text token. Blue subtle tokens support quieter semantic emphasis.

### Neutral

Background is the page canvas; card and sidebar distinguish contained surfaces. Foreground supplies primary text, muted foreground supplies supporting text and registration bars. Border and input are separate strokes, especially in dark mode. Accent supplies interactive hover and selection backgrounds.

### Status

Amber subtle tokens express incomplete registration. Destructive retains its error role. The other existing chart and subtle colors remain in the stylesheet; this scoped record does not redefine them. Sidecar tonal ramps are panel visualization samples, not additional application palette tokens.

**The Semantic Theme Rule.** Use existing semantic CSS variables so light and dark treatments switch together.

## Typography

Geist is loaded through next/font/google and exposed as --font-geist-sans. Frontmatter roles describe the observed dashboard: headline for the page title and summary values, title for sections, body and label for data and controls, caption for supporting counts and explanations. Entity names use the inherited base size and semibold weight. Input text is 16px below the medium breakpoint and 14px above it. Headings balance text; explanatory copy uses pretty wrapping and measured widths where implemented.

**The Comparable Figures Rule.** Keep dashboard percentages and counts tabular and pair measures with their denominators.

## Layout

The existing authenticated shell centers content at a maximum of 72rem, with horizontal padding of 16px / 24px / 32px at base / medium / large sizes. The inset sidebar uses 16rem expanded, 3rem collapsed and 18rem in the mobile sheet. Safe-area padding remains on the stable app wrapper.

Dashboard-specific composition: title and activity action, weekly/club filters, summary strip, conditional registration notice, one dominant comparison container, pending work, then calculation disclosure. The section rhythm is 28px. The summary becomes three columns at 640px. Comparison rows use a 1 : 1.2 : 1 grid at 1024px with 32px gaps; below that width each entity becomes a labelled stacked record. Container padding grows from 20px to 24px at 640px. Search and sort controls stack on small screens. This composition is scoped to .impeccable/surfaces/dashboard.md.

Implementation evidence: .impeccable/review/dashboard/desktop-dark.png, mobile-dark.png and desktop-light.png. These are implementation captures, not an approved image composition.

## Elevation & Depth

Tonal layers and fine borders carry most structure. Dashboard comparison and filter containers are flat at rest. Shared cards, the inset shell and the selected comparison segment retain the existing small shadow; outline buttons and inputs use the extra-small shadow. Focus rings communicate keyboard state. Exact shadows and motion are captured in the sidecar.

## Shapes

The existing radius base is 0.625rem. Frontmatter resolves its small, medium, large and extra-large derivatives at the default 16px root size. Controls use medium corners; panels use extra-large corners. Badges and measure bars use full rounding. Dividers separate list records without floating each record in a separate card.

## Components

### Buttons

Shared primary, outline and ghost variants retain medium corners, medium-weight labels and color-state transitions. Default controls are at least 44px tall on small screens and 36px at medium sizes; default icon controls follow the same dimensions. Outline actions dominate the dashboard. Disabled controls reduce opacity and prevent interaction. Focus uses a 3px semantic ring at half opacity.

### Inputs / Fields

Fields use the input stroke, muted placeholder, medium corners and extra-small shadow. Heights change from 44px to 36px at the medium breakpoint. Dark fields use input color at 30% opacity. Focus changes the border and adds the shared ring; invalid fields use destructive styling. Dashboard controls retain visible labels.

### Navigation

The existing role-aware sidebar retains the AVNES logo, labelled links, active accent background and blue active icon. It collapses to icons on desktop and a sheet on mobile. Route changes close the mobile sheet. This is an existing shell, not a navigation redesign.

### Chips

The existing badge is compact, fully rounded and medium-weight, with primary and subtle semantic variants. Clubes/Grupos is a pressed-button group rather than a badge filter: the selected control uses the canvas background and small shadow within a muted track.

### Cards / Containers

Shared cards use semantic card colors, extra-large corners, a border, 20px vertical padding and small shadow. The dashboard comparison uses a flat bordered container. Pending work uses divided rows and outline completion actions.

### Weekly comparison

Attendance bars are blue and 8px tall; registration bars use muted foreground and are 6px tall. Both share full-width tracks. Explicit percentages, denominators and pending labels communicate meaning independently of color. Missing results display Sin datos, and disclosure exposes exact counts. Club links preserve the week. Search, ordering and club/group switching operate on one surface. Bars have no entrance animation; controls retain state transitions. Empty weeks explain the absence of expected records and offer the previous week.

## Do's and Don'ts

### Do:

- Do reuse semantic theme variables and the existing Geist family.
- Do keep attendance and recording coverage visibly distinct in the weekly dashboard.
- Do preserve visible labels, keyboard focus and readable mobile controls.

### Don't:

- Don't display missing attendance data as a 0% result.
- Don't promote the dashboard composition into a requirement for every screen.
- Don't invent trends, targets or new imagery for this report.
