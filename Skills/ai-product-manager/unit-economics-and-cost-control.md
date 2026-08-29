# AI Unit Economics and Cost Control

## Purpose
Manage AI feature economics across inference, retrieval, tools, storage, evaluation, human review, and support.

## When to use
Use before pricing, launch, scale-up, model changes, or when gross margin deteriorates.

## Inputs
Token/compute pricing, usage distributions, model routing, latency, tool costs, infrastructure costs, human-review costs, revenue model.

## Context to inspect
Prompt sizes, output lengths, cache hit rates, retrieval calls, retries, model mix, free-tier abuse, peak traffic, and cost by customer segment.

## Core knowledge
Average request cost hides long-tail usage and retries. Product economics depend on cost per successful user outcome, not cost per API call alone.

## Procedure
1. Map every variable cost in the AI request path.
2. Calculate cost per task and per successful outcome by major segment.
3. Identify long-context, retry, and high-output cost drivers.
4. Compare model routing and caching alternatives.
5. Define usage limits and pricing assumptions.
6. Quantify quality impact before cost optimization.
7. Set margin and cost guardrails.
8. Instrument ongoing cost attribution by feature and customer.
9. Revisit economics after model/provider pricing changes.

## Decision points
Use cheaper models when evals show acceptable quality. Prefer architectural savings such as caching or prompt reduction when they preserve product behavior.

## Common failure patterns
Ignoring retries and failed tasks, using average token cost only, optimizing cost before quality is measured, and offering unlimited high-cost workflows without controls.

## Verification
Reconcile modeled cost with billing and production telemetry and validate margin under realistic heavy-user scenarios.

## Expected output
A unit-economics model, cost drivers, optimization options, guardrails, and scale recommendations.

## Stop conditions
Stop when production usage or provider pricing data is too incomplete to support a defensible model.