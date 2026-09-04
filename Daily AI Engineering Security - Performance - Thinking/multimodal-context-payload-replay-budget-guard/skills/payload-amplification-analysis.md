# Skill: Payload Amplification Analysis

## Purpose
Detect and quantify repeated multimodal payload propagation before optimizing context handling.

## Trigger
Use when a run contains inline images/media, large base64/data URLs, repeated compaction, child-agent inheritance, unexplained token growth, rollout-file growth, or abnormal network traffic.

## Inputs
Runtime/rollout JSONL, thread lineage, artifact bytes or stable hashes, token usage when available, and `config/payload-budget.json`.

## Preconditions
Preserve an unmodified evidence copy. Redact secrets before sharing. Do not delete rollout data as part of diagnosis.

## Required context
Thread ID, parent thread ID, event type, payload location, payload byte size, artifact hash, and timestamp. Token counts are recommended but are not substitutes for byte accounting.

## Allowed tools
Read-only file inspection, hashing, JSON parsing, token/usage telemetry, and `scripts/payload_replay_guard.py`.

## Constraints
MUST NOT discard an artifact required for correctness merely to meet a token target. MUST distinguish byte replay from provider cached-token accounting. MUST preserve lineage.

## Procedure
1. Capture baseline: total inline bytes, unique artifact bytes, replay ratio, per-thread payload bytes, per-child inherited bytes, tokens/task, rollout size, network bytes, compaction count.
2. Hash each payload using SHA-256 and construct `(thread, artifact_hash, event_type)` records.
3. Separate first appearance, legitimate rehydration, duplicate replay, and unknown-lineage events.
4. Rank artifacts by `replayed_bytes = bytes * max(0, appearances - 1)`.
5. Trace the top artifacts through parent/child lineage and compaction events.
6. Form one causal hypothesis at a time: inheritance replay, compaction duplication, retry replay, or malformed image recovery loop.
7. Apply the budget checker to the same dataset without modifying it.
8. Propose reference substitution only where the receiving step can recover the original artifact on demand.
9. Re-measure with an equivalent workload.

## Decision points
- Missing lineage for a heavyweight payload: block optimization and repair observability first.
- Same hash repeated without an explicit rehydration need: candidate for reference substitution.
- Quality requires original bytes: allow bounded rehydration and record it.
- Budget exceeded after two implementation iterations: stop and escalate architecture review.

## Expected output
Baseline table, top replayed artifacts, lineage explanation, hypothesis, proposed bounded change, before/after metrics, and verification status.

## Metrics
Replay ratio = total payload bytes / unique payload bytes; inherited bytes/child; bytes/artifact; tokens/task; rollout growth; network bytes; compaction count; quality regression rate.

## Verification
Use the same task fixture before and after. Success requires lower replayed bytes and token/network/storage pressure with equivalent acceptance-test results and no missing required visual evidence.

## Failure handling
Detection: malformed records, missing hashes/lineage, or inconsistent totals. Evidence: preserve offending records. Retry: one parsing correction and one instrumentation correction. Fallback: report unverified diagnosis; do not optimize blindly. Escalation: runtime owner. Stop after two failed diagnostic iterations.

## Stop conditions
Stop when the causal replay path is demonstrated and measurable, or when evidence is insufficient after two instrumentation attempts.
