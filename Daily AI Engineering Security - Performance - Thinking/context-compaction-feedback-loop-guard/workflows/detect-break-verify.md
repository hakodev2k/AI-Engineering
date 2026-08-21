# Workflow: Detect → Measure → Break Loop → Verify

## Trigger
Repeated compaction, context overflow recovery, or a post-compaction request that remains above threshold.

## Goal
Stop repeated low-value compaction while retaining required task context and producing measurable recovery evidence.

## Inputs
Session event ledger, token buckets, source fingerprints, provider limit/usage, protected-tail policy, and `config/policy.json`.

## Baseline
Record compaction count, attempts per fingerprint, tokens per attempt, pre/post request tokens, progress ratio, and 10-minute compaction rate.

## Context
Use `skills/compaction-diagnosis.md` and enforce `rules/compaction-control-rules.md`.

## Stages
1. Observe and fingerprint source state.
2. Measure baseline and request composition.
3. Diagnose insufficient progress, retry debris, protected-tail saturation, estimator error, or non-text payload dominance.
4. Form one falsifiable hypothesis.
5. Apply bounded controller policy.
6. Measure the next effective request.
7. If progress is below threshold, open cooldown; retry at most within policy after source state materially changes.
8. If safe target cannot be reached, emit manual recovery.
9. Independent verifier replays loop and retention fixtures.

## Responsible agent
Implementation agent owns stages 1–8. `subagents/compaction-verifier.md` owns independent verification.

## Tools
`python3 scripts/compaction_guard.py`, test runner, sanitized traces, token telemetry, and source inspection.

## Outputs
Controller decision, source fingerprint, attempts used, progress ratio, token-spend classification, recovery action, and verification record.

## Checkpoints
- Baseline captured before policy change.
- Source fingerprint stable and reproducible.
- Retry debris separated from task state.
- Post-compaction request measured.
- Required-context fixture retained.
- Independent verification complete.

## Metrics
Compactions/10m, attempts/fingerprint, before/after tokens, progress ratio, failed-compaction tokens, post-compaction utilization, and retained-context pass rate.

## Retry policy
At most the configured attempts per fingerprint. Measurement noise may be rerun up to 3 times; controller retries require a materially changed source state or cooldown expiry.

## Stop conditions
Circuit open, insufficient progress after max attempts, no compressible range, missing required accounting, or a retention regression.

## Failure path
Preserve evidence, stop automatic compaction, keep current session state unchanged, and surface manual/new-session recovery. Do not drop required context or weaken thresholds to hide the failure.

## Verification
Independent replay must demonstrate bounded attempts and preserved required context.

## Definition of Done
Evidence and baseline captured; root cause supported; controller implemented; loop fixture bounded; successful compaction fixture passes; required context retained; metrics recorded; independent verification passes; no blocking issue remains.
