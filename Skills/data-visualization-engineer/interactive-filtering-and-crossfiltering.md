# Interactive Filtering and Crossfiltering

## Purpose
Design predictable interactions that let users narrow, compare, and investigate data without losing analytical context.

## When to use
For interactive dashboards and exploratory analytical applications.

## Inputs
User tasks, dimensions, filter cardinality, interaction model, data volume, query latency.

## Core knowledge
Interaction creates application state. Filter scope, defaults, dependencies, URL persistence, empty states, and reset behavior must be explicit. Crossfiltering should preserve causal clarity about what changed and why.

## Procedure
1. Identify interactions necessary for real analytical tasks.
2. Define global, page, visual, and drill-level filter scope.
3. Choose safe defaults and represent active state visibly.
4. Specify dependencies between filters and valid-value behavior.
5. Define crossfilter versus highlight semantics for selections.
6. Preserve context during drill and provide deterministic reset/back behavior.
7. Handle no-data, loading, stale, and error states.
8. Debounce or batch expensive queries where appropriate.
9. Decide which state should be shareable or persisted.
10. Test keyboard and assistive-technology operation.

## Decision points
Use filtering when excluded data should leave the analysis; highlighting when context should remain visible. Avoid interaction where a static comparison answers the task faster.

## Common failure patterns
Invisible active filters; cascading filters that erase valid options; reset that does not restore defaults; inconsistent click behavior; expensive queries on every keystroke; inaccessible hover-only detail.

## Verification
Test state transitions, back/reset, empty results, shared links, concurrent filters, and keyboard-only workflows.

## Expected output
An interaction contract defining state, scope, transitions, persistence, performance, and accessibility behavior.

## Stop conditions
Stop if interaction semantics conflict with metric definitions or backend query capabilities cannot safely support required state.