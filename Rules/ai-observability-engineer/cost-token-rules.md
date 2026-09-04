# Cost and Token Observability Rules

## Purpose
Make AI operating cost attributable, explainable, and actionable while preserving quality and reliability.

## Scope
Applies to token usage, provider charges, embedding cost, retrieval cost, tool/API cost, caching, and request-level cost attribution.

## MUST
- Production AI paths MUST record enough usage metadata to estimate cost by model, feature, environment, and major traffic class.
- Cost calculations MUST document pricing version, units, exclusions, and currency assumptions.
- Token consumption MUST distinguish input, output, cached, and other provider-specific categories when available and materially relevant.
- Cost regressions MUST be correlated with traffic, model, prompt, retrieval, and routing changes before conclusions are drawn.
- Materially expensive workloads MUST have defined budgets or anomaly thresholds and an accountable owner.

## MUST NOT
- Cost reduction MUST NOT be reported as an improvement if quality, safety, or reliability materially regressed without explicit trade-off approval.
- Provider list prices MUST NOT be treated as exact realized cost when actual billing differs materially.
- High-cardinality identifiers MUST NOT be added to cost metrics without a documented need and bounded design.

## SHOULD
- Track cost per successful user outcome or other meaningful business unit where possible.
- Attribute retry and fallback cost separately.

## Exceptions
Approximate cost models are allowed when exact billing data is delayed, provided uncertainty is disclosed and reconciled later.

## Verification
Reconcile sampled telemetry with provider billing, inspect pricing configuration, validate attribution tests, and compare cost changes against deployment and traffic history.