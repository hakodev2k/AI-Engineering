# Production Troubleshooting

## Purpose
Diagnose Terraform failures and infrastructure mismatches under production constraints without worsening the incident.

## When to use
Failed applies, stuck locks, partial creation, provider errors, unexpected drift, or post-change incidents.

## Inputs
Error output, saved plan, state, CI logs, provider/cloud audit logs, incident timeline.

## Context to inspect
Last successful commit/apply, backend lock, state serial, partial resources, provider status, credentials, concurrent changes.

## Core knowledge
Terraform failures may leave real resources changed while state updates are partial. Separate service restoration from state reconciliation and preserve evidence.

## Procedure
1. Freeze unrelated applies to the affected state.
2. Establish incident timeline and last known-good state.
3. Determine whether failure is configuration, provider/API, permissions, state, quota, or dependency related.
4. Inspect real resources before retrying.
5. Restore service using the least risky approved action.
6. Reconcile state with imports/moves only after identity is proven.
7. Generate a fresh plan and inspect all deltas.
8. Apply controlled remediation and verify convergence.
9. Document root cause and preventive controls.

## Decision points
Retry only transient idempotent operations; do not loop on deterministic permission, quota, schema, or replacement failures.

## Common failure patterns
Repeated apply retries, force-unlocking active runs, deleting state entries, and treating service recovery as proof of Terraform consistency.

## Verification
Service health is restored, state matches reality, fresh plan converges, and incident evidence explains the failure.

## Expected output
Recovered service plus consistent Terraform state and RCA actions.

## Stop conditions
Stop on uncertain resource identity, active legitimate writer, suspected compromise, or destructive remediation requiring approval.