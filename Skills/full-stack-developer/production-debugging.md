# Production Debugging

## Purpose
Investigate production failures systematically while minimizing additional user and system risk.

## When to use
Incidents, intermittent errors, unexplained data states, latency spikes, or environment-specific defects.

## Inputs
Incident timeline, symptoms, logs, metrics, traces, deployments, configuration, reproduction evidence.

## Context to inspect
Recent changes, affected cohorts, dependency health, feature flags, infrastructure events, data state, client versions.

## Core knowledge
Separate mitigation from root-cause analysis. Build hypotheses from evidence, preserve forensic signals, and change one variable at a time where possible.

## Procedure
1. Establish severity and user impact.
2. Preserve relevant telemetry and timestamps.
3. Compare affected versus healthy requests/users.
4. Correlate onset with deployments and configuration changes.
5. Trace one representative failure end-to-end.
6. Rank hypotheses by evidence and testability.
7. Mitigate safely if impact is ongoing.
8. Reproduce under controlled conditions.
9. Implement the smallest verified fix.
10. Add regression protection and update runbooks.

## Decision points
Rollback when a recent reversible change strongly correlates with impact; use forward fix when rollback is unsafe or data/schema changes prevent it.

## Common failure patterns
Restarting before collecting evidence, guessing from one log line, debugging only one layer, changing multiple systems simultaneously, and declaring root cause from correlation alone.

## Verification
Confirm symptoms cease, telemetry returns to baseline, regression tests cover the cause, and no secondary damage remains.

## Expected output
Mitigation, evidence-backed root cause, corrective action, and prevention measures.

## Stop conditions
Escalate destructive remediation, security incidents, or actions beyond authorized production access.