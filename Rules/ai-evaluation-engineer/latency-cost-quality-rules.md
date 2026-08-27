# Latency, Cost, and Quality Trade-off Rules

## Purpose
Ensure AI evaluation captures operational trade-offs rather than optimizing quality in isolation.

## Scope
Applies to model selection, routing, context construction, tool orchestration, sampling, and inference configuration.

## MUST
- Candidate comparisons MUST measure quality together with latency and cost when those dimensions materially affect production viability.
- Latency measurements MUST distinguish representative percentiles and MUST NOT rely only on averages for user-facing systems.
- Cost estimates MUST include material model, retrieval, tool, retry, and orchestration costs associated with the evaluated path.
- Quality improvements that materially increase latency or cost MUST document the trade-off and acceptance criteria.
- Performance claims MUST be supported by measurements under comparable workloads and configurations.

## MUST NOT
- MUST NOT declare a candidate superior from quality score alone when it violates explicit latency or cost constraints.
- MUST NOT compare latency from different load levels or environments without disclosure.
- MUST NOT omit failed, retried, or timed-out requests when calculating realistic operational cost.

## SHOULD
- Evaluation reports SHOULD include Pareto-style comparisons rather than collapsing all dimensions into an arbitrary composite score.
- Representative long-context and tool-heavy cases SHOULD be included when they materially affect tail latency or spend.

## Exceptions
Early research prototypes may defer production-grade cost measurement if results are explicitly non-release and relative resource use is not decision-critical.

## Verification
Inspect run configuration, request traces, percentile calculations, token/tool accounting, baseline comparability, and documented acceptance thresholds. Recompute representative latency and cost summaries from raw telemetry.