# Incremental Build Correctness

## Purpose
Ensure incremental builds rebuild exactly what changed: no stale outputs and no unnecessary work.

## When to use
Use when developers report clean-build fixes, stale generated code, unexpectedly large rebuilds, or poor edit-build-test latency.

## Inputs
Build graph, file/action traces, source changes, generated outputs, dependency metadata, cache logs, and clean/incremental timings.

## Context to inspect
Inspect declared inputs/outputs, transitive dependency discovery, generated headers/sources, configuration changes, compiler dependency files, globbing, directory inputs, and cleanup behavior.

## Core knowledge
Incrementality requires sound invalidation. Under-invalidation is a correctness bug; over-invalidation is a performance bug. Timestamps are weaker than content digests when clocks, copies, or generated files are involved.

## Procedure
1. Establish clean-build output and timing baselines.
2. Classify representative edits: implementation-only, public interface, generated input, configuration, dependency, and toolchain changes.
3. Trace which targets rebuild for each edit.
4. Verify every rebuilt action has a causal changed input.
5. Verify every affected consumer rebuilds.
6. Inspect missing or overly broad dependency declarations.
7. Replace fragile timestamp/glob assumptions where supported with explicit or content-based tracking.
8. Ensure deleted/renamed inputs invalidate stale outputs.
9. Test branch switching and configuration switching.
10. Record expected invalidation behavior as regression tests or build diagnostics.

## Decision points
Prefer precise dependency discovery when its analysis cost is lower than repeated compilation. Directory-wide inputs are acceptable only when their broad invalidation is intentional and measured.

## Common failure patterns
Missing generated dependencies, stale depfiles, glob changes not observed, output directories reused across configurations, compiler flags omitted from action keys, and scripts that mutate undeclared files.

## Verification
Compare incremental artifacts with a clean rebuild after each representative edit; confirm affected target sets; test deletion and rename cases; measure no-op and small-edit rebuild time.

## Expected output
Correct invalidation rules, regression scenarios, and measured incremental-build behavior.

## Stop conditions
Stop if dependency ownership cannot be determined, build tooling cannot expose action dependencies, or correcting invalidation would require an unapproved compatibility change.