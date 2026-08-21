# Wait and Synchronization Rules

## Purpose
Synchronize automation with system behavior without hiding latency defects or creating flaky timing assumptions.

## Scope
Applies to UI transitions, API polling, background jobs, queues, eventual consistency, and asynchronous workflows.

## MUST
- Waits MUST target an observable completion or readiness condition.
- Every polling loop MUST have a bounded timeout and diagnostic failure output.
- Timeout values MUST reflect expected system behavior and test purpose, not merely eliminate failures.
- Eventual-consistency tests MUST define the accepted convergence condition and maximum observation window.

## MUST NOT
- MUST NOT add increasingly long sleeps to mask race conditions.
- MUST NOT wait only for visual presence when business readiness requires stronger evidence.
- MUST NOT poll without backoff or bounded frequency when it can overload the system.

## SHOULD
- Prefer protocol-level or state-level readiness signals over visual timing proxies.
- Track wait duration when it can reveal performance regressions.

## Exceptions
Fixed delay requires documented absence of a reliable signal and evidence that the delay is bounded and acceptable.

## Verification
Inspect wait primitives, timeout telemetry, failure screenshots/logs, and repeated runs under slow and fast conditions.