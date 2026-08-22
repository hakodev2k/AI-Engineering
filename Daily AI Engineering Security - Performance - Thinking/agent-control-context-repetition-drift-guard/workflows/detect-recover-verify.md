# Workflow: Detect, Recover, Verify

## Trigger
After a continuation boundary or when repeated control acknowledgements/meta-work appear.

## Goal
Preserve the original deliverable while preventing unchanged control context from becoming a self-reinforcing task frame.

## Inputs
Goal ledger, acceptance criteria, continuation JSONL, policy.

## Baseline
Record stable top-level goal ID, current subtask ID, control-context hashes, and recent productive-action ratio before enabling automated continuation.

## Stages
1. **Observe:** append one trace record per continuation.
2. **Measure:** run the guard over the configured window.
3. **Diagnose:** distinguish duplicate injection, acknowledgement loop, actual goal drift, and ordinary low progress.
4. **Hypothesis:** identify which host injection or continuation boundary introduced the pattern.
5. **Implement improvement:** deduplicate unchanged control text or restore the top-level goal/subtask hierarchy. Preserve safety authority.
6. **Measure again:** require evidence-producing work in subsequent continuations and rerun the guard.
7. **Verify:** independent trajectory verifier checks acceptance evidence and goal continuity.

## Responsible agent
Coordinator records state; runtime host changes injection behavior; Trajectory Verifier independently checks recovery.

## Tools
Trace logger, package guard, task/plan state reader, artifact/test evidence.

## Outputs
Guard decision, drift evidence, recovery checkpoint, post-recovery metrics, verification verdict.

## Checkpoints
- Goal change has explicit user provenance.
- Safety constraints remain authoritative.
- Temporary reviewer/subagent scope remains subordinate.
- Next continuation after recovery produces task-relevant action/evidence.

## Metrics
Duplicate control injections, acknowledgement-only count, productive-action ratio, drift events, recovery count, acceptance evidence coverage.

## Retry policy
Maximum two recovery attempts. No unbounded automatic continuation.

## Stop conditions
Unauthorized goal drift, exhausted recoveries, low productive-action ratio after recovery, or missing trace integrity.

## Failure path
Stop autonomous execution, persist observed evidence, mark the task incomplete, and hand off to a human/runtime owner without inventing progress.

## Verification
A recovery is Verified when a fresh window remains on the original goal, duplicate/acknowledgement thresholds are respected, and concrete acceptance evidence increases.

## Definition of Done
Evidence documented; baseline state captured; deterministic guard runs; recovery bounded; safety preserved; original acceptance criteria have evidence; independent verification passes; no blocking drift remains.
