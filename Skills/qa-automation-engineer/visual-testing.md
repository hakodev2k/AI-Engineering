# Visual Testing

## Purpose
Detect unintended rendering and layout regressions that functional assertions cannot reliably describe.

## When to use
Use for design systems, critical layouts, responsive pages, charts, generated documents, and high-value visual states.

## Inputs
Reference states, browser/device matrix, fonts/assets, rendering environment, tolerance policy.

## Context to inspect
Dynamic regions, animations, timestamps, ads, fonts, anti-aliasing, viewport, locale, themes, and OS/browser rendering differences.

## Core knowledge
Visual comparison requires deterministic rendering. Baselines are reviewed evidence, not automatically correct truth. Scope snapshots to meaningful regions and control known nondeterminism.

## Procedure
1. Select visually important stable states.
2. Standardize browser, viewport, fonts, locale, and animations.
3. Seed deterministic content.
4. Mask only genuinely nondeterministic regions.
5. Capture component/page snapshots at meaningful breakpoints.
6. Set tolerance based on rendering variability without hiding defects.
7. Review diffs with product/design context.
8. Approve baseline changes explicitly.
9. Version baselines with code and monitor storage/runtime.

## Decision points
Use DOM assertions for semantic behavior; use visual diffs for appearance. Prefer component snapshots when full-page diffs create excessive noise.

## Common failure patterns
Blind baseline updates, huge screenshots, uncontrolled fonts/animations, excessive tolerance, using visual tests for business logic.

## Verification
Introduce a controlled CSS/layout regression and confirm a clear diff; rerun unchanged builds to measure false positives.

## Expected output
Stable visual checks with reviewable diffs and governed baselines.

## Stop conditions
Escalate when rendering cannot be made sufficiently deterministic for trustworthy comparison.