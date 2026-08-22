# Quality Metrics Rules
## Purpose
Use metrics to improve decisions without creating misleading incentives.
## Scope
Defects, coverage, pass rates, escape rates, flakiness, cycle time, and quality trends.
## MUST
- Define what each metric measures, its data source, limitations, and decision use.
- Interpret metrics with product risk and denominator/context.
- Investigate material trend changes before drawing causal conclusions.
## MUST NOT
- Use raw test-case count, defect count, or pass rate as a standalone measure of individual or team quality.
- Manipulate classification or scope to improve reported metrics.
## SHOULD
- Favor outcome and signal-quality measures such as escaped severity, detection effectiveness, and flaky-test rate.
## Exceptions
Proxy metrics are acceptable when their limitations are explicit and periodically validated.
## Verification
Audit metric definitions, source queries, trend interpretation, incentives, and decisions made from them.