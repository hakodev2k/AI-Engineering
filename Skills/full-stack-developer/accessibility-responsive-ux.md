# Accessibility and Responsive UX

## Purpose
Deliver interfaces usable across keyboard, assistive technology, screen sizes, zoom levels, and common input modes.

## When to use
New UI, component libraries, redesigns, accessibility defects, or responsive regressions.

## Inputs
Designs, content, target devices, accessibility standard, browser support, interaction requirements.

## Context to inspect
Semantic markup, focus order, labels, contrast, landmarks, validation messages, breakpoints, overflow, touch targets.

## Core knowledge
Accessibility is behavior and semantics, not an audit after implementation. Native HTML usually provides stronger keyboard and assistive behavior than custom widgets. Responsive design should follow content constraints rather than device names.

## Procedure
1. Build semantic structure and heading hierarchy.
2. Ensure controls have programmatic names.
3. Define logical keyboard and focus behavior.
4. Make status/errors perceivable without relying only on color.
5. Support zoom and text reflow.
6. Test narrow and wide layouts using real content extremes.
7. Ensure touch targets and pointer alternatives are usable.
8. Use ARIA only when native semantics are insufficient.
9. Run automated accessibility checks.
10. Perform manual keyboard and representative screen-reader testing.

## Decision points
Prefer native controls; custom widgets require complete interaction semantics. Use responsive layout primitives before adding many breakpoint-specific overrides.

## Common failure patterns
Clickable divs, missing labels, focus traps, placeholder-only instructions, fixed-height text containers, color-only state, and desktop-only testing.

## Verification
Keyboard-only flow succeeds; automated checks pass; zoom/reflow and representative screen-reader flows are usable.

## Expected output
Responsive, semantically robust UI with tested interaction states.

## Stop conditions
Escalate when design requirements inherently conflict with required accessibility standards.