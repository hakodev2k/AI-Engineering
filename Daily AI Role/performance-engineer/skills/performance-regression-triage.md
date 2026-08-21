# Performance Regression Triage

## Purpose
Rapidly isolate when, where, and why a measurable regression appeared.

## Procedure
1. Confirm the regression against an accepted baseline.
2. Identify first bad build/time window and affected workload.
3. Compare code, dependency, runtime, infrastructure, data, and configuration changes.
4. Segment by endpoint, tenant, geography, payload, cache state, and resource dimension.
5. Run binary or targeted isolation when change volume is large.
6. Profile the smallest reproducible case.
7. Rank mitigations by impact, reversibility, and risk.
8. Verify recovery against the original metric.

## Parallelism
Change-diff analysis, telemetry segmentation, and reproduction may run in parallel if they do not compete for the same test environment.

## Output
Regression cause or ranked hypotheses, mitigation, verification, and prevention action.

## Failure handling
After two unsuccessful isolation cycles, escalate with evidence gaps and proposed instrumentation.

## Stop condition
Regression is fixed and verified, or bounded uncertainty is explicitly handed off.