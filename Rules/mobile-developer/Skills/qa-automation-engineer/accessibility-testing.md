# Accessibility Testing

## Purpose
Integrate automated and manual accessibility evidence into delivery while recognizing what automation cannot prove.

## When to use
Use for web/mobile UI, design systems, forms, navigation, dialogs, and public/customer-facing experiences.

## Inputs
Accessibility target (such as WCAG level), UI flows, supported assistive technology, component library.

## Context to inspect
Semantic HTML, names/roles, keyboard order, focus management, contrast, labels, errors, dynamic announcements, zoom/reflow.

## Core knowledge
Automated scanners catch only a subset of accessibility defects. Combine rule engines with keyboard, focus, semantics, and representative assistive-technology checks.

## Procedure
1. Define required accessibility standard and critical journeys.
2. Run automated rule checks at component/page level.
3. Validate semantic roles, accessible names, labels, and errors.
4. Test complete keyboard operation and visible focus.
5. Verify focus movement for dialogs/navigation/dynamic content.
6. Check contrast, zoom, reflow, and reduced-motion behavior where relevant.
7. Perform targeted screen-reader checks for critical flows.
8. Convert recurring defects into component-level regression tests.
9. Gate severe deterministic violations in CI.

## Decision points
Automate objective rules; retain human evaluation for usability, reading order, announcement quality, and cognitive clarity.

## Common failure patterns
Treating zero scanner violations as accessible, adding ARIA over correct native semantics, inaccessible custom controls, missing focus restoration.

## Verification
Use automated reports plus keyboard and assistive-technology evidence on critical flows; confirm fixes do not regress semantics.

## Expected output
Actionable accessibility defects and sustainable automated checks.

## Stop conditions
Escalate when compliance interpretation or assistive-technology requirements need accessibility specialists.