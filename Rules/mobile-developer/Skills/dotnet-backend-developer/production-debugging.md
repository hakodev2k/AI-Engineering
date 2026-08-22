# Production Debugging

## Purpose
Diagnose production defects safely using evidence, controlled hypotheses, and reversible mitigation.

## When to use
Incidents, intermittent failures, data mismatches, crashes, timeouts, or environment-only behavior.

## Inputs
Incident timeline, logs, traces, metrics, deploy history, configuration, sample identifiers, reproduction details.

## Context to inspect
Recent changes, affected scope, dependency health, feature flags, exceptions, resource saturation, data anomalies.

## Core knowledge
Preserve evidence, distinguish symptom from cause, correlate by time/request/entity, and reduce customer impact before deep diagnosis when appropriate.

## Procedure
1. State impact and scope.
2. Stabilize service with safe rollback/feature disable when justified.
3. Build a timeline.
4. Compare healthy vs failing requests/instances.
5. Use logs/traces/metrics to narrow subsystem.
6. Form and test one hypothesis at a time.
7. Reproduce in a safe environment where possible.
8. Implement the smallest corrective change.
9. Verify recovery and monitor recurrence.
10. Capture prevention actions.

## Decision points
Mitigate first when user impact is high and rollback is safe; investigate first when mitigation itself risks data/security.

## Common failure patterns
Changing production blindly, deleting evidence, assuming latest deploy is always cause, querying sensitive data excessively, declaring fixed without monitoring.

## Verification
Customer-impact metrics recover, failing scenario passes, no new error pattern, follow-up monitoring remains stable.

## Expected output
Evidence-supported root cause or bounded uncertainty plus verified mitigation/fix.

## Stop conditions
Escalate destructive actions, privileged production access, or suspected security incidents.