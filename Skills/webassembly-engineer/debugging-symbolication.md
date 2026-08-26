# Debugging and Symbolication

## Purpose
Diagnose Wasm failures from source through optimized binaries and production stack traces.

## When to use
Use for traps, wrong results, crashes in host integration, corrupted stacks, or opaque production function indices.

## Inputs
Exact artifact/hash, source revision, debug/symbol files, runtime/browser version, stack trace, logs, inputs, and build metadata.

## Context to inspect
Inspect DWARF/name/source-map configuration, optimization level, stripped sections, function index mapping, host stack, and artifact provenance.

## Core knowledge
Optimized Wasm can reorder/inlining-transform source structure. Function indices without matching symbols are weak evidence. Production symbolication requires exact artifact-to-symbol correspondence.

## Procedure
1. Identify the exact failing binary by hash.
2. Reproduce with equivalent runtime and inputs.
3. Capture guest and host stack information.
4. Symbolicate using matching debug artifacts.
5. Locate the trap/instruction and surrounding WAT.
6. Map it back to source and optimizer output.
7. Reduce the failure while preserving semantics.
8. Validate the root-cause hypothesis with an isolated change.
9. Add regression tests.
10. Preserve symbol artifacts according to retention policy.

## Decision points
Use debug builds to understand semantics; confirm fixes on release builds. Keep symbols externally when production binary size matters.

## Common failure patterns
Symbolicating with mismatched builds; debugging only source while deployed binary differs; swallowing trap details; relying on unstable function indices; removing all diagnostic metadata.

## Verification
Reproduce before, eliminate after, confirm release artifact behavior, and test symbolication on a known injected failure.

## Expected output
A root-cause report tied to exact binary/source evidence and a verified regression test.

## Stop conditions
Stop if artifact/symbol provenance is missing, reproduction requires unsafe production mutation, or evidence indicates a runtime/compiler defect needing upstream escalation.