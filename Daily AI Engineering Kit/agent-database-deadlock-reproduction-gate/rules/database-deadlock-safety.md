# Database Deadlock Safety Rules

## MUST
- Reproduce or preserve native deadlock evidence before declaring root cause.
- Map every wait edge to known transactions/resources where possible.
- Run candidate reproduction at least the configured minimum number of times.
- Preserve baseline and candidate evidence.
- Run relevant host tests/build.
- Require independent verification before completion.

## MUST NOT
- Treat a single passing concurrency test as proof of resolution.
- Hide candidate deadlocks by deleting failed runs.
- Increase lock timeout or retries solely to mask the cycle.
- Change isolation level, schema, indexes, production config, or deployment state without explicit approval.
- Run destructive SQL or force Git history changes without approval.
- Retry indefinitely.

## SHOULD
- Prefer consistent lock ordering and reduced transaction duration.
- Keep reproduction data deterministic and minimal.
- Separate deadlock elimination from throughput/performance optimization.
