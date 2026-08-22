# Accessibility

## Purpose
Build Angular interfaces usable with keyboards, assistive technologies, zoom, and diverse input modes.

## When to use
Use during component design, feature implementation, design-system work, and accessibility remediation.

## Inputs
UI requirements, designs, templates, interaction behavior, and accessibility target.

## Context to inspect
Inspect semantic HTML, focus order, labels, headings, dialogs, dynamic updates, contrast, keyboard handling, and ARIA usage.

## Core knowledge
Native semantics are preferable to recreating controls with ARIA. Accessibility must be designed into interaction behavior, not added after visual completion.

## Procedure
1. Use native semantic elements first.
2. Ensure every control has an accessible name.
3. Verify logical keyboard navigation and visible focus.
4. Manage focus for dialogs, route changes, and dynamic workflows.
5. Announce important asynchronous changes when necessary.
6. Validate heading and landmark structure.
7. Check zoom/reflow and non-pointer operation.
8. Test with automated tooling plus keyboard and representative screen-reader flows.

## Decision points
Use ARIA only when native semantics cannot express the interaction. Simplify custom widgets when accessibility cost outweighs their value.

## Common failure patterns
Clickable divs, positive tabindex, missing labels, focus traps, ARIA overriding correct native semantics, and relying only on automated scanners.

## Verification
Run automated checks and manually complete critical journeys using keyboard and assistive technology.

## Expected output
Accessible interactions with evidence for critical workflows.

## Stop conditions
Escalate design requirements that inherently conflict with the agreed accessibility standard.