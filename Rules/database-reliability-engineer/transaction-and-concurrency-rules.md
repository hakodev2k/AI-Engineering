# Transaction and Concurrency Rules

## Purpose
Preserve correctness under concurrent access while limiting blocking and deadlocks.

## Scope
Transactions, isolation, locking, optimistic concurrency, deadlocks, and retry behavior.

## MUST
- Choose isolation levels from documented consistency requirements, not habit.
- Keep transactions bounded in time and scope.
- Investigate recurring deadlocks using captured wait graphs or equivalent evidence.
- Ensure retries are safe against duplicate side effects and transaction ambiguity.

## MUST NOT
- Do not hold interactive or network-dependent work inside database transactions without justified design.
- Do not lower isolation to hide contention without analyzing correctness impact.

## SHOULD
- Prefer deterministic lock ordering and short critical sections where practical.

## Exceptions
Any relaxed consistency requires explicit invariant analysis, risk, owner, and verification.

## Verification
Inspect transaction durations, isolation configuration, lock waits, deadlock evidence, and concurrency tests.