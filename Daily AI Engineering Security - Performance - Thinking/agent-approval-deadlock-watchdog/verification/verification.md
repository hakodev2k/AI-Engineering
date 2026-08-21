# Verification Contract

## Implemented
The package implements a deterministic approval-lifecycle validator, configurable deadlines, parent-route validation, exact terminal-state checks, hooks, recovery workflow, and regression fixtures.

## Measured
For a real host integration, capture before/after:
- request count;
- surfaced ratio;
- terminal ratio;
- p50/p95 request-to-surface latency;
- p50/p95 request-to-decision latency;
- surface timeout count;
- decision timeout count;
- orphan/duplicate event count;
- approval-related stalled minutes;
- duplicate gated-side-effect count.

A package-only run can validate state-machine behavior but cannot claim production latency improvement until host telemetry is supplied.

## Verified criteria
A deployment is Verified only when all are true:
1. normal approve and deny requests reach exactly one terminal state;
2. hidden approval surface is detected within configured surface deadline;
3. decision timeout fails closed and never becomes implicit approval;
4. child approval without required parent route is blocked;
5. unknown/orphan terminal events are rejected;
6. second terminal/post-terminal events are rejected;
7. delivery retries are bounded;
8. gated side effects are not replayed during approval recovery;
9. no broad permission bypass was introduced;
10. diagnostics contain no sensitive payloads;
11. post-change host metrics show no unresolved request beyond deadline + grace;
12. an independent verifier, not the implementing agent alone, reviews the evidence.

## Failure handling
**Detection:** watchdog exit code 2 or host metric alert.

**Evidence:** request ID, agent IDs, lifecycle timestamps, route identifier, violation code. Payload contents are unnecessary.

**Retry policy:** at most `max_surface_retries` for delivery. No automatic approval retry and no side-effect retry while execution status is ambiguous.

**Fallback:** deny/cancel and escalate according to policy.

**Escalation:** operator receives request ID, originating agent/tool class, age, and violation code.

**Stop condition:** if request correlation, execution status, or permission semantics cannot be proven, stop the affected workflow rather than weaken controls.

## Definition of Done
- research evidence is documented;
- baseline can be captured;
- lifecycle adapter is implemented;
- configured deadlines are explicit;
- regression fixtures pass;
- real host metrics are collected;
- before/after comparison is recorded;
- safety invariants pass independent review;
- no unresolved approval or blocking defect remains.
