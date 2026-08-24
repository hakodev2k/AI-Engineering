# ABI and Calling Convention Rules

## Purpose
Preserve binary interoperability across compiler versions, languages, and system components.

## Scope
Calling conventions, data layout, symbol naming, stack frames, registers, unwind metadata, and object interfaces.

## MUST
- ABI-visible layout and calling behavior MUST match the declared platform contract.
- ABI changes MUST be classified for compatibility and reviewed before release.
- Register preservation, stack alignment, argument passing, and return rules MUST be tested.
- Cross-language interfaces MUST use documented interoperable representations.

## MUST NOT
- MUST NOT change public mangling or layout accidentally.
- MUST NOT reuse reserved ABI fields or registers without platform authorization.
- MUST NOT assume producer and consumer use the same compiler version.

## SHOULD
- ABI tests SHOULD include mixed-version and mixed-toolchain scenarios.
- Stable ABI surfaces SHOULD minimize implementation-specific encodings.

## Exceptions
Breaking ABI changes require explicit versioning/migration strategy and human approval.

## Verification
Run ABI conformance tests, binary diff checks, cross-toolchain linking, unwind tests, and platform-specific validation.