# Workflow — Measure, Offload, Verify

## Trigger
A tool-heavy agent exceeds token/cost/latency budgets or shows rising context occupancy across long tasks.

## Goal
Reduce cumulative retained tool-result cost while preserving correctness, evidence, authorization and safety context.

## Inputs
Representative task set, baseline trace, budget config, task-quality checks and optional provider usage/cache telemetry.

## Baseline
Capture the complete trace before optimization and run the carry-cost profiler.

## Context
Use trace metadata first. Inspect raw payloads only when necessary to decide which fields are required.

## Stages
1. **Observe** — identify sessions with high input growth or context pressure.
2. **Measure baseline** — calculate direct tool tokens, carry tokens, amplification ratio and top contributors.
3. **Diagnose** — classify the highest contributors by relevance/lifetime.
4. **Form hypothesis** — choose one concrete intervention and predicted metric change.
5. **Implement improvement** — field projection, slicing, out-of-band artifact reference, programmatic chaining or earlier eviction.
6. **Measure again** — replay the same representative task set and generate a second report.
7. **Improved?** — require measurable carry/token reduction and equal-or-better quality. If no, revise once only.
8. **Independent verification** — Token Optimization Verifier checks provenance, hidden child calls, quality and security boundaries.

## Responsible agent
Optimization implementer for stages 1–7; `subagents/token-verifier.md` for stage 8.

## Tools
`python3 scripts/carry_cost_profiler.py`, application trace collector, benchmark/test harness, provider usage telemetry.

## Outputs
Baseline report, ranked candidates, hypothesis, optimized report, quality comparison and verifier record.

## Checkpoints
- Baseline exists before change.
- Highest contributor is identified by evidence, not intuition.
- Required context is explicitly classified before eviction/truncation.
- Before/after tasks are comparable.
- Hidden/subagent calls are included in task-level accounting where available.

## Metrics
Direct tool-result tokens, cumulative carry tokens, amplification ratio, tokens/task, latency/task, quality regression rate.

## Retry policy
Maximum two optimization attempts. A second attempt must use a revised hypothesis.

## Stop conditions
Complete on independent `VERIFIED`. Stop and revert on security/correctness regression. Stop after two non-improving attempts and document the irreducible cost.

## Failure path
Restore required context, keep the stricter correctness/security behavior, and escalate budget exceptions with evidence rather than raising thresholds silently.

## Verification
Profiler budget pass plus representative task-quality pass. Cache-cost improvements may be reported separately but cannot substitute for carry-token reduction when that is the claimed improvement.

## Definition of Done
Baseline captured; limitations/root cause documented; one targeted improvement implemented; before/after metrics collected; task quality equal or better; no security boundary weakened; verifier marks `VERIFIED`; no blocking budget issue remains.