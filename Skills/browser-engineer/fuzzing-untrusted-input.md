# Fuzzing Untrusted Input

## Purpose
Use fuzzing to expose parser, state-machine, memory-safety, and robustness defects in browser components that consume complex input.

## When to use
Use for parsers, decoders, protocol handling, serialization, DOM/CSS processing, or historically crash-prone state machines.

## Inputs
Target component, input format, entry point, seed corpus, sanitizers, resource budget.

## Context to inspect
Parser boundaries, invariants, allocation limits, recursive structures, error paths, existing fuzz targets and corpora.

## Core knowledge
Effective fuzzers reach meaningful state cheaply, isolate deterministic behavior, and run with memory/undefined-behavior sanitizers. Corpus quality and coverage matter more than random input volume.

## Procedure
1. Choose a narrow untrusted-input boundary.
2. Build a deterministic harness with minimal external dependencies.
3. Seed with valid and edge-case inputs.
4. Enable appropriate sanitizers and coverage.
5. Bound memory, recursion, and execution time.
6. Run until useful coverage stabilizes.
7. Minimize crashes and deduplicate by root cause.
8. Fix the invariant violation and add the minimized case to regression corpus.

## Decision points
Use structure-aware generation when raw mutation cannot reach deep states. Mock environment only when it does not remove relevant behavior.

## Common failure patterns
Harness dominated by setup; nondeterministic network/filesystem dependencies; ignoring hangs/OOM; fixing one crashing input without the underlying class.

## Verification
The minimized input no longer fails, sanitizer runs are clean, and the target continues producing useful coverage.

## Expected output
A maintainable fuzz target and root-cause fixes backed by regression seeds.

## Stop conditions
Escalate security-sensitive findings through the project's security process; stop if fuzzing could affect external systems or uncontrolled resources.