# Data Profiling Rules
## Purpose
Use empirical distributions to discover quality risks and establish baselines.
## Scope
Cardinality, nulls, distributions, ranges, patterns, and correlations.
## MUST
- New critical sources MUST be profiled before quality thresholds are finalized.
- Profiles MUST be segmented where aggregate statistics conceal meaningful populations.
- Baselines MUST record the observation period and known seasonality.
## MUST NOT
- MUST NOT convert one-time observations into permanent thresholds without validation.
- MUST NOT expose sensitive raw values in profiling artifacts unnecessarily.
## SHOULD
- Profiles SHOULD be reproducible and comparable across releases.
## Exceptions
Restricted data may use privacy-preserving aggregates with documented limitations.
## Verification
Review profiling outputs, sampling method, segmentation, baseline history, and sensitive-data controls.