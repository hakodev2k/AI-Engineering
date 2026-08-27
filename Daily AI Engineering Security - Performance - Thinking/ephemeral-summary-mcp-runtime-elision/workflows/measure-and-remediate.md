# Workflow — Measure and Remediate
## Trigger
Ephemeral/internal generation correlates with process, memory or latency growth.
## Goal
Reduce unnecessary runtime allocation using measured resource intent.
## Inputs
Feature-tagged traces, process/RSS measurements, effective MCP inventory, quality fixtures.
## Baseline
Run at least 20 identical one-shot generations or the smallest count that reliably reproduces growth. Capture process count, RSS, retained sessions and p50/p95 latency.
## Stages
1. Observe feature/session ownership.
2. Measure baseline.
3. Diagnose whether resources are allocated despite `tools_required=false` or retained after completion.
4. Form one hypothesis.
5. Implement admission/completion invariant.
6. Measure the same workload again.
7. If not improved, re-evaluate once; maximum two implementation attempts total.
8. Independent verification.
## Responsible agent
Performance investigator/implementer for stages 1–7; Performance Verifier for stage 8.
## Tools
Host process telemetry, logs, guard script, unit tests.
## Outputs
Before/after metrics, ownership evidence, root cause, verification result.
## Checkpoints
After baseline, before implementation, after repeat benchmark, before release.
## Metrics
MCP process delta, RSS delta, retained session count, cleanup latency, p50/p95 feature latency, quality pass rate.
## Retry policy
Maximum 2 hypotheses/implementation iterations.
## Stop conditions
Stop on quality regression, missing ownership data, pending tool work or no measurable improvement after retries.
## Failure path
Revert optimization; keep correctness; add ownership telemetry and escalate lifecycle bug.
## Verification
Independent verifier repeats benchmark and quality fixtures.
## Definition of Done
Measured improvement, no quality regression and no retained one-shot runtime.
