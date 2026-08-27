# Memory Safety Rules

## Purpose
Prevent corruption, disclosure, and undefined behavior at linear-memory and host-memory boundaries.

## Scope
Applies to linear memory, shared memory, pointers/offsets, buffers, allocators, and host guest memory exchange.

## MUST
- Every host access to guest memory MUST validate bounds before reading or writing.
- Pointer-plus-length arithmetic MUST be checked for overflow.
- Buffer ownership and lifetime MUST be explicit across every boundary.
- Untrusted lengths, offsets, and indices MUST be validated before allocation or access.
- Memory growth and allocation failure MUST have defined handling.

## MUST NOT
- Host code MUST NOT retain guest memory addresses beyond the lifetime in which their validity is guaranteed.
- Guest-controlled offsets MUST NOT be converted into host pointers without validation.
- Sensitive memory MUST NOT be exposed through debug exports, snapshots, or diagnostic dumps without authorization.
- Unsafe native integration MUST NOT rely on WebAssembly sandboxing to compensate for host memory bugs.

## SHOULD
- Prefer typed component interfaces over raw pointer/length protocols.
- Fuzz boundary parsers and memory adapters.
- Limit maximum accepted buffer sizes based on workload requirements.

## Exceptions
Low-level ABI integration may require raw memory operations. The exception must document invariants, bounds checks, ownership, fuzzing evidence, and reviewer approval.

## Verification
Run sanitizers where native host code is involved, fuzz boundary operations, execute malformed offset/length tests, inspect allocator behavior under exhaustion, and review all unsafe memory adapters manually.