# Performance Measurement Rules

## Purpose
Make CDN performance decisions from reproducible evidence rather than intuition.

## Scope
Applies to latency, throughput, cache effectiveness, transport performance, origin offload, and user experience.

## MUST
- Performance changes MUST define baseline, target metric, measurement window, and comparison method.
- Measurements MUST separate cache hits, misses, and origin latency when diagnosing delivery performance.
- Tail latency MUST be considered for user-facing critical paths.
- Tests MUST represent relevant geographies, object sizes, protocols, and client conditions.
- Reported improvements MUST identify material confounders.

## MUST NOT
- MUST NOT claim improvement from a single synthetic location or one request.
- MUST NOT optimize only average latency when tail behavior drives user impact.
- MUST NOT compare unlike traffic populations without qualification.

## SHOULD
- Correlate synthetic, real-user, edge, and origin measurements.
- Prefer percentile distributions over isolated averages.
- Preserve benchmark definitions across comparisons.

## Exceptions
Limited evidence may support an emergency mitigation, but conclusions MUST be labeled provisional and validated afterward.

## Verification
Review dashboards, RUM/synthetic results, CDN logs, cache-status dimensions, origin timings, percentile distributions, and before/after experiment data.