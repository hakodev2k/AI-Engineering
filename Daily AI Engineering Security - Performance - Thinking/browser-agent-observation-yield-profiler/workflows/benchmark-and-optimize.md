# Workflow: Benchmark and Optimize

## Trigger
Browser-assisted workload exceeds latency/token budget, repeats stable observations, or compacts unexpectedly early.

## Goal
Reduce end-to-end latency and browser/model interaction overhead without reducing task success or required verification.

## Inputs
Benchmark task, browser environment, trace instrumentation, thresholds, required correctness/security checks.

## Baseline
Run the unchanged workload. Use at least three samples when variance is material. Record success, total duration, observations, unique states, progress events, tokens, model/tool latency and compactions.

## Context
Keep model, reasoning setting, login state, target application version, network class and success criteria stable where possible.

## Stages
1. **Observe** — capture complete timestamped trace.
2. **Measure baseline** — run profiler and store metrics.
3. **Diagnose** — classify dominant cost: duplicate stable observation, browser/tool latency, model re-entry, payload/context growth, or compaction/re-observe.
4. **Form hypothesis** — define one measurable change and expected metric movement.
5. **Optimize** — change one mechanism only.
6. **Measure again** — replay same workload.
7. **Improved?** — if no, re-evaluate once with new evidence; if yes, continue.
8. **Verify** — independent Performance Verifier checks success/security parity and metrics.

## Responsible agent
Performance Investigator owns stages 1–6. Performance Verifier independently owns stage 8.

## Tools
Browser trace/logs, model/tool telemetry, profiler script, benchmark tests.

## Outputs
Baseline profile, root-cause classification, hypothesis, change record, after-profile, verifier verdict.

## Checkpoints
After baseline; after diagnosis; before suppression/dedup changes; after replay; before completion.

## Metrics
End-to-end duration; observation count; unique state count; duplicate rate; observations/progress; tokens/progress; model/tool/unattributed latency; compactions; task success.

## Retry policy
Maximum two diagnose/optimize cycles. A retry must change the hypothesis based on new evidence.

## Stop conditions
Stop as verified only with preserved success/security and measurable improvement. Stop as blocked after two failed cycles or any unresolvable correctness/security regression.

## Failure path
Revert the behavioral optimization, preserve traces, document the bottleneck, escalate if platform-level telemetry is insufficient.

## Verification
Replay identical benchmark and compare medians when using multiple samples.

## Definition of Done
Baseline and after profiles exist; bottleneck and hypothesis documented; implementation measured; tests pass; task success preserved; metrics improve; independent verification complete.