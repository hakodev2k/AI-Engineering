# Unsafe Code

## Purpose
Constrain `unsafe` to reviewed, auditable boundaries with explicit safety invariants.

## Scope
Applies to unsafe blocks/functions/traits, FFI, raw pointers, layout assumptions, and unsafe dependencies.

## MUST
- Every unsafe block MUST have a nearby safety rationale describing the invariants that make it sound.
- Unsafe code MUST be encapsulated behind the smallest practical safe abstraction.
- Preconditions of unsafe functions or traits MUST be documented precisely.
- Changes affecting unsafe invariants MUST receive explicit senior review and targeted tests.

## MUST NOT
- MUST NOT use unsafe for convenience, micro-optimization without measurement, or to silence ownership errors.
- MUST NOT expose a safe API that permits callers to violate hidden safety invariants.
- MUST NOT assume pointer validity, aliasing, alignment, initialization, or layout without evidence.

## SHOULD
- Prefer established safe libraries over custom unsafe implementations.
- Use Miri, sanitizers, fuzzing, and platform tests where applicable.

## Exceptions
New unsafe code requires a documented necessity, alternatives considered, invariant analysis, and approval appropriate to project risk.

## Verification
Review all unsafe sites, run Miri/sanitizers where supported, exercise edge cases, and audit dependency changes introducing unsafe code.