# Workflow: Measure → Canonicalize → Benchmark

## Trigger
Suspected prompt-cache churn or a planned cache optimization.

## Goal
Improve measured cache reuse/latency without reducing task quality or required context.

## Inputs
Representative traces, policy, provider usage fields, and existing quality tests.

## Baseline
Collect untouched production-like traces and record cache ratio, cache-write ratio, uncached tokens/task, p50/p95 latency, and quality result.

## Stages
1. **Observe** — identify costly repetitive workloads.
2. **Measure** — run `scripts/prefix_stability.py` on baseline traces.
3. **Diagnose** — choose the highest-evidence volatile stable section.
4. **Hypothesize** — state one concrete cause and expected metric change.
5. **Implement** — apply only safe deterministic serialization/layout changes.
6. **Measure again** — capture candidate traces under comparable conditions.
7. **Verify** — run profiler with `--quality-pass true` only after the independent quality suite passes.
8. **Complete** — save report and decision.

## Responsible agent
Performance investigator; implementation may be done by the owning application engineer. Quality verification must be independent of the optimization claim.

## Tools
Provider telemetry, profiler script, existing evaluation suite, benchmark harness.

## Outputs
Before/after report, hypothesis result, decision, residual risks.

## Checkpoints
After baseline, after diagnosis, after candidate measurement, after quality verification.

## Metrics
Cache ratio, cache-write ratio, stable-section change rate, uncached tokens/task, p95 latency, task success/regression rate.

## Retry policy
At most two optimization hypotheses per run. A retry requires new section-level evidence.

## Stop conditions
Stop on quality/security regression, invalid measurement, non-comparable workload, or two failed hypotheses.

## Failure path
Restore baseline layout, retain measurements, document the failed hypothesis, and escalate provider/runtime anomalies when prefix stability is already high.

## Verification
Profiler gate passes and independent quality suite passes on representative tasks.

## Definition of Done
Baseline captured; cause supported by evidence; candidate measured; quality verified; no configured metric regression; report reproducible; no required context removed.
