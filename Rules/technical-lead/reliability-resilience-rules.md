# Reliability and Resilience Rules
## Purpose
Ensure expected failures are contained and recoverable.
## Scope
Distributed calls, dependencies, queues, background work, storage, and critical runtime paths.
## MUST
- Critical dependencies MUST have explicit timeout and failure behavior.
- Retryable operations MUST define bounded retries, backoff, and idempotency implications.
- Critical workflows MUST define behavior for partial failure and recovery.
## MUST NOT
- Add unbounded retries or retry known non-transient failures by default.
- Assume external dependencies are continuously available or infinitely scalable.
## SHOULD
- Use graceful degradation, isolation, and backpressure when business requirements justify them.
## Exceptions
Simpler failure handling requires evidence that impact and recovery expectations are acceptable.
## Verification
Review resilience configuration, failure tests, incident evidence, telemetry, and recovery procedures.