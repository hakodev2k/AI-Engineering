# Compiler Testing Strategy

## Purpose
Build layered evidence that compiler changes preserve semantics, diagnostics, binary contracts, and performance.

## When to use
Use for feature work, optimization changes, target ports, regressions, or test-suite design.

## Inputs
Compiler pipeline, language/ABI specifications, known bugs, targets, benchmark and conformance suites.

## Context to inspect
Unit tests, golden tests, execution tests, conformance suites, differential tests, fuzzers, sanitizers, codegen tests, CI matrix.

## Core knowledge
Compiler correctness requires more than build success. Tests should isolate stages yet also execute end-to-end. Negative tests prove rejection behavior; differential and metamorphic testing expose miscompilations.

## Procedure
1. Identify the semantic contract affected.
2. Add the smallest stage-local regression test.
3. Add end-to-end execution evidence where possible.
4. Add invalid/near-miss cases.
5. Cover optimization levels and relevant targets.
6. Use differential or metamorphic tests for transformations.
7. Include determinism and reproducibility checks where relevant.
8. Run broader conformance and sanitizer suites before release.

## Decision points
Use exact textual golden tests for stable interfaces; semantic assertions when formatting is incidental. Prefer independent oracle compilers only where language behavior is shared and defined.

## Common failure patterns
Testing only successful compilation, overspecified assembly tests, no negative cases, target gaps, flaky timing assertions, using undefined behavior as oracle input.

## Verification
Confirm the new test fails before the fix when feasible, passes after it, and broad suites remain green.

## Expected output
A risk-based test set that distinguishes implemented behavior from verified correctness.

## Stop conditions
Stop release when critical semantic paths lack an executable or independently checkable oracle.