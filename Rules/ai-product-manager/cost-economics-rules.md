# Cost and Economics Rules

## Purpose
Ensure AI product economics remain viable as usage, context size, model choice, and quality requirements change.

## Scope
Applies to inference cost, vendor pricing, margins, quota design, monetization, and cost-sensitive product decisions.

## MUST
- Material AI features MUST have a documented unit-economics model tied to realistic usage distributions.
- Cost estimates MUST include model calls, retries, tool calls, storage, evaluation, moderation, and relevant infrastructure.
- Pricing or packaging changes MUST consider worst-case and high-percentile usage, not only averages.
- Model upgrades that materially change cost MUST be evaluated against measured quality or product-value gains.

## MUST NOT
- MUST NOT assume current vendor pricing will remain constant for long-term contractual commitments without sensitivity analysis.
- MUST NOT optimize cost by weakening required safety, privacy, or quality controls without approval.
- MUST NOT claim margin improvement without production or representative workload evidence.

## SHOULD
- Products SHOULD expose or enforce budgets where unbounded consumption is possible.
- Cost reviews SHOULD include caching, routing, smaller-model, batching, and deterministic alternatives.

## Exceptions
Exceptions require a documented economic rationale, downside bound, monitoring, and accountable approval.

## Verification
Inspect cost models, usage telemetry, vendor terms, sensitivity analysis, pricing assumptions, and before/after cost measurements.