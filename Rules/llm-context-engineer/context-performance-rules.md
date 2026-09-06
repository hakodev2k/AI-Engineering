# Context Performance Rules

## Purpose
Control latency and compute overhead introduced by retrieval, ranking, transformation, and assembly.

## Scope
Retrieval latency, reranking, parsing, compression, serialization, and end-to-end context preparation.

## MUST
- Performance targets MUST be defined for latency-sensitive context stages.
- Optimization claims MUST use representative before/after measurements.
- Expensive reranking or transformation stages MUST have bounded input sizes.
- Timeouts MUST define safe fallback behavior.
- Performance regressions that violate agreed targets MUST be reviewed before release.

## MUST NOT
- MUST NOT trade correctness for latency without explicit evidence and approval.
- MUST NOT add parallel retrieval fan-out without measuring downstream load and latency.
- MUST NOT benchmark only warm-cache paths when cold paths occur in production.

## SHOULD
- Track percentile latency per context stage.
- Prefer early filtering before expensive ranking or transformation.

## Exceptions
Exceptions require documented benefit, impact, and verification.

## Verification
Inspect profiles, benchmarks, traces, timeout tests, and percentile dashboards.