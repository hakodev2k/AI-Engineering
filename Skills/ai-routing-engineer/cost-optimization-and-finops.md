# Cost Optimization and FinOps

## Purpose
Optimize routing economics using measured end-to-end cost while preserving required quality, safety, latency, and contractual guarantees.

## When to use
Use when AI spend is material, model/provider prices differ, traffic grows, premium models are overused, or cost anomalies appear.

## Inputs
Provider pricing, token usage, cache discounts, batch pricing, request volume, retries, output length, quality metrics, latency SLOs, tenant economics, and budget targets.

## Preconditions
Cost attribution must include actual route, token counts, retries, fallback attempts, and relevant infrastructure charges.

## Context to inspect
Billing exports, gateway telemetry, model registry, routing rules, cache hit rates, tenant plans, provider commitments, and quality evaluation results.

## Core knowledge
Per-token price is only one component of effective cost. Poor routes can increase retries, output length, human correction, or downstream failures. Optimization should compare cost per successful workload outcome, not only cost per request.

## Procedure
1. Attribute spend by tenant, workload class, model, provider, and route reason.
2. Compute effective cost including retries and fallbacks.
3. Identify high-volume and high-variance cost drivers.
4. Compare eligible cheaper routes using workload-specific quality thresholds.
5. Evaluate prompt caching, batching, and context reduction opportunities.
6. Define budget-aware routing only after hard constraints are applied.
7. Add spend guardrails and anomaly alerts.
8. Run shadow or canary tests for cost-saving routes.
9. Measure cost per successful outcome after rollout.
10. Revisit provider commitments and capacity reservations using observed demand.

## Decision points
Prefer a more expensive route when it materially reduces failure or correction cost. Use budget caps to control optional workloads, not to silently degrade critical or high-risk requests below minimum quality.

## Common failure patterns
Routing by list price alone, excluding retry cost, ignoring output-token inflation, global cost cuts that harm premium tenants, and treating cache savings as guaranteed.

## Verification
Before/after analysis demonstrates spend reduction while quality, latency, safety, and policy metrics remain within defined guardrails.

## Expected output
A cost-attribution model, prioritized optimization actions, routing guardrails, and verified savings report.

## Stop conditions
Stop when proposed savings require violating minimum quality, safety, residency, contract, or reliability requirements.