# Cost, FinOps, and Capacity

## Purpose
Design AI solutions with explicit unit economics, capacity assumptions, and cost controls so quality improvements remain financially sustainable at production scale.

## When to use
Use during architecture design, provider selection, scale planning, budgeting, or unexpected spend investigation.

## Inputs
Traffic forecasts, task mix, model pricing, token distributions, retrieval/tool costs, infrastructure rates, concurrency, SLOs, and budget limits.

## Context to inspect
Inspect usage telemetry, token counts, model routing, cache behavior, retry rates, batch workloads, accelerator utilization if self-hosted, and provider pricing dimensions.

## Core knowledge
AI cost is workload-shaped. Unit cost depends on model class, input/output volume, repeated context, retries, tool calls, storage, retrieval, observability, and idle infrastructure. Cost optimization must preserve required quality and reliability.

## Procedure
1. Define the business unit of work such as request, conversation, document, or completed task.
2. Build a cost model for each workload class.
3. Estimate average and peak demand separately.
4. Measure token, retrieval, tool, and infrastructure contributions.
5. Identify waste from repeated context, unnecessary calls, retries, and overpowered models.
6. Evaluate routing, caching, batching, context reduction, and asynchronous processing.
7. Define budgets, quotas, anomaly alerts, and ownership.
8. Model growth and provider price changes.
9. Compare managed and self-hosted economics including operations.
10. Revalidate cost per successful outcome after optimization.

## Decision points
Use cheaper models only when evaluation confirms acceptable quality. Self-host when sustained utilization, control, or locality justifies fixed operational cost. Prefer cost per successful task over cost per raw request.

## Common failure patterns
Budgeting from average traffic only, ignoring output-token variance, optimizing model price while retries increase, and excluding engineering or infrastructure overhead from self-hosted comparisons.

## Verification
Measured unit cost and peak capacity remain within approved limits while quality, latency, and reliability gates still pass.

## Expected output
A cost and capacity model with unit economics, assumptions, optimization levers, budgets, and scaling triggers.

## Stop conditions
Stop when demand cannot be estimated, pricing inputs are unknown, or required quality makes the approved budget infeasible without a business decision.