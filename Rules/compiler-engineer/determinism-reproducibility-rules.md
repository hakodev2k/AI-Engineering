# Determinism and Reproducibility Rules

## Purpose
Make equivalent builds produce predictable outputs and diagnoses.

## Scope
Iteration order, timestamps, paths, randomization, parallel compilation, object emission, and caches.

## MUST
- Reproducible-build modes MUST eliminate undocumented time, host, path, and iteration-order dependencies.
- Parallel compilation MUST not change semantics or diagnostic correctness.
- Randomized algorithms MUST expose controlled seeds for reproduction.
- Cache keys MUST include every input that can affect compiler output.

## MUST NOT
- MUST NOT depend on hash-map iteration order for semantic decisions.
- MUST NOT reuse cached artifacts across incompatible compiler options or target states.
- MUST NOT report nondeterministic failures without capturing reproduction data when available.

## SHOULD
- Identical builds SHOULD produce byte-identical artifacts where platform formats permit.
- Test failures SHOULD print relevant seeds and options.

## Exceptions
Unavoidable nondeterminism requires documented source and bounded impact.

## Verification
Repeat builds across processes and hosts, compare artifacts, randomize scheduling, validate cache keys, and run seeded stress tests.