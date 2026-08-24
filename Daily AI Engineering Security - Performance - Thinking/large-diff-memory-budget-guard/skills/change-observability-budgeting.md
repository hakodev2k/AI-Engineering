# Skill — Change Observability Budgeting

## Purpose
Measure and bound the bytes consumed by file tracking, diff rendering, event serialization, logging, persistence, and history hydration before optimizing agent performance.

## Trigger
Large/generated files enter an agent change path; session RSS grows with edits; history records become very large; or a runtime is adding diff/history observability.

## Inputs
Repository/file paths, history JSONL, byte thresholds, peak RSS samples, changed-byte estimates, tracker/event/log/persistence sizes.

## Preconditions
Capture a baseline before changing thresholds. Preserve the ability to verify what changed even when full content is elided.

## Required context
File sizes, change metadata, event sizes, and representative memory measurements. Full file contents are not required for preflight size analysis.

## Allowed tools
`stat`, repository metadata, process RSS metrics, `scripts/large_change_profiler.py`, test runner, event/history size counters.

## Constraints
- Never claim a performance improvement without before/after measurements.
- Never silently drop change evidence; budget fallback MUST emit metadata, hash, and explicit elision reason.
- Security-sensitive or correctness-required content MUST NOT be removed solely to save memory; spill/reference it safely when necessary.
- Avoid reading entire oversized files merely to decide that they are oversized.

## Procedure
1. Measure baseline peak RSS, largest tracked file, largest diff/event/history record, and hydration latency.
2. Run the profiler on repository and representative history stores.
3. Map byte duplication across stages: source → tracker baseline/current → rendered diff → event clone → log → persisted record → UI/child context.
4. Calculate an amplification ratio where data is available.
5. Identify the first stage where a bounded representation can replace full content safely.
6. Define per-file, per-record, and per-task byte budgets.
7. Implement metadata/hash/excerpt or artifact-reference fallback before expensive copies occur.
8. Measure the same workload again.
9. If memory/record size is not reduced, revise once after identifying the remaining amplification stage.
10. Send evidence to an independent verifier.

## Decision points
- File exceeds tracking budget: metadata/reference path.
- Rendered diff exceeds budget: bounded summary/hunks plus hash/reference.
- Event/history record exceeds budget: reject or spill before persistence.
- Aggregate task budget exceeded: stop additional full-content tracking and surface degraded-observability status.

## Expected output
Baseline, amplification map, configured budgets, before/after metrics, fallback evidence, and verification status.

## Metrics
Peak RSS, bytes/tracked file, max diff/event/history record, hydration latency, disk/session bytes, amplification ratio, review-quality regression rate.

## Verification
Large fixtures must hit fallback before full-content tracking/persistence; normal files remain fully reviewable; peak memory and record sizes remain within declared bounds.

## Failure handling
If a byte source cannot be measured, mark it unknown and do not claim verified improvement. Prefer safe spill/reference over unbounded retention.

## Stop conditions
Verified bounded behavior; one failed optimization revision; correctness regression; or inability to preserve required change evidence.
