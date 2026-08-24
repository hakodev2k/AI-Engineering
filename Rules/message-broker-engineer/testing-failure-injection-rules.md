# Testing and Failure Injection

## Purpose
Verify messaging correctness under realistic failure modes, not only happy paths.

## Scope
Contract, integration, load, resilience, replay, and recovery tests.

## MUST
- Critical flows MUST test duplicates, delayed delivery, unavailable brokers, unavailable dependencies, malformed messages, and consumer restarts as relevant.
- Tests MUST verify durable business outcomes, not only successful API calls.
- Performance tests MUST use representative payloads and concurrency.

## MUST NOT
- MUST NOT rely exclusively on mocks for broker semantics that affect correctness.
- MUST NOT run destructive failure experiments against production without explicit approval and safeguards.

## SHOULD
- Automate deterministic integration tests with production-like broker configuration.

## Exceptions
Document untested risks and compensating operational controls.

## Verification
Review CI results, resilience scenarios, load evidence, and recovery assertions.