# Frontend Performance

## Purpose
Measure and improve Vue runtime and loading performance based on evidence rather than intuition.

## When to use
Use for slow interactions, poor Core Web Vitals, large bundles, expensive rendering, or performance regressions.

## Inputs
Performance traces, bundle reports, production metrics, user flows, and source code.

## Context to inspect
Inspect route chunks, dependencies, render frequency, list sizes, network waterfalls, images/fonts, and reactive hot paths.

## Core knowledge
Performance includes loading, rendering, scripting, network, and perceived responsiveness. Optimize measured bottlenecks. Vue reactivity and component boundaries can affect update cost, but network and asset costs may dominate.

## Procedure
1. Define the affected user journey and target metric.
2. Capture a reproducible baseline.
3. Separate network, main-thread, rendering, and backend contributions.
4. Inspect bundle composition and route loading.
5. Profile component updates and reactive dependencies.
6. Optimize the dominant bottleneck.
7. Consider virtualization, lazy loading, caching, or shallower reactivity where evidence supports them.
8. Re-measure under comparable conditions.
9. Add performance budgets or regression checks where valuable.

## Decision points
Prefer code splitting for infrequently used large features; virtualization for genuinely large rendered collections; memoization only when recomputation is measured and significant.

## Common failure patterns
Premature memoization, optimizing dev-mode timings, loading large libraries for trivial tasks, deep reactive graphs, and claiming improvement without comparable measurements.

## Verification
Compare before/after traces and production-relevant metrics; verify functionality and memory behavior remain correct.

## Expected output
Measured performance improvement with documented bottleneck and evidence.

## Stop conditions
Stop if measurements are not reproducible or the bottleneck lies outside the owned system and requires escalation.