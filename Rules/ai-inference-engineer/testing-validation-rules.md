# Testing and Validation Rules

## Purpose
Prevent correctness, compatibility, performance, and failure-handling regressions in inference systems.

## Scope
Unit, integration, compatibility, numerical, load, soak, failure, and end-to-end tests.

## MUST
- Serving changes MUST have tests appropriate to the affected contract, runtime, scheduler, and hardware behavior.
- Numerical optimizations MUST be compared against an approved reference with defined tolerances and model-quality evidence where needed.
- Production-critical paths MUST include integration tests covering model load, request execution, cancellation, errors, and recovery.
- Load tests MUST use representative sequence lengths, batch behavior, concurrency, and hardware.
- Confirmed production failure modes MUST receive regression coverage where practical.

## MUST NOT
- MUST NOT rely only on synthetic single-request tests for distributed or concurrent serving behavior.
- MUST NOT ignore flaky inference tests; they MUST be investigated or quarantined with owner and expiry.
- MUST NOT approve performance changes when correctness validation fails.

## SHOULD
- Include soak tests for memory leaks, fragmentation, and long-running cache behavior.
- Preserve representative test artifacts for comparison across runtime upgrades.

## Exceptions
Unautomatable checks require documented manual evidence and reviewer ownership.

## Verification
Inspect CI results, test fixtures, numerical comparisons, load-test artifacts, soak results, and regression coverage.