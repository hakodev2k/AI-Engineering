# Latency SLO Rules

## Purpose
Protect user-facing latency objectives with measurable, workload-aware controls.

## Scope
Applies to time-to-first-token, inter-token latency, request completion latency, and percentile objectives.

## MUST
- Define latency SLOs by request class and measurement boundary.
- Track percentile latency rather than relying on averages alone.
- Attribute latency across queueing, preprocessing, execution, postprocessing, and network stages.
- Validate changes against representative input and output lengths.

## MUST NOT
- Claim latency improvement without comparable before-and-after measurements.
- Optimize one percentile while ignoring regressions in agreed critical percentiles.
- Exclude failed or throttled requests from reports in a way that misrepresents user experience.

## SHOULD
- Maintain latency budgets for major pipeline stages.
- Investigate regressions with traces and runtime metrics before broad tuning.

## Exceptions
Temporary SLO deviations require documented impact, owner, mitigation, and expiry or recovery criteria.

## Verification
Use production histograms, trace analysis, benchmark suites, load tests, and release comparisons.