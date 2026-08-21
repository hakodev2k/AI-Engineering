# Distributed Systems Performance Rules
## Purpose
Manage performance effects created by service boundaries and partial failures.
## Scope
Service calls, messaging, retries, fan-out, queues, and distributed workflows.
## MUST
- Account for cumulative latency, fan-out amplification, retries, and queue delay in end-to-end budgets.
- Measure dependency behavior under degraded conditions.
- Bound retries with timeouts, backoff, and idempotency where required.
## MUST NOT
- Evaluate a distributed component in isolation when downstream behavior dominates the user path.
- Allow retry storms to amplify overload.
## SHOULD
- Prefer graceful degradation for non-critical dependencies.
## Exceptions
Critical synchronous dependencies require documented availability and latency assumptions.
## Verification
Inspect traces, retry metrics, queue age, dependency SLOs, and failure-load tests.