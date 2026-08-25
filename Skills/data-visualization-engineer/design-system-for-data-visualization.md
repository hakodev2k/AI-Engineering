# Design System for Data Visualization

## Purpose
Create reusable visualization primitives and semantic standards that improve consistency, accessibility, and delivery speed.

## When to use
When multiple products or teams build related charts and dashboards.

## Inputs
Existing UI design system, chart inventory, brand rules, accessibility requirements, supported frameworks.

## Core knowledge
A visualization design system should encode semantic decisions, not just styling. Tokens, scales, component APIs, interaction states, annotations, empty states, and accessibility contracts need governance and versioning.

## Procedure
1. Inventory recurring chart patterns and inconsistencies.
2. Define semantic tokens for typography, spacing, emphasis, status, and data palettes.
3. Standardize axes, grids, legends, tooltips, titles, annotations, loading, empty, and error states.
4. Define component APIs around analytical intent rather than low-level styling only.
5. Establish accessible defaults and keyboard behavior.
6. Provide responsive and high-density variants.
7. Create reference examples and anti-patterns.
8. Add automated tests and visual regression coverage.
9. Version breaking semantic or API changes.
10. Establish contribution and exception review.

## Decision points
Standardize common patterns while allowing escape hatches for genuinely novel analytical tasks. Do not force a component when its semantics mismatch the data.

## Common failure patterns
Theme-only libraries; inaccessible defaults; arbitrary one-off colors; APIs exposing every implementation detail; no migration strategy; exceptions copied permanently.

## Verification
Build representative dashboards using only supported primitives and verify consistency, accessibility, extensibility, and performance.

## Expected output
A governed visualization system with tokens, components, semantics, examples, tests, and versioning rules.

## Stop conditions
Stop when standardization would encode unresolved metric semantics or conflict with the parent product design system.