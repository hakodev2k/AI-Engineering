# Testing and Fault Injection Rules

## Purpose
Validate distributed correctness under concurrency, partial failure, and realistic scale.

## Scope
Unit, integration, model-based, load, chaos, recovery, and compatibility testing.

## MUST
- Critical invariants MUST be tested under concurrent execution and relevant failure modes.
- Tests MUST cover retries, duplicate delivery, delayed messages, node loss, and network interruption where applicable.
- Migration and upgrade tests MUST include mixed-version operation when production can enter that state.
- Fault injection MUST have bounded blast radius and explicit safety controls.

## MUST NOT
- MUST NOT infer distributed correctness from happy-path unit tests alone.
- MUST NOT run destructive chaos experiments in production without approved scope and abort criteria.
- MUST NOT accept flaky correctness tests as normal.

## SHOULD
- Model-based or property-based testing SHOULD be used for complex state transitions when practical.

## Exceptions
Production-only failure experiments require human approval and observability sufficient to stop safely.

## Verification
Inspect CI suites, fault matrices, deterministic seeds, chaos reports, and invariant assertions.