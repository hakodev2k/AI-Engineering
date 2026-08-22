# Backfill Lifecycle Hooks

## Pre-plan hook
**Trigger:** before designing a bulk mutation.  
**Action:** inspect schema/model, existing migration/backfill code, indexes, data volume evidence and target environment.  
**Failure:** missing stable cursor/idempotency evidence blocks planning.

## Pre-execution hook
**Trigger:** immediately before every initial execution or resume.  
**Command:**
```bash
python scripts/validate-backfill-state.py --plan artifacts/plan.json --checkpoint artifacts/checkpoint.json --policy config/backfill-policy.json --output artifacts/state-validation.json
python scripts/evaluate-resume-gate.py --plan artifacts/plan.json --checkpoint artifacts/checkpoint.json --validation artifacts/state-validation.json --review artifacts/review.json --policy config/backfill-policy.json --actor "$BACKFILL_ACTOR" --output artifacts/resume-gate.json
```
**Expected:** gate `allow`.  
**Blocking:** yes.

## Pre-production-mutation hook
**Trigger:** before first production write or any protected action.  
**Action:** stop and require explicit human approval bound to migration id/revision/fingerprint/scope.  
**Blocking:** yes.

## Post-chunk hook
**Trigger:** after a chunk attempt.  
**Action:** persist affected-key/count/idempotency evidence; run project-specific read-after-write verification. Advance checkpoint only if verified.  
**Failure:** mismatch/unknown blocks checkpoint advance.

## Checkpoint hook
**Trigger:** verified chunk.  
**Command:** use `scripts/advance-checkpoint.py` with current expected version, cursor, processed count and lease.  
**Failure:** version conflict blocks and forces reload.

## Final hook
**Trigger:** no eligible rows remain.  
**Action:** run final counts/business invariants, independent review, then mark completed.  
**Blocking:** yes; processed count alone is insufficient.
