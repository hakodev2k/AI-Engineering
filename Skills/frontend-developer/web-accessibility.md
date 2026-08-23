# Web Accessibility

## Purpose
Ensure frontend experiences are perceivable, operable, understandable, and robust for keyboard, screen-reader, low-vision, motion-sensitive, and other users.

## When to use
Use during component design, feature implementation, accessibility review, remediation, and regression testing.

## Inputs
UI, interaction requirements, semantic structure, accessibility target, browser/assistive-technology support, and audit findings.

## Context to inspect
HTML semantics, landmarks, headings, labels, focus order, keyboard behavior, ARIA usage, contrast, motion, error messaging, and dynamic announcements.

## Core knowledge
Native semantics and controls are preferred because they carry keyboard and accessibility behavior. ARIA can supplement semantics but can also make accessibility worse when misused. Automated scans find only part of the problem.

## Procedure
1. Inspect semantic structure and landmark hierarchy.
2. Verify every interactive element works by keyboard.
3. Check visible and programmatic labels.
4. Ensure focus moves only when interaction semantics require it.
5. Validate dialogs, menus, tabs, and other composite widgets against established patterns.
6. Check contrast, zoom, reflow, target size, and motion preferences.
7. Associate validation and status messages with relevant controls.
8. Test dynamic updates with appropriate announcements.
9. Run automated checks.
10. Perform manual keyboard and representative screen-reader testing.

## Decision points
Prefer native elements over custom ARIA widgets. Move focus after route/modal transitions only when it improves orientation and follows expected interaction patterns.

## Common failure patterns
Clickable divs, positive tabindex, missing focus indicators, redundant ARIA, color-only meaning, focus traps, inaccessible validation, and treating automated scores as proof of accessibility.

## Verification
Automated checks pass within agreed scope, keyboard workflows complete without a mouse, screen-reader output is understandable, and zoom/reflow remain usable.

## Expected output
Accessible implementation plus evidence of automated and manual verification.

## Stop conditions
Escalate when design requirements inherently block accessibility, required assistive-technology testing is unavailable for a critical workflow, or remediation changes product behavior requiring approval.