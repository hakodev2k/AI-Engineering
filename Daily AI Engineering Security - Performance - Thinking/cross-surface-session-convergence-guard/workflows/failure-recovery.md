# Workflow: Failure Recovery

## Trigger
Convergence remains blocked after an initial recovery attempt.

## Goal
Recover without losing newer canonical state.

## Inputs
Mismatch classification and before/after snapshots.

## Stages
1. Re-read authority state.
2. For registration drift, re-register through supported APIs and recapture.
3. For selected-child drift, refresh the surface; do not write the stale pointer back.
4. For writer conflict, wait for lease expiry or require operator resolution.
5. For version/turn lag, force a read refresh, not a destructive reset.
6. Run one final comparison.

## Retry policy
One additional retry; package total remains 2.

## Failure path
Mark the surface read-only/unavailable for continuation and escalate.

## Stop condition
No destructive fallback is automatic.

## Verification
Independent verifier must confirm final state.