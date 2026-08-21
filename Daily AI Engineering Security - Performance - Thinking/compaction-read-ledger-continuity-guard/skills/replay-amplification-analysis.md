# Skill: Replay Amplification Analysis

## Purpose
Measure whether unchanged tool/file content is being repeatedly read or resent, especially after context compaction, and identify a safe durable-reuse boundary.

## Trigger
Run when tokens/task rises, cache-read/input becomes unusually high, compaction occurs repeatedly, or the agent re-reads unchanged repository files.

## Inputs
Tool-read event trace, compaction turns, content hashes, token estimates, provider usage metrics, task-quality result, and current compaction/read-dedup implementation.

## Preconditions
Instrument read events with stable artifact identity and content/version hash. Preserve required evidence; do not prune first and measure later.

## Required context
Compaction lifecycle, tool-result history behavior, prompt-cache accounting, artifact versioning, and any in-memory read tracker.

## Allowed tools
Trace/database inspection, token accounting, hashing, profiling, repository inspection, `scripts/read_replay_guard.py`, and tests.

## Constraints
- Never remove context required for correctness solely to reduce tokens.
- Treat changed content as new evidence even when the artifact path is unchanged.
- Do not count a bounded metadata stub as a full-content replay.
- Separate provider cache metrics from logical context occupancy.

## Procedure
1. Capture a representative baseline session before optimization.
2. Normalize each file/tool read to artifact key + content hash + token estimate.
3. Mark compaction boundaries.
4. Run `python scripts/read_replay_guard.py trace.json --config config/budget.json`.
5. Rank duplicate unchanged reads by replayed tokens and whether they cross compaction.
6. Inspect where the existing read/dedup state lives and whether compaction rebuilds it.
7. Form a hypothesis: which durable ledger entry would avoid replay without losing evidence?
8. Implement a content-addressed ledger or artifact-reference path outside transient model history.
9. Repeat the same workload and collect tokens/task, duplicate ratio, latency, and quality.
10. If token use improves but quality regresses, reject the change and restore required context.

## Decision points
- Same artifact + same hash: eligible for reuse/stub after first full capture.
- Same artifact + changed hash: full/targeted new read is allowed.
- Different requested range/semantic need: may justify a targeted read; record reason.
- Ledger unavailable after compaction: treat as a continuity defect; do not guess that content is unchanged without a version/hash source.

## Expected output
Baseline and after profile, replay-heavy artifacts, root cause, ledger design, quality comparison, and verification status.

## Metrics
Duplicate read token ratio, post-compaction duplicate count, wasted duplicate tokens, cache-read/input ratio, tokens/task, latency/task, and quality regression rate.

## Verification
The same representative task shows reduced replay metrics while all required correctness/quality checks remain at or above the baseline acceptance threshold.

## Failure handling
Maximum two optimization hypotheses. If safe artifact identity/versioning cannot be established, keep the original context behavior and escalate rather than unsafe pruning.

## Stop conditions
Stop when replay budgets pass and quality is non-regressed, or after two failed hypotheses with evidence documented.
