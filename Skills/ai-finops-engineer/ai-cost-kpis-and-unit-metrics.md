# AI Cost KPIs and Unit Metrics

## Purpose
Define durable cost and efficiency metrics that connect AI spend to useful technical or business output. The goal is to make optimization, forecasting, and accountability decisions using meaningful denominators rather than raw spend alone.

## When to use
Use when building AI FinOps dashboards, defining optimization targets, comparing workloads, reviewing budgets, or measuring the effect of architecture and model changes.

## Inputs
- Reconciled spend data
- Request, token, job, and accelerator usage
- Model quality and task-success metrics
- Latency and reliability metrics
- Workload ownership metadata
- Business outcome metrics when available

## Preconditions
Source metrics must have documented definitions and sufficiently stable identifiers. Keep estimated and finalized financial data distinguishable.

## Context to inspect
Inspect differences between training and inference, batch and interactive workloads, production and experimentation, model/provider mix, failed requests, retries, commitments, credits, and changing workload complexity.

## Core knowledge
Useful AI cost KPIs often include cost per successful request, cost per million tokens, cost per inference minute, accelerator cost per training step, cost per training token/sample, cost per experiment, GPU productive utilization, commitment coverage/utilization, and idle-capacity ratio. A unit metric is only useful when its denominator corresponds to the decision being made. Quality-adjusted outcome metrics are stronger than raw usage metrics when reliable outcome data exists.

## Procedure
1. Identify the decisions each metric must support.
2. Inventory authoritative cost, usage, quality, and ownership sources.
3. Choose workload-specific economic units rather than forcing one universal KPI.
4. Define successful-output denominators when task quality is measurable.
5. Specify formulas, time windows, exclusions, currencies, and gross-versus-net cost treatment.
6. Segment metrics by team, product, model, environment, provider, and workload class where actionable.
7. Include failed work, retries, and idle resources in appropriate cost metrics.
8. Establish historical baselines and expected ranges.
9. Define alert thresholds or optimization targets only after baseline behavior is understood.
10. Reconcile numerator costs to authoritative billing datasets.
11. Test metric behavior against known workload changes.
12. Publish a metric dictionary and ownership model.
13. Review metrics periodically for denominator drift, gaming, or architecture changes.

## Decision points
- Prefer cost per successful business or technical outcome when the outcome can be measured reliably.
- Use technical units such as tokens or accelerator-hours for diagnosis when outcome metrics are unavailable.
- Keep list, amortized, and net cost views separate when each serves a different decision.
- Retire a KPI when teams can no longer influence it or its denominator no longer represents workload value.

## Common failure patterns
- Reporting total spend without a workload denominator.
- Comparing workloads whose quality or complexity differs materially.
- Mixing list price and net cost in one time series.
- Excluding retries and failed jobs, which hides waste.
- Changing metric definitions without versioning.
- Incentivizing teams to optimize a KPI while degrading reliability or quality.

## Verification
Recompute sample KPI values directly from source data. Confirm financial numerators reconcile to billing, denominators reconcile to workload telemetry, and known changes in traffic, model choice, or utilization produce directionally correct metric changes. Validate that quality guardrails prevent misleading cost improvements.

## Expected output
A versioned AI cost metric dictionary, unit-economics dataset or dashboard, baseline ranges, targets, ownership, and documented interpretation guidance.

## Stop conditions
Stop and escalate if reliable denominators are unavailable, quality-adjusted metrics cannot be measured for a high-risk optimization, source definitions conflict materially, or a proposed KPI creates incentives that could compromise safety or reliability.