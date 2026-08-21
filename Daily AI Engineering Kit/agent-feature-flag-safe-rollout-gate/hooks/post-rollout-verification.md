# Hook: Post-Rollout Verification

## Trigger
Immediately after a rollout mutation and before any further exposure increase.

## Preconditions
Previous state, executed state, contract, and telemetry sources are available.

## Action
1. Fetch actual flag state from the source of truth.
2. Confirm it matches the executed state exactly.
3. Run `skills/verify-rollout-state.md` using current telemetry.
4. Persist verifier status and evidence.

## Expected result
Status is `verified` and all success/rollback conditions have evidence.

## Failure behavior
`rollback_required`, `verification_incomplete`, `blocked`, ambiguous state, or missing telemetry prevents further rollout.

## Blocking
Yes.
