# Workflow: Resume → Verify → Recover

## Trigger
Any workflow restore after process/compute restart, deployment change, checkpoint migration or human-approval continuation.

## Goal
Prove the resumed execution state is semantically continuous before consequential work proceeds.

## Inputs
Checkpoint chain, intended restored checkpoint, workflow signature, stable executor IDs, runtime events and risk classification.

## Baseline
Record the last known-good checkpoint, pending/answered requests, iteration/superstep and workflow/executor identities.

## Stages
1. **Observe** — capture checkpoint and runtime evidence without executing consequential work.
2. **Measure baseline** — snapshot ancestry, identities, request sets and progress counters.
3. **Diagnose** — run `scripts/checkpoint_integrity.py`.
4. **Form hypothesis** — identify storage, lineage, serialization, identity or resume-routing cause.
5. **Implement correction** — smallest safe change; preserve evidence.
6. **Measure again** — reproduce resume, preferably after process/compute recreation.
7. **Improved?** — if no, revise hypothesis; maximum 2 attempts.
8. **Independent verification** — Resume Verification Agent reproduces the integrity result.
9. **Complete or block** — only resume consequential work after pass.

## Responsible agent
Resume Investigator for stages 1–7; Resume Verification Agent for stage 8.

## Tools
Checkpoint exporter, deterministic checker, unit tests, read-only logs and non-destructive replay.

## Outputs
Integrity reports, root-cause evidence, before/after state comparison, final pass/block decision.

## Checkpoints
Before restore, immediately after restore, first post-resume checkpoint, independent verification.

## Metrics
Resume integrity pass rate, ancestry failures, identity mismatches, request replay detections, rollback/restart detections and recovery time.

## Retry policy
Maximum 2 corrective attempts. Each retry must use new evidence and preserve prior reports.

## Stop conditions
Stop immediately on ambiguous approval state, duplicate consequential-action risk, unknown restored checkpoint, topology mismatch or exhausted retries.

## Failure path
Keep workflow paused. Restore last known-good version or start a new safe session only with explicit operational approval and documented reconciliation of pending work.

## Verification
The first post-resume checkpoint must satisfy lineage and state invariants; the verifier must confirm no answered request is replayed and no completed observable work is repeated/skipped.

## Definition of Done
Evidence captured; root cause identified; deterministic checks pass; recreation scenario tested when feasible; risks documented; independent verification complete; no blocking issue remains.
