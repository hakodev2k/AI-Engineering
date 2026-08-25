# FFI and Interoperability

## Purpose
Keep foreign-function boundaries memory-safe, ABI-correct, and diagnosable.

## Scope
C ABI, native libraries, callbacks, handles, raw buffers, and cross-language ownership.

## MUST
- Every FFI boundary MUST define ownership, lifetime, nullability, thread-safety, error, and allocation responsibilities.
- ABI-visible types MUST use stable representations appropriate to the foreign contract.
- Foreign inputs MUST be validated before conversion into trusted Rust abstractions.
- Panics MUST be prevented from unwinding across FFI boundaries unless explicitly supported and proven safe.

## MUST NOT
- MUST NOT free memory with an allocator different from the one that allocated it unless the contract explicitly supports this.
- MUST NOT dereference foreign pointers without validating required invariants.

## SHOULD
- Keep unsafe FFI code in a thin adapter and expose safe Rust wrappers.
- Test supported architectures and foreign library versions.

## Exceptions
Any platform-specific assumption must be documented with its supported target matrix.

## Verification
Use ABI tests, sanitizer/Miri runs where applicable, integration tests with the real foreign component, and manual invariant review.