# Reverse Engineering Automation Scripting

## Purpose
Automate repetitive analysis while preserving reproducibility, safety, and human validation of inferred semantics.

## When to use
Use for bulk renaming, xref extraction, function classification, signature application, data carving, diff preparation, report generation, or repeated queries across binaries.

## Inputs
Analysis database/binaries, tool scripting API, task definition, expected invariants, output format.

## Preconditions
Version-control scripts and work on copies of analysis databases when automation may make broad changes.

## Context to inspect
Tool API/version, address model, analysis completion state, naming/type conventions, exception behavior, transaction/undo support, and dataset size.

## Core knowledge
Automation magnifies incorrect assumptions. Scripts should be idempotent where possible, preserve manual annotations, log changes, and distinguish extraction from interpretation.

## Procedure
1. Define the repetitive operation and measurable success condition.
2. Prototype on a small representative subset.
3. Validate address conversions and tool API semantics.
4. Add bounds checks, type checks, error handling, and logging.
5. Preserve existing high-confidence names/types unless explicitly replacing them.
6. Emit machine-readable results plus provenance.
7. Make reruns deterministic or safely idempotent.
8. Compare automated output against manually verified samples.
9. Record tool and script versions.

## Decision points
Automate deterministic extraction aggressively; keep ambiguous semantic classification reviewable. Prefer external scripts for portable corpus processing and tool-native scripts for database-aware transformations.

## Common failure patterns
Blind bulk renaming; stale addresses after reanalysis; swallowing errors; non-deterministic output; depending on GUI state; modifying evidence rather than annotations.

## Verification
Run unit-like fixtures or known binaries, compare sampled results manually, and confirm rerunning does not corrupt or duplicate annotations.

## Expected output
A reusable script plus logs/results that another analyst can reproduce.

## Stop conditions
Stop automation when tool state is inconsistent, error rates exceed the defined threshold, or changes cannot be safely reviewed/rolled back.