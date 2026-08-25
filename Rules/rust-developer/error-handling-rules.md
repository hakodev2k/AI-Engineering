# Error Handling

## Purpose
Ensure failures preserve context, remain actionable, and do not compromise correctness.

## Scope
Applies to recoverable errors, library error contracts, service failures, and fatal conditions.

## MUST
- Recoverable failures MUST be represented explicitly with `Result` or an equivalent typed contract.
- Errors crossing module or service boundaries MUST retain actionable context without exposing secrets.
- Library error types MUST distinguish caller-actionable failure classes where consumers need to branch on them.
- Error conversion MUST preserve the causal chain where operational diagnosis depends on it.

## MUST NOT
- MUST NOT use `unwrap`, `expect`, or panic on untrusted or routine runtime failure paths in production code.
- MUST NOT silently discard errors.
- MUST NOT expose credentials, tokens, or sensitive payloads in error messages.

## SHOULD
- Use domain-specific error enums for stable library contracts.
- Add context at architectural boundaries rather than repeatedly wrapping without new information.

## Exceptions
A panic may be appropriate for proven invariant violations or unrecoverable initialization failures; the invariant and failure policy must be documented.

## Verification
Use code review, Clippy policy, failure-path tests, log inspection, and integration tests that exercise dependency and input failures.