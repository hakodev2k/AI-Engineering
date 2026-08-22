# Accessibility Engineering

## Purpose
Build React interfaces usable with keyboard, screen readers, zoom, reduced motion, and assistive technologies.

## When to use
Use for every interactive feature and especially custom controls, dialogs, menus, forms, and dynamic content.

## Inputs
UX flow, semantic requirements, target WCAG level, component implementation.

## Preconditions
Prefer native HTML semantics before ARIA.

## Context to inspect
DOM semantics, labels, focus order, keyboard handling, contrast, announcements, motion.

## Core knowledge
ARIA supplements semantics; it does not repair fundamentally incorrect interaction models. Focus must follow user intent, not implementation convenience.

## Procedure
1. Use semantic native elements.
2. Ensure accessible names and descriptions.
3. Support keyboard interaction and visible focus.
4. Manage focus for dialogs/menus/navigation changes.
5. Announce dynamic status when needed.
6. Validate contrast, zoom, and reduced motion.
7. Test with automated tools.
8. Perform manual keyboard and screen-reader checks on critical flows.

## Decision points
Build custom widgets only when native controls cannot satisfy requirements.

## Common failure patterns
Clickable `div`s, missing labels, trapped/lost focus, incorrect ARIA roles, color-only status, inaccessible validation errors.

## Verification
Keyboard-only test, accessibility tree review, automated scan, and screen-reader smoke test for critical paths.

## Expected output
Accessible interactions with documented exceptions.

## Stop conditions
Stop when product design conflicts with mandatory accessibility requirements and needs stakeholder decision.