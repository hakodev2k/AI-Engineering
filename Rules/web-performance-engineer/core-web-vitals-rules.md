# Core Web Vitals Rules

## Purpose
Protect field performance for loading, responsiveness, and visual stability using user-centered web metrics.

## Scope
Applies to LCP, INP, CLS, related diagnostic metrics, and production measurement of meaningful page journeys.

## MUST
- Evaluate Core Web Vitals using field data where sufficient traffic exists.
- Segment results by relevant device, geography, connection, page type, and user journey when aggregate data can hide regressions.
- Investigate regressions with supporting traces, attribution, or component-level evidence before broad remediation.
- Preserve metric semantics when changing instrumentation or analytics providers.

## MUST NOT
- Treat a single synthetic score as proof of production performance.
- Optimize one metric by materially degrading another critical user outcome without documented trade-off review.
- Exclude slow cohorts merely to improve reported compliance.

## SHOULD
- Use diagnostic metrics such as TTFB, long tasks, resource timing, and layout-shift attribution to explain field results.
- Track percentile distributions, not only pass/fail status.

## Exceptions
Any intentional metric trade-off requires evidence, affected cohorts, rationale, mitigation, and explicit review.

## Verification
Verify with RUM dashboards, CrUX or equivalent field data, browser traces, metric attribution, and regression comparisons.