# Memory Model and Aliasing Rules

## Purpose
Prevent miscompilations involving memory ordering, aliasing, and concurrency.

## Scope
Loads, stores, atomics, volatile operations, pointer provenance, alias analysis, and reordering.

## MUST
- Memory transformations MUST respect source and target memory models.
- Atomic ordering changes MUST have a formal legality argument or equivalent authoritative basis.
- Alias analysis MUST return conservative results when provenance is uncertain.
- Concurrency-sensitive fixes MUST include litmus or targeted regression tests.

## MUST NOT
- MUST NOT reorder memory operations across barriers without proven legality.
- MUST NOT assume non-aliasing from naming, allocation pattern, or common-case behavior.
- MUST NOT remove volatile or synchronization effects as dead code.

## SHOULD
- Memory-model assumptions SHOULD be documented beside the transform that consumes them.
- Target lowering SHOULD preserve ordering intent explicitly.

## Exceptions
Relaxed semantics require explicit language mode or user opt-in.

## Verification
Use concurrency litmus suites, sanitizer-supported tests, differential compilation, model checking where practical, and codegen inspection.