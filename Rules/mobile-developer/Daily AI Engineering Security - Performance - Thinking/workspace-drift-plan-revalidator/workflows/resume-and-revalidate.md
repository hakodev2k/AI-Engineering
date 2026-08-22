# Workflow — Resume and Revalidate

## Trigger
A persistent coding task is resumed, recovered after compaction/error, or is about to execute a plan created against an earlier repository state.

## Goal
Resume only when plan assumptions are valid for the current workspace.

## Inputs
Baseline checkpoint, repository, active plan, plan-critical paths/assumptions.

## Baseline
A successful `baseline` run and plan state captured at the same checkpoint.

## Stages
1. Observe — run the pre-resume hook.
2. Compare — classify as matched, drifted, or check-failed.
3. Diagnose — inspect changed dimensions and paths.
4. Form impact hypothesis — map drift to assumptions/test conclusions.
5. Refresh evidence — reread/retest only affected surfaces.
6. Decide — preserve, revise, or reject the plan.
7. Independent verification — Drift Verifier checks the decision.
8. Checkpoint — capture a new baseline only after acceptance.
9. Continue implementation.

## Responsible agent
Primary planner owns stages 1–6 and 8–9. Drift Verifier owns stage 7.

## Tools
`workspace_fingerprint.py`, Git read commands, scoped repository reads/search, relevant tests/build checks.

## Outputs
Validity record, revised plan when required, new checkpoint.

## Checkpoints
C1 deterministic comparison complete; C2 material drift mapped; C3 affected evidence refreshed; C4 independent verification complete.

## Metrics
Comparison time, changed-path count, reread count, assumptions revised, verification reruns, stale actions prevented.

## Retry policy
One retry for fingerprint/tool failure. At most two drift-classification passes. No autonomous retries after unresolved semantic conflict.

## Stop conditions
Complete when plan validity is verified against current state. Stop blocked when Git state cannot be read, drift cannot be bounded after two passes, or required evidence is unavailable.

## Failure path
Preserve old baseline, record failure evidence, do not implement from stale plan, escalate.

## Verification
Verifier confirms current evidence supports every material assumption used by the resumed plan.

## Definition of Done
Current state checked; drift handled; plan validity explicit; affected evidence refreshed; verifier passes; new baseline captured.