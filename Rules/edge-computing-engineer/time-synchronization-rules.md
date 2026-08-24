# Time Synchronization
## Purpose
Avoid correctness failures caused by clock drift, skew, and unavailable time sources.
## Scope
Ordering, expiry, certificates, telemetry, distributed coordination, and audit records.
## MUST
- Systems MUST define where wall-clock time is authoritative and where monotonic time is required.
- Clock skew tolerance MUST be explicit for security and ordering decisions.
- Loss of synchronization MUST be observable when it can affect correctness.
## MUST NOT
- MUST NOT use unsynchronized wall clocks as a total ordering mechanism across nodes.
- MUST NOT silently accept expired credentials because local time is unreliable.
## SHOULD
- Multiple trusted time sources SHOULD be used where time is safety- or security-critical.
## Exceptions
Offline operation with uncertain time requires bounded semantics and documented reconciliation.
## Verification
Inject skew, remove time sources, inspect certificate behavior, and validate event ordering and telemetry timestamps.