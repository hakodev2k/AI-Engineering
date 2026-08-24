# Fuzzing and Differential Testing

## Purpose
Discover crashes, hangs, nondeterminism, and miscompilations beyond curated compiler tests.

## When to use
Use for parsers, optimizers, IR verifiers, code generators, new targets, or hard-to-reproduce correctness bugs.

## Inputs
Compiler entry points, grammar/IR generators, reference implementation where valid, resource limits, corpus.

## Context to inspect
Existing fuzz harnesses, sanitizers, timeout handling, crash minimizers, undefined-behavior filters, seed corpus, CI fuzz infrastructure.

## Core knowledge
Randomness is useful only with valid or intentionally invalid input models and reliable oracles. Differential testing must exclude undefined/implementation-defined behavior unless normalized.

## Procedure
1. Define target stage and bug classes.
2. Build a deterministic harness with time/memory limits.
3. Seed with diverse valid and malformed examples.
4. Generate or mutate syntax/IR while respecting chosen validity constraints.
5. Select oracle: crash-free, verifier, interpreter, reference compiler, or metamorphic relation.
6. Filter undefined behavior from semantic comparisons.
7. Minimize failures automatically.
8. Convert every confirmed bug into a deterministic regression test.

## Decision points
Grammar-aware generation improves semantic depth; byte mutation is cheap and effective for parser robustness. Differential testing is strongest with independent implementations.

## Common failure patterns
Comparing undefined programs, nondeterministic harnesses, no resource limits, duplicate crashes, corpus bloat, fuzz-only fixes without regression tests.

## Verification
Reproduce minimized cases, confirm sanitizer/verifier findings, and verify fixed cases across relevant configurations.

## Expected output
Actionable minimized failures and durable regression coverage.

## Stop conditions
Stop triage when the oracle is unreliable or failures depend on unsupported nondeterministic external state.