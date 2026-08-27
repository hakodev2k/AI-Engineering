# Interface Contract Rules

## Purpose
Keep WebAssembly component and host interfaces precise, evolvable, and interoperable.

## Scope
Applies to WIT or equivalent IDLs, ABI-facing contracts, component interfaces, and generated bindings.

## MUST
- Interface contracts MUST define types, optionality, errors, ownership, and semantic constraints explicitly.
- Contract changes MUST be classified as compatible or breaking before merge.
- Generated bindings MUST be reproducible from version-controlled interface definitions.
- Error variants crossing a boundary MUST preserve actionable semantics without leaking sensitive internals.
- Consumers MUST be tested against the exact contract version they claim to support.

## MUST NOT
- A breaking contract change MUST NOT be released under an unchanged compatibility promise.
- Generated bindings MUST NOT be hand-edited as the source of truth.
- Numeric or string sentinel values MUST NOT substitute for explicit optional or error types when the interface system supports them.

## SHOULD
- Contracts SHOULD use domain types instead of loosely structured byte or string payloads.
- Additive evolution SHOULD be preferred when it preserves clear semantics.
- Interface documentation SHOULD state units, ranges, ordering, idempotency, and side effects where relevant.

## Exceptions
Opaque payloads are acceptable when interoperability requires them, but their schema/versioning mechanism and validation strategy must be documented.

## Verification
Diff interface definitions, regenerate bindings in CI, run producer-consumer compatibility tests, and inspect release notes for breaking changes. Reviewers must be able to map every generated binding to a committed interface source.