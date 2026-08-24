# Workflow — Measure, Diagnose, Optimize

## Trigger
Host-wide input/UI lag or resource growth correlated with a desktop AI agent.

## Goal
Produce a measurable, reproducible diagnosis and verify an improvement.

## Inputs
Process filter, app version, workload, threshold configuration.

## Baseline
With the target app fully closed, run the same probe duration and record p95/max gap. Then repeat while the affected app/workload is active.

## Stages
1. **Observe** — document symptom and environment.
2. **Measure baseline** — capture baseline JSON.
3. **Measure affected** — run `windows_host_probe.ps1` while symptom is present.
4. **Diagnose** — run `analyze_probe.py --baseline ... --affected ...` and apply the investigation skill.
5. **Form hypothesis** — choose one dominant signature and expected metric change.
6. **Optimize** — apply one safe intervention.
7. **Measure again** — rerun identical probe/workload.
8. **Improved?** — if no, re-evaluate once with new evidence; maximum two optimization attempts total.
9. **Independent verification** — benchmark reviewer checks raw evidence.
10. **Complete** — only after regression hook passes.

## Responsible agent
Performance investigator stages 1–8; independent benchmark reviewer stage 9.

## Tools
Windows probe, analyzer, OS counters, logs, profiler where available.

## Outputs
Raw probes, comparison reports, implementation change, verification result.

## Checkpoints
After baseline, affected measurement, each optimization attempt, final review.

## Metrics
p95/max gap, >64ms stalls, process CPU/working-set/I/O/process count, before/after ratios.

## Retry policy
At most two optimization attempts. A retry MUST change the hypothesis based on new evidence.

## Stop conditions
Pass thresholds and independent verification; or stop after two failed attempts and escalate.

## Failure path
Revert unhelpful optimization, retain measurements, identify missing profiler/runtime access, escalate.

## Definition of Done
Implemented: targeted change exists. Measured: baseline/affected/remeasure artifacts exist. Verified: analyzer threshold passes and independent reviewer accepts comparability and safety.
