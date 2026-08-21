# Revalidate Verification Evidence

## Purpose
Determine whether previously passing verification evidence still proves correctness for the repository state that is about to be reported, merged, released, or deployed.

## Inputs
Current source/base revisions, current input/environment fingerprints, evidence records, policy, and changed-file context.

## Process
1. Recompute the current source and base revisions.
2. Recompute the relevant input fingerprint; never reuse a stored value without recalculation.
3. Recompute environment fingerprint when required.
4. Evaluate each required evidence record with `scripts/evaluate-freshness.py`.
5. Classify each record as `fresh` or `stale` using deterministic reasons.
6. For stale records, map the invalidating change to the verification command it affects.
7. Re-run the smallest sufficient command set. Do not refresh metadata without execution.
8. Capture new evidence and re-evaluate it.
9. For configured high-risk categories, obtain independent review bound to the new evaluation fingerprint and current revision.
10. Run `scripts/evaluate-final-gate.py` across all required evaluations.

## Verification
Final gate exits 0 and emits `verified`; every consumed evidence record is fresh and passing.

## Failure handling
Transient command-launch/tool failure may be retried once. Test failures, stale revision/input/environment mismatches, permission errors, and policy violations are not retryable without a state change.

## Stop conditions
Stop when required evidence cannot be refreshed, a high-risk reviewer is unavailable, an unknown command outcome remains unresolved, or approval-required action is reached.