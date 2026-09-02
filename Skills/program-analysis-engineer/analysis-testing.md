# Analysis Testing

## Purpose
Build a test strategy that proves an analysis behaves correctly across semantic edge cases, regressions, malformed inputs, and realistic codebases.

## When to use
Use when developing or changing analysis algorithms, rules, language front ends, summaries, or framework models.

## Inputs
Analysis contract, known defects, supported language features, expected diagnostics, performance budgets, and representative repositories.

## Preconditions
Define what correctness means: exact findings, sound over-approximation, bounded exploration, or practical precision.

## Context to inspect
Unit tests, golden tests, integration suites, parser/typechecker behavior, framework fixtures, historical false positives, and performance regressions.

## Core knowledge
Analysis testing needs both positive and negative examples. Metamorphic, differential, mutation, corpus, and property-based testing can reveal failures that hand-written happy paths miss. Tests should assert provenance and location, not only counts.

## Procedure
1. Convert the analysis contract into test categories.
2. Add minimal positive and negative fixtures.
3. Cover branch, loop, call, alias, exception, generic, and dynamic-language edge cases as relevant.
4. Encode historical defects as regressions.
5. Test malformed and partially typed code when IDE use is supported.
6. Add metamorphic transformations that should preserve findings.
7. Compare against an independent implementation or runtime oracle where feasible.
8. Run representative repository corpora.
9. Track diagnostic stability and performance.
10. Keep nondeterministic output normalized and reproducible.

## Decision points
Use golden tests for stable user-visible diagnostics and semantic assertions for algorithm internals. Add broad corpus tests when local fixtures cannot represent ecosystem behavior.

## Common failure patterns
Only testing true positives, asserting counts instead of identities, no regression corpus, brittle source positions, ignoring invalid code, and performance tests without stable baselines.

## Verification
Run the complete suite from a clean environment, intentionally mutate analysis logic to confirm tests fail, and inspect coverage of high-risk semantics.

## Expected output
A layered, reproducible test suite that protects correctness, precision, diagnostics, and performance.

## Stop conditions
Stop when expected semantics are ambiguous enough that pass/fail criteria cannot be defined.