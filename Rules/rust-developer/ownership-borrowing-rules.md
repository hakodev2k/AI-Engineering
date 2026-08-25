# Ownership and Borrowing

## Purpose
Protect memory safety, API clarity, and predictable resource lifetimes through deliberate ownership design.

## Scope
Applies to Rust application, library, service, and systems code.

## MUST
- Ownership boundaries MUST reflect the real lifetime and responsibility of data.
- Borrowed references MUST remain no broader in lifetime or mutability than required.
- Public APIs MUST make ownership transfer, borrowing, and mutation semantics evident from their signatures.
- Cloning introduced to resolve ownership conflicts MUST be justified by correctness or measured cost.

## MUST NOT
- MUST NOT use `unsafe` merely to bypass borrow-checker constraints.
- MUST NOT introduce pervasive `Rc`, `Arc`, `RefCell`, or `Mutex` to avoid designing ownership boundaries.
- MUST NOT retain references beyond the validity guaranteed by their owners.

## SHOULD
- Prefer borrowing over ownership transfer when the callee does not need to retain data.
- Prefer immutable references unless mutation is part of the contract.
- Prefer restructuring data flow over unnecessary cloning.

## Exceptions
Exceptions require documented constraints, alternatives considered, correctness evidence, and performance evidence when cost is relevant.

## Verification
Review signatures and lifetimes; run compiler checks, Clippy, tests, and benchmarks where cloning or shared ownership may be material.