# Skill: Observation Yield Analysis

## Purpose
Measure whether browser observations produce new state or task progress, and separate browser/tool time from model/orchestration delay.

## Trigger
Browser-assisted run exceeds latency/context budget, repeats page inspection, or compacts earlier than expected.

## Inputs
Timestamped trace, state hashes, token counts when available, latency values, progress markers, benchmark success result.

## Preconditions
Use the same benchmark goal and environment for before/after comparison. Normalize dynamic fields before hashing browser state.

## Required context
Task goal, required verification steps, browser/tool semantics, reasoning setting/model, run success criteria.

## Allowed tools
Read-only trace analysis, profiler script, deterministic benchmark runner, browser logs. No disabling security or correctness gates.

## Constraints
Do not remove required observations merely to improve metrics. Preserve login/approval/security checks and final verification. Do not claim improvement from one nondeterministic sample.

## Procedure
1. Capture at least one baseline; use three runs when variance is material.
2. Mark meaningful progress events independently of tool calls.
3. Compute duplicate-state rate, observations/progress and tokens/progress.
4. Attribute known model/tool latency; label the remainder rather than guessing.
5. Classify the dominant issue: repeated stable observations, expensive state payloads, excessive model re-entry, compaction/re-observe, or slow tool execution.
6. Form one hypothesis and change one control at a time.
7. Replay identical workload.
8. Compare medians where multiple samples are used.
9. Hand results to independent Performance Verifier.

## Decision points
High duplicate rate → investigate state-change gating/deduplication. High tool time → optimize browser/tool path. Low tool time but high end-to-end time → investigate model/orchestration. High tokens/progress → inspect retained observations and compaction behavior.

## Expected output
Baseline profile, root-cause classification, hypothesis, after-profile, success-quality comparison.

## Metrics
Duplicate observation rate; unique states; observations/progress; tokens/progress; model/tool/other latency; compaction count; task success.

## Verification
Same task must still succeed with equivalent required checks and no security regression.

## Failure handling
At most two hypothesis cycles. Revert to safer baseline if task quality or verification coverage regresses.

## Stop conditions
Stop on verified improvement or after two evidence-backed attempts without improvement; document unresolved bottleneck.