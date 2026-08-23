# CSS and Responsive Layout

## Purpose
Build resilient layouts and styling systems that adapt across viewport, content, localization, and user-preference changes without fragile overrides.

## When to use
Use when implementing responsive screens, refactoring CSS debt, designing layout primitives, or diagnosing overflow and cross-browser styling issues.

## Inputs
Design specifications, supported browsers, content variants, breakpoints/tokens, component structure, and current stylesheets.

## Context to inspect
Cascade/layers, specificity, layout primitives, design tokens, media/container queries, overflow, typography, logical properties, and browser support.

## Core knowledge
Prefer intrinsic layout with Grid/Flexbox and content-driven constraints over device-specific pixel assumptions. The cascade is a feature when intentionally structured. Responsive behavior must tolerate zoom, long content, localization, and user font settings.

## Procedure
1. Identify layout relationships rather than copying coordinates.
2. Use semantic document flow as the baseline.
3. Choose Grid for two-dimensional relationships and Flexbox for one-dimensional distribution.
4. Apply reusable tokens for spacing, type, and sizing.
5. Add breakpoints only where content requires them.
6. Use logical properties for writing-direction resilience.
7. Control overflow intentionally.
8. Test long labels, empty content, zoom, narrow widths, and large text.
9. Verify supported browsers and reduced-motion/preferences where relevant.
10. Remove specificity hacks and dead rules discovered during implementation.

## Decision points
Use container queries when component behavior depends on available container space; use viewport queries for page-level conditions. Avoid absolute positioning unless overlap is genuinely part of the design.

## Common failure patterns
Magic pixel breakpoints, `!important` escalation, fixed heights around dynamic content, horizontal overflow, DOM order differing from visual order, and styling tied to incidental markup.

## Verification
Layouts remain usable at required widths and zoom levels, no unintended overflow occurs, visual regression checks pass, and browser support matches policy.

## Expected output
Maintainable responsive styling with predictable cascade and resilient content behavior.

## Stop conditions
Escalate when design constraints conflict with accessibility, supported-browser capabilities are insufficient, or required content variants are unknown.