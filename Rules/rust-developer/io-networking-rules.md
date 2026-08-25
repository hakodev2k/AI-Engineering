# I/O and Networking

## Purpose
Keep external I/O bounded, resilient, protocol-correct, and safe under partial failure.

## Scope
Files, sockets, HTTP clients, streams, DNS, IPC, and external service calls.

## MUST
- External I/O MUST use explicit timeouts where indefinite blocking would violate availability goals.
- Reads and writes from untrusted peers MUST enforce size and resource limits.
- Retry behavior MUST be bounded and limited to operations whose semantics permit retry.
- Partial reads/writes and connection termination MUST be handled according to protocol semantics.

## MUST NOT
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT trust filenames, paths, peer metadata, or protocol fields without validation.
- MUST NOT allow retry storms or unbounded connection creation.

## SHOULD
- Apply backoff with jitter, connection pooling, backpressure, and circuit breaking where evidence supports them.
- Instrument dependency latency and failure classes.

## Exceptions
Protocols lacking native timeout or idempotency support require explicit compensating controls.

## Verification
Use integration tests with faults, timeout tests, malformed-input tests, load tests, and telemetry inspection under dependency degradation.