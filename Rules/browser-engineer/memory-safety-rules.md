# Memory Safety Rules
## Purpose
Prevent use-after-free, out-of-bounds access, lifetime corruption, and exploitable memory defects.
## Scope
Native browser-engine code and unsafe foreign-function boundaries.
## MUST
- Ownership and lifetime MUST be explicit for objects crossing threads, tasks, callbacks, or subsystem boundaries.
- Untrusted lengths, indexes, offsets, and allocations MUST be validated before memory access.
- Memory-safety defects MUST be treated as security-relevant until triaged otherwise.
## MUST NOT
- MUST NOT rely on timing assumptions to keep objects alive.
- MUST NOT suppress sanitizer findings without a proven false-positive analysis.
## SHOULD
- SHOULD prefer memory-safe abstractions and checked arithmetic on attacker-influenced paths.
## Exceptions
Unsafe techniques require documented necessity, invariants, focused tests, and security-aware review.
## Verification
Use ASan, MSan, UBSan or platform equivalents, fuzzing, static analysis, stress tests, and manual lifetime review.