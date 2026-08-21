# Skill — Cache Stability Analysis

## Purpose
Determine whether an agent's prompt-cache regression is caused by reusable-prefix instability rather than legitimate context changes.

## Trigger
Unexpected cache creation, cost/latency increase, hook rollout, runtime upgrade, or history-resume regression.

## Inputs
Chronological usage JSONL, runtime/model/version, hook configuration, known compaction events, and expected stable-prefix size.

## Preconditions
Usage records MUST preserve request order and provider token fields. Compare like-for-like model/runtime configurations.

## Required context
Know which request segments are intended to remain reusable and which fields are intentionally dynamic.

## Allowed tools
Read-only transcript/usage inspection, hashing, JSON diffing, `scripts/cache_trace_analyzer.py`, test runner.

## Constraints
Do not remove context required for correctness. Do not infer a cache bug from cost alone. Exclude TTL expiry, model changes, tool-list changes, compaction, and intentional prompt edits where evidence exists.

## Procedure
1. Capture a baseline with hooks disabled or a known-stable configuration.
2. Record per request: input, cache read, cache creation, output tokens, event/hook name, model and runtime version.
3. Run the analyzer and identify rewrite-ratio violations.
4. For each violation, compare the last known stable request with the first broken request.
5. Separate intentional differences from representation-only differences.
6. Canonicalize reusable hook payloads: deterministic key ordering, UTF-8, normalized newlines, one carrier/wrapper, no timestamps/IDs in the stable block.
7. Repeat the same scenario at least three times.
8. Accept only when token metrics improve and task-quality checks remain unchanged.

## Decision points
- If the cache break coincides with TTL/model/tool-set/compaction change, classify it separately.
- If semantic hook content is unchanged but its stable digest differs, treat serialization as the primary hypothesis.
- If the digest is stable but cache creation spikes, inspect other request-prefix components before changing hooks.

## Expected output
A baseline table, invalidation boundaries, competing hypotheses, chosen root cause, before/after token metrics, and verification status.

## Metrics
Rewrite ratio, cache-creation tokens/task, cache-read tokens/task, latency/task, cost/task, quality regression rate.

## Verification
Three repeated traces pass policy thresholds; deterministic tests pass; no required hook context is lost.

## Failure handling
Retain the original hook behavior and mark the optimization unverified when cause cannot be isolated.

## Stop conditions
Stop after three failed diagnosis/repair iterations, on missing usage evidence, or on any correctness regression.
