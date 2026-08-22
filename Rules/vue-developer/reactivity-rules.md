# Reactivity Rules

## Purpose
Prevent stale state, accidental deep work, feedback loops, and identity bugs in Vue's reactivity system.

## Scope
ref, reactive, computed, watch, watchEffect, shallow APIs, and reactive collections.

## MUST
- Derived state MUST use computed values or equivalent deterministic derivation unless independent storage is justified.
- Watchers that trigger asynchronous work MUST handle stale results, cancellation, or ordering where races can occur.
- Reactive state ownership and mutation points MUST be identifiable during review.
- Deep observation of large structures MUST be justified by measured or bounded cost.
- External non-Vue objects placed in reactive state MUST use an appropriate shallow or raw strategy when proxying is unsafe.

## MUST NOT
- Watchers MUST NOT be used to synchronize duplicated state when the value can be derived directly.
- Computed getters MUST NOT perform externally visible side effects.
- Code MUST NOT rely on object identity surviving reactive proxy conversion unless that behavior is explicitly handled.

## SHOULD
- Prefer the narrowest reactive primitive that satisfies the ownership and update model.
- Keep watcher sources explicit when precise invalidation matters.

## Exceptions
Duplicated derived state may be retained for performance or interoperability only with evidence, synchronization rules, and regression tests.

## Verification
Review dependency graphs, watcher cleanup/race behavior, profiler evidence for expensive effects, and tests covering update ordering.