# Skill: Replay Verification

## Purpose
Independently prove what the replay attempted and whether downstream behavior completed safely.

## Inputs
Validated replay plan, plan hash, provider receipts, post-replay queue state, application logs/traces, business-side-effect evidence.

## Procedure
1. Recompute the replay-plan SHA-256 and compare it with the execution record.
2. Compare attempted message IDs with approved message IDs exactly.
3. Require one receipt entry for every attempted message.
4. Treat `unknown` receipt status as reconciliation-required.
5. Confirm no unapproved message was attempted.
6. Verify downstream processing from application evidence; transport acceptance alone is insufficient.
7. Check deduplication/business keys for duplicate side effects.
8. Run relevant repository tests/build checks if implementation changed.
9. Run `scripts/verify-replay-evidence.py`.
10. Set final state to verified, failed, blocked, or reconciliation-required.

## Failure handling
One bounded correction is allowed for evidence-format defects. Replay execution is not automatically repeated.

## Stop conditions
Do not mark verified while any outcome is unknown, approval evidence is missing, or business-side-effect checks are incomplete.
