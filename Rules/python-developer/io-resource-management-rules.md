# I/O and Resource Management Rules
## Purpose
Prevent leaks, hangs, and unbounded resource consumption.
## Scope
Files, sockets, subprocesses, database handles, streams, and temporary resources.
## MUST
- Acquired resources MUST have deterministic cleanup paths.
- External I/O MUST have bounded waits appropriate to the operation.
- Large streams MUST be processed with bounded memory where practical.
## MUST NOT
- MUST NOT rely on garbage collection for timely release of scarce resources.
- MUST NOT leave subprocess lifecycle or file ownership ambiguous.
## SHOULD
- Prefer context managers and explicit lifecycle abstractions.
## Exceptions
Long-lived pooled resources require health and shutdown management.
## Verification
Failure tests, leak checks, timeout tests, and resource telemetry.