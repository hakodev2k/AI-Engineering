# Skill: Budget Baseline and Attribution

## Purpose
Establish a measurable pre-control baseline for cumulative model spend and identify which execution sources consume it.

## Trigger
Use before enabling or changing runtime budget enforcement for an agent, workflow, or scheduled task.

## Inputs
- Provider usage records or traces.
- Task, agent, model, source, and attempt identifiers.
- Current model pricing.
- Existing retry, subagent, hook, and plugin behavior.
- Representative successful and failed runs.

## Preconditions
Usage data MUST distinguish input and output tokens where the provider exposes them. Cached-input tokens SHOULD be tracked separately. Price data MUST be dated and reviewed before measurement.

## Required context
The measurement window, expected workload mix, quality/SLO requirements, and known non-model costs.

## Allowed tools
Read-only trace queries, provider usage APIs, log processors, spreadsheets, deterministic scripts, and benchmark runners.

## Constraints
- MUST NOT infer exact monetary cost from tokens without a verified price table.
- MUST NOT merge parent and subagent usage when source attribution is available.
- MUST preserve failed and retried attempts in the baseline.
- MUST record missing usage as unknown rather than zero.

## Procedure
1. Define the unit of work: one task/run, one agent-day, and any portfolio-level window.
2. Collect at least 20 representative runs when practical; otherwise record the smaller sample size.
3. For every model call, classify source as `parent`, `subagent`, `retry`, `hook`, `plugin`, or another explicit value.
4. Record model, input tokens, cached input, output tokens, latency, and outcome.
5. Calculate total tokens, cost/task, p50/p95 cost, retry share, and child-agent share.
6. Identify expensive failure paths separately from successful paths.
7. Set a proposed wrap-up threshold above normal successful usage but below the hard limit.
8. Set the hard limit from risk tolerance and expected workload, not from the single highest historical run.
9. Run a shadow-mode reservation simulation against historical traces.
10. Report false blocks, runs that would have been wrapped up, and prevented overspend.

## Decision points
- If more than 5% of usage lacks source attribution, improve telemetry before hard enforcement.
- If estimate error exceeds 20% at p95, increase reservation conservatism or improve token estimation.
- If legitimate successful runs frequently exceed the proposed hard limit, redesign the workload or revise the limit with explicit approval.

## Expected output
A baseline report containing workload sample, distribution, top spend sources, proposed thresholds, estimate error, and shadow-mode results.

## Metrics
Tokens/task, USD/task, p50/p95 cost, retry cost share, subagent cost share, estimate error, false-block rate, and completion rate.

## Verification
A reviewer recomputes at least five sampled runs from raw provider usage and confirms attribution totals match the task totals.

## Failure handling
If provider usage is missing or delayed, mark the run `unreconciled`; do not use it to prove budget compliance.

## Stop conditions
Stop and escalate if reliable usage attribution cannot be obtained, pricing is unknown, or the proposed limit would require discarding correctness-critical context.
