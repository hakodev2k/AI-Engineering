# System Call and ABI Rules

## Purpose
Protect stable user/kernel contracts and prevent accidental compatibility or security regressions.

## Scope
System calls, ioctls, binary layouts, user-visible flags, return codes, and compatibility layers.

## MUST
- User-visible ABI changes MUST be reviewed for backward and forward compatibility before merge.
- Kernel boundaries MUST validate user pointers, lengths, flags, enum values, alignment, and reserved fields.
- Structures crossing the ABI boundary MUST have defined layout, initialization, and extension semantics.
- New interfaces MUST define error behavior, cancellation, concurrency, and partial-success semantics.
- Breaking ABI changes MUST require explicit human approval and migration strategy.

## MUST NOT
- MUST NOT copy uninitialized kernel memory to user space.
- MUST NOT dereference user-controlled pointers without the platform's safe access mechanism.
- MUST NOT repurpose existing flags or fields incompatibly.
- MUST NOT make structure padding part of an accidental ABI.

## SHOULD
- Prefer extensible interfaces with explicit sizes, flags, or versioning where appropriate.
- Unknown optional flags SHOULD be rejected or handled according to a documented compatibility policy.
- ABI tests SHOULD survive kernel upgrades and mixed-version environments.

## Exceptions
Exceptions require compatibility evidence, affected consumer analysis, migration plan, and maintainer approval.

## Verification
Run ABI regression tests, fuzz boundary inputs, inspect structure layouts, test compatibility modes, and review diffs for user-visible constants, errors, and semantics.