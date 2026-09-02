# Trace Data Quality Rules

## Purpose
Ensure trace evidence is complete enough, internally consistent, and trustworthy for engineering decisions.

## Scope
Applies to missing spans, broken parentage, clock skew, attribute completeness, malformed telemetry, and sampling artifacts.

## MUST
- Critical trace paths MUST have defined expectations for required spans and attributes.
- Data-quality checks MUST distinguish instrumentation defects from genuine application behavior.
- Broken context propagation, invalid duration, impossible parentage, or persistent export loss MUST be treated as telemetry defects with owners.
- Root-cause conclusions MUST account for known sampling and instrumentation gaps.

## MUST NOT
- MUST NOT treat a visually complete trace as proof that all relevant work was captured.
- MUST NOT ignore systematic missing spans because aggregate dashboards still appear plausible.
- MUST NOT repair malformed telemetry in the backend in a way that hides the source instrumentation defect without tracking remediation.

## SHOULD
- Establish automated canary traces or synthetic flows for critical distributed paths.
- Track trace completeness and propagation success as operational quality indicators.

## Exceptions
Exceptions require known platform limitation, affected analyses, compensating evidence, owner, and remediation decision.

## Verification
Use synthetic traces, schema validation, collector drop metrics, propagation tests, timestamp sanity checks, and periodic manual inspection of critical user journeys.
