# Testing

## Purpose
Provide deterministic evidence that Rust software satisfies contracts, invariants, and failure behavior.

## Scope
Unit, integration, property, concurrency, fuzz, regression, and end-to-end tests.

## MUST
- Critical invariants and externally visible contracts MUST have regression protection.
- Bug fixes MUST add a test that fails for the defect when practical.
- Tests MUST control nondeterministic dependencies such as time, randomness, and external services where determinism is required.
- Safety-critical parsers and protocol boundaries MUST include malformed and adversarial input coverage.

## MUST NOT
- MUST NOT hide flaky tests with unlimited retries.
- MUST NOT use sleeps as the primary correctness synchronization mechanism.
- MUST NOT assert only implementation details when behavioral contracts can be asserted.

## SHOULD
- Use property tests for invariant-rich transformations and fuzzing for parsers/decoders.
- Keep test fixtures minimal and explicit.

## Exceptions
Unavoidable nondeterminism must have bounded retry policy, evidence, and ownership for remediation.

## Verification
Run tests repeatedly and in CI, inspect coverage of critical paths, execute fuzz/property suites, and track flaky-test rate.