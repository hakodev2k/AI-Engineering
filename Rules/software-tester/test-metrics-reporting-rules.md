# Test Metrics and Reporting Rules

## Purpose
Use metrics to inform decisions without creating misleading quality claims.
## Scope
Dashboards, status reports, coverage, defect trends, execution metrics, and quality indicators.
## MUST
- Define metric meaning, source, scope, and limitations before using it for decisions.
- Report trends and risk context alongside aggregate execution numbers.
- Separate blocked, not-run, skipped, flaky, and failed outcomes when materially different.
## MUST NOT
- Treat number of test cases, automation percentage, or defect count as standalone quality measures.
- Manipulate classifications to improve dashboard appearance.
## SHOULD
- Prefer decision-oriented indicators such as critical-risk coverage, escape trends, and suite reliability.
## Exceptions
Simplified executive reporting must retain material caveats and residual risks.
## Verification
Trace dashboard values to source data and inspect definitions, exclusions, trends, and decision use.