# Workflow: Quarantine and Recover Persisted Tool Gaps

## Trigger
Runtime/app-server restart, resume failure, missing-tool-output error, or pre-resume scan anomaly.

## Goal
Prevent the model from reasoning over incomplete tool evidence and recover from the last verifiable state without duplicating side effects.

## Inputs
Persisted event history, checkpoint metadata, tool mutability, external evidence.

## Baseline
Record failed resumes, retries, usage consumed, unmatched-call count, and time-to-recovery before applying the guard.

## Stages
1. **Observe** — make a read-only copy of persisted history and runtime errors.
2. **Measure** — run `scripts/tool_gap_guard.py`.
3. **Diagnose** — classify unmatched calls, orphan results, duplicate IDs, and side-effect risk.
4. **Form hypothesis** — determine whether the gap is reconstructable from authoritative durable evidence.
5. **Implement recovery** — reconstruct exact evidence with provenance, or fork from the last verified checkpoint.
6. **Measure again** — rescan the recovered history.
7. **Verify** — independent reviewer confirms correlation integrity and side-effect safety.

## Checkpoints
Before any retry; before inserting reconstructed evidence; before forking; before mutation-capable tools resume.

## Metrics
Corrupt resumes blocked, unmatched calls, retries avoided, duplicate side effects, failed-resume usage, recovery duration, rework.

## Retry policy
At most two evidence-collection attempts. Never replay an unknown state-changing tool solely to discover whether it previously succeeded.

## Stop conditions
Complete only when post-recovery scan is clean and independent verification passes. Stop on ambiguous state-changing outcome requiring human decision.

## Failure path
Preserve original history, deny normal resume, select last verified checkpoint, or escalate.

## Definition of Done
Baseline captured; anomalies documented; recovery selected from evidence; scanner passes after recovery; independent verification passes; no unresolved side-effect ambiguity remains.
