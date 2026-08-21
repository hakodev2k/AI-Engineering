# Code Splitting and Bundle Control

## Purpose
Keep production bundles efficient without fragmenting the application into excessive network requests.

## When to use
Use when bundles grow, startup time regresses, or heavy optional features exist.

## Inputs
Bundle analyzer output, route graph, dependency sizes, user navigation patterns.

## Preconditions
Analyze a production build.

## Context to inspect
Entry chunks, duplicated dependencies, dynamic imports, route boundaries, vendor packages, source maps.

## Core knowledge
Bundle size matters when it affects transfer, parse, compile, or execution. Split at meaningful async boundaries and control dependency duplication.

## Procedure
1. Generate bundle report.
2. Identify largest first-load dependencies.
3. Remove unused or redundant packages.
4. Split route-level and truly optional features.
5. Verify shared chunks are reused.
6. Preload/prefetch only predictable high-value paths.
7. Add budget thresholds in CI where useful.
8. Measure runtime impact.

## Decision points
Replace a dependency only when total maintenance and behavior cost justify the size saving.

## Common failure patterns
Over-splitting, duplicate library versions, importing entire utility libraries, accidental server-only/browser-only code leakage.

## Verification
Compare first-load JS, async chunks, parse time, and real navigation behavior.

## Expected output
Controlled bundle growth and intentional loading boundaries.

## Stop conditions
Stop if build-tool limitations require platform-level migration.