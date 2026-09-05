# Testing and Failure-Injection Rules

## Purpose
Validate message flows under the failures and timing conditions that create expensive production defects.

## Scope
Unit, integration, end-to-end, contract, replay, duplicate, broker-failure, and dependency-failure testing.

## MUST
- Critical flows MUST test duplicate delivery, retry, consumer crash, and unavailable dependency behavior.
- Contract tests MUST protect published schemas and compatibility assumptions.
- Tests involving ordering or concurrency MUST be deterministic enough to reproduce failures.
- Failure tests MUST verify both business outcomes and broker progress such as offsets, acknowledgements, or queue state.

## MUST NOT
- MUST NOT rely only on happy-path producer/consumer tests.
- MUST NOT mask flaky messaging tests with unlimited retries.
- MUST NOT use destructive production failure injection without explicit authorization.

## SHOULD
- Test broker restart, partition loss, rebalance, latency, and replay for high-criticality systems.

## Exceptions
Uncovered critical failure modes require documented limitation, alternative evidence, and approval.

## Verification
Review test suites, CI results, failure scenarios, determinism, and regression coverage.