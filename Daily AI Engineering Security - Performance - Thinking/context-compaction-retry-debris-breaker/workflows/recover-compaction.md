# Workflow — Recover Compaction

## Trigger
Context overflow, failed compaction, repeated equivalent compaction failure, or continuity regression after summary replacement.

## Goal
Recover the session with a bounded compaction payload while preserving verified semantic state.

## Inputs
Session export, prior summary, policy, provider limit, retry records.

## Baseline
Measure total characters/tokens, semantic-history size, retry-debris size, prior-summary size, and current retry count before any change.

## Stages
1. **Observe** — classify the failure and capture immutable evidence.
2. **Measure** — calculate baseline sizes and retry signature.
3. **Diagnose** — separate semantic items from excluded failure artifacts.
4. **Hypothesize** — predict whether debris removal and bounded tail make the request fit.
5. **Build candidate** — prior verified summary + bounded recent semantic tail; exclude retry debris.
6. **Preflight** — run `scripts/compaction_guard.py`.
7. **Retry once** if candidate is materially smaller/different and budget remains.
8. **Verify** — independent Compaction Verifier checks continuity.
9. **Commit recovered state** only after verification.

## Responsible agent
Recovery implementation: orchestrator. Verification: `subagents/compaction-verifier.md`.

## Tools
`config/policy.json`, `scripts/compaction_guard.py`, session export, diff/token estimator.

## Outputs
Baseline, candidate, exclusion report, guard decision, retry result, verification record.

## Checkpoints
- Candidate <= configured input ceiling.
- Excluded artifacts count recorded.
- Retry payload is >=10% smaller or strategy changed.
- Previous summary remains available until replacement is verified.

## Metrics
Input size before/after, retry count, excluded debris size, recovery latency, continuity coverage.

## Retry policy
Maximum 2 compaction retries. Each retry must materially reduce payload or change strategy.

## Stop conditions
Successful verified compaction; retry budget exhausted; candidate still unbounded; continuity failure after two candidate revisions.

## Failure path
Preserve last verified summary and raw history; stop automated retries; emit blocking diagnostic. Destructive session reset requires human approval.

## Definition of Done
Implemented: gate integrated. Measured: baseline/after metrics captured. Verified: continuity verifier passes and loop fixture terminates within bounds.
