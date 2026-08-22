# Release Failure Troubleshooting

## Purpose
Diagnose failed or unhealthy releases quickly while preserving evidence and limiting further impact.

## When to use
Use when builds, promotions, deployments, migrations, rollout checks, or post-release health validation fail.

## Inputs
Release identity, pipeline logs, deployment events, telemetry, target state, recent changes, dependency status, and known-good baseline.

## Preconditions
Access is sufficient to inspect relevant systems without making uncontrolled production changes.

## Context to inspect
Inspect the first failing stage, artifact metadata, configuration diff, credentials/permissions, platform events, application logs, metrics, traces, migrations, and external dependencies.

## Core knowledge
Separate pipeline failure from product regression. Preserve chronology and compare candidate against known-good state. Avoid repeated blind retries: retries can amplify migrations, side effects, rate limits, or partial state.

## Procedure
1. Freeze further rollout if impact may grow.
2. Record artifact, environment, stage, and timestamps.
3. Identify the earliest reliable failure signal.
4. Determine whether failure is build, control-plane, deployment, application, data, or dependency related.
5. Compare configuration and state with the last known-good release.
6. Correlate logs, metrics, traces, and platform events.
7. Test the strongest hypothesis with the least destructive action.
8. Recover using rollback, roll-forward, retry, or dependency remediation as justified.
9. Verify service health and data integrity.
10. Capture root cause and prevention actions.

## Decision points
Retry only when evidence indicates transient and idempotent failure. Roll back when known-good compatibility is safe; otherwise halt and roll forward deliberately.

## Common failure patterns
Blind retry loops, changing multiple variables at once, deleting failed resources before collecting evidence, assuming the latest code change is causal, and declaring recovery based only on pipeline green status.

## Verification
Confirm target health, critical flows, artifact identity, data integrity, and absence of continuing error signals. Reproduce the root cause safely when feasible.

## Expected output
A timestamped diagnosis, recovery result, evidence, and actionable prevention items.

## Stop conditions
Escalate when destructive recovery is required, data integrity is uncertain, permissions are insufficient, or investigation time exceeds incident objectives without narrowing the cause.