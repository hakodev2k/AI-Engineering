# Robot Communication Rules
## Purpose
Keep distributed robot communication bounded, compatible, and observable.
## Scope
Middleware, messages, services, field networks, remote commands, and time synchronization.
## MUST
- Define message schemas, units, frames, timestamps, QoS, ordering, timeout, and compatibility expectations.
- Authenticate or otherwise protect consequential remote command channels according to threat model.
- Detect stale commands and communication loss and transition to defined behavior.
- Version breaking interface changes and coordinate producer/consumer rollout.
## MUST NOT
- Retry non-idempotent consequential commands blindly.
- Let unbounded queues convert overload into stale control actions.
## SHOULD
- Separate control-critical traffic from bulk telemetry where contention is possible.
## Exceptions
Compatibility exceptions require documented affected consumers, migration plan, and rollback.
## Verification
Use schema tests, network impairment tests, timeout tests, queue telemetry, clock-sync checks, and interoperability tests.