# Cost and Budget Release Gates

## Purpose
Prevent AI releases from causing uncontrolled token, inference, retrieval, storage, or agent-execution cost while preserving required quality and safety.

## When to use
Use when changing models, context size, agent step limits, retries, caching, traffic routing, batch workloads, or provider pricing tiers.

## Inputs
Baseline cost per request/task, token usage, model pricing, request volume, cache behavior, agent steps, budget limits, forecast traffic.

## Preconditions
Usage telemetry can attribute spend to workload, model, tenant, or release variant.

## Context to inspect
Prompt size, generated-token limits, retries, fan-out, tool calls, batch jobs, cache hit rate, model routing, provider pricing, and quotas.

## Core knowledge
One logical AI task may produce many model calls. Small changes to context, retries, or autonomy can multiply spend nonlinearly. Cost must be evaluated together with quality, latency, and reliability.

## Procedure
1. Establish the current cost baseline by workload.
2. Estimate candidate cost using realistic token and call distributions.
3. Measure cost in evaluation and load tests.
4. Identify loops, retries, fan-out, and context-growth risks.
5. Validate request, token, step, and budget limits.
6. Compare alternative models or caching only where quality remains acceptable.
7. Define cost anomaly alerts and abort thresholds.
8. Forecast peak and monthly spend.
9. Canary with release-specific cost dimensions.
10. Record approved budget impact and residual uncertainty.

## Decision points
Prefer cheaper models only when task-specific quality and compliance requirements remain satisfied. Use hard caps for autonomous workflows whose cost can grow without user interaction.

## Common failure patterns
Tracking requests but not tokens, ignoring retries, using average prompt sizes, switching models solely on price, and releasing without spend attribution.

## Verification
Confirm measured candidate cost, forecast, and production canary spend remain within agreed tolerances.

## Expected output
A cost gate report with unit economics, forecast, guardrails, thresholds, and release decision.

## Stop conditions
Stop when expected spend exceeds approved limits or cost growth cannot be bounded and detected.