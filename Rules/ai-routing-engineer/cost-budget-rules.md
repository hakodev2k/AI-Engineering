# Cost Budget Rules

## Purpose
Control inference spend while preserving mandatory quality, safety, privacy, and latency requirements.

## Scope
Per-request cost, token budgets, provider pricing, route budgets, cost attribution, and optimization evidence.

## MUST
- Cost-sensitive routes MUST define measurable budget constraints or optimization objectives.
- Cost estimates MUST account for relevant input, output, tool, retry, and fallback consumption.
- Cost-based routing changes MUST be evaluated against quality and latency baselines before rollout.
- Cost attribution MUST identify route, model, provider, and workload class where practical.
- Unexpected cost growth MUST be observable and investigated using usage evidence.

## MUST NOT
- MUST NOT select an ineligible model or provider solely because it is cheaper.
- MUST NOT claim savings without normalized before/after workload evidence.
- MUST NOT use unbounded retries or fallback chains that defeat budget controls.

## SHOULD
- Prefer explicit budgets by workload class instead of one global threshold.
- Track cost per successful task or other business-relevant unit where feasible.

## Exceptions
Exceptions require quantified benefit, affected budget, duration, risk, and accountable approval.

## Verification
Inspect billing telemetry, token accounting, route configuration, evaluation comparisons, and budget alerts.