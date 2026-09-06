# Testing and Fault Injection Rules

## Purpose
Prove CDC correctness under realistic changes and failures before production exposure.

## Scope
Unit, integration, end-to-end, compatibility, restart, network, broker, and source failure tests.

## MUST
- Tests MUST cover insert, update, delete, rollback, schema change, duplicate delivery, and restart behavior where supported.
- Critical pipelines MUST test failures between capture, publish, sink write, and acknowledgement.
- Snapshot-to-stream handoff MUST have concurrent-write tests.
- Tests MUST validate state correctness, not only event presence.
- Recovery tests MUST assert no unexplained gaps after restart.

## MUST NOT
- MUST NOT rely solely on mocked source logs for production-critical semantics.
- MUST NOT ignore nondeterministic CDC tests without investigation.
- MUST NOT claim exactly-once behavior without failure-path evidence.

## SHOULD
- Use representative database engines and versions in integration tests.
- Inject latency, disconnection, process death, and downstream unavailability.

## Exceptions
Unavailable failure modes require documented manual validation or equivalent evidence.

## Verification
Inspect CI suites, fault scenarios, state assertions, compatibility matrices, and failure-test results.