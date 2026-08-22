# Accessibility

## Purpose
Deliver Vue interfaces that remain operable and understandable for keyboard, screen-reader, low-vision, and other users.

## When to use
Use during feature development, component-library work, accessibility remediation, and UI review.

## Inputs
UI requirements, designs, component code, accessibility standards, and supported browsers/assistive technologies.

## Context to inspect
Inspect semantic markup, focus order, labels, dialogs, dynamic announcements, contrast, keyboard interactions, and existing design-system accessibility behavior.

## Core knowledge
Prefer native semantic HTML before ARIA. Dynamic SPAs require deliberate focus and announcement behavior. Accessibility is behavioral, not merely lint compliance.

## Procedure
1. Identify semantic structure and interactive controls.
2. Use native elements with correct names and labels.
3. Ensure all interactions work by keyboard.
4. Manage focus for dialogs, route changes, and dynamic workflows.
5. Expose validation and status changes appropriately.
6. Check zoom/reflow and visible focus.
7. Run automated checks.
8. Perform keyboard and representative screen-reader testing.
9. Add regression tests for reusable components.

## Decision points
Use ARIA only when native semantics cannot express the required widget. Prefer established accessible primitives for complex widgets when their behavior is well tested.

## Common failure patterns
Clickable divs, missing labels, focus traps, ARIA overriding correct semantics, inaccessible custom selects, color-only status, and relying solely on automated scanners.

## Verification
Verify keyboard-only completion, accessible names/roles/states, focus behavior, automated scans, and representative assistive-technology flows.

## Expected output
A usable interface with evidence for key accessibility requirements.

## Stop conditions
Escalate when design requirements inherently conflict with accessibility or required assistive-technology testing cannot be performed.